import type { SupabaseClient } from "@supabase/supabase-js";
import { LESSON_1_PROGRESS_CHANGED, LESSON_1_PROGRESS_KEY, lesson1Snapshot, parseLesson1Progress } from "./lesson1Progress";
import { LESSON_2_PROGRESS_CHANGED, LESSON_2_PROGRESS_KEY, lesson2Snapshot, parseLesson2Progress } from "./lesson2Progress";
import { metaKey, readMeta, REMOTE_PROGRESS_APPLIED, type ProgressMeta } from "./localProgress";

export const progressLessons = [
  { id: "lesson-1", key: LESSON_1_PROGRESS_KEY, event: LESSON_1_PROGRESS_CHANGED, normalize: (raw: string | null) => lesson1Snapshot(parseLesson1Progress(raw)) },
  { id: "lesson-2", key: LESSON_2_PROGRESS_KEY, event: LESSON_2_PROGRESS_CHANGED, normalize: (raw: string | null) => lesson2Snapshot(parseLesson2Progress(raw)) },
];
type Snapshot = ReturnType<(typeof progressLessons)[number]["normalize"]>;
export type Candidate = { data: Snapshot; meta: ProgressMeta | null };
const OWNER = "chino-a1:progress-owner";
const archiveKey = (user: string) => `chino-a1:progress-account:${user}`;

function announce(lesson: (typeof progressLessons)[number]) {
  window.dispatchEvent(new CustomEvent(lesson.event, { detail: { remote: true } }));
  window.dispatchEvent(new CustomEvent(REMOTE_PROGRESS_APPLIED, { detail: { key: lesson.key } }));
}

// The active lesson keys are a view of one owner's workspace, including guests.
// Save the old workspace before switching; never adopt anonymous answers on login.
export function prepareAccount(userId: string | null) {
  const owner = window.localStorage.getItem(OWNER);
  if (owner === userId) return;
  const keys = progressLessons.flatMap(({ key }) => [key, metaKey(key)]);
  const guestArchive = "chino-a1:progress-guest";
  const previousArchive = owner ? archiveKey(owner) : guestArchive;
  const nextArchive = userId ? archiveKey(userId) : guestArchive;
  const saved = JSON.parse(window.localStorage.getItem(nextArchive) || "{}") as Record<string, string | null>;
  window.localStorage.setItem(previousArchive, JSON.stringify(Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)]))));
  for (const key of keys) {
    if (typeof saved[key] === "string") window.localStorage.setItem(key, saved[key]);
    else window.localStorage.removeItem(key);
  }
  if (userId) window.localStorage.setItem(OWNER, userId);
  else window.localStorage.removeItem(OWNER);
  progressLessons.forEach(announce);
}

function advancement(data: Snapshot) {
  const answered = Object.keys(data.answers).length + Object.keys(data.meanings).length + Object.keys(data.sounds).length;
  return Number(data.sessionCompleted) * 10000 + data.progress * 100 + answered;
}

export function chooseProgress(local: Candidate, remote: Candidate): Candidate {
  const localTime = local.meta ? Date.parse(local.meta.updatedAt) : 0;
  const remoteTime = remote.meta ? Date.parse(remote.meta.updatedAt) : 0;
  // Known revisions include intentional resets / repeated exercises / backwards navigation.
  if (localTime && remoteTime && localTime !== remoteTime) return localTime > remoteTime ? local : remote;
  if (local.meta?.reset && localTime >= remoteTime) return local;
  if (remote.meta?.reset && remoteTime >= localTime) return remote;
  // Legacy local data has no timestamp: keep the more advanced valid snapshot.
  return advancement(remote.data) > advancement(local.data) ? remote : local;
}

function syncError(code?: string) {
  return new Error(code === "42P10"
    ? "Falta el constraint único (user_id, lesson_id) en user_progress. Tu progreso sigue guardado en este navegador."
    : "No se ha podido sincronizar. Tu progreso sigue guardado en este navegador; volveremos a intentarlo.");
}

function validLocal(raw: string | null) {
  if (raw === null) return true; // explicit reset metadata may accompany an absent key
  try {
    const data = JSON.parse(raw);
    return data?.version === 1 && typeof data.sessionCompleted === "boolean";
  } catch { return false; }
}

export async function syncProgress(client: SupabaseClient, userId: string, signal: AbortSignal) {
  const current = () => !signal.aborted && window.localStorage.getItem(OWNER) === userId;
  for (const lesson of progressLessons) {
    if (!current()) return;
    const before = window.localStorage.getItem(lesson.key);
    const beforeMeta = window.localStorage.getItem(metaKey(lesson.key));
    const local: Candidate = { data: lesson.normalize(before), meta: validLocal(before) ? readMeta(lesson.key) : null };
    const { data: rows, error } = await client.from("user_progress")
      .select("id,data,updated_at").eq("user_id", userId).eq("lesson_id", lesson.id).limit(2).abortSignal(signal);
    if (!current()) return;
    if (error) throw syncError(error.code);
    if (rows && rows.length > 1) throw new Error("Hay filas duplicadas en user_progress para esta lección. No se han sobrescrito; revisa la tabla en Supabase.");
    const row = rows?.[0];
    let winner = local;
    if (row) {
      if (!row.data || row.data.version !== 1 || typeof row.data.sessionCompleted !== "boolean") {
        throw new Error("El progreso remoto tiene un formato no compatible. Se conserva sin sobrescribirlo.");
      }
      const timestamp = row.data._sync?.updatedAt || row.updated_at;
      const remote: Candidate = {
        data: lesson.normalize(JSON.stringify(row.data)),
        meta: Number.isFinite(Date.parse(timestamp)) ? { updatedAt: timestamp, reset: row.data._sync?.reset === true } : null,
      };
      winner = chooseProgress(local, remote);
    }
    // The learner may have answered while the request was in flight. Retry next pass.
    if (before !== window.localStorage.getItem(lesson.key) || beforeMeta !== window.localStorage.getItem(metaKey(lesson.key))) continue;
    if (!row && !before && !local.meta) continue;
    const meta = winner.meta || { updatedAt: new Date().toISOString(), reset: false };
    const raw = meta.reset ? null : JSON.stringify(winner.data);
    if (raw !== before) {
      if (raw === null) window.localStorage.removeItem(lesson.key);
      else window.localStorage.setItem(lesson.key, raw);
      window.localStorage.setItem(metaKey(lesson.key), JSON.stringify(meta));
      announce(lesson);
    } else window.localStorage.setItem(metaKey(lesson.key), JSON.stringify(meta));
    const payload = {
      user_id: userId, lesson_id: lesson.id, progress: winner.data.progress, score: winner.data.score,
      completed: winner.data.sessionCompleted, data: { ...winner.data, _sync: meta }, updated_at: meta.updatedAt,
    };
    if (row && JSON.stringify(lesson.normalize(JSON.stringify(row.data))) === JSON.stringify(winner.data)
      && row.data._sync?.updatedAt === meta.updatedAt && row.data._sync?.reset === meta.reset) continue;
    if (!current()) return;
    // Existing rows use an optimistic revision check. New rows require a DB unique
    // constraint; never fall back to an unsafe select-then-insert sequence.
    const result = row
      ? await client.from("user_progress").update(payload).eq("user_id", userId).eq("lesson_id", lesson.id).eq("id", row.id).eq("updated_at", row.updated_at).select("id").abortSignal(signal)
      : await client.from("user_progress").upsert({ ...payload, id: crypto.randomUUID() }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true }).select("id").abortSignal(signal);
    if (result.error) throw syncError(result.error.code);
    if (!result.data?.length) throw syncError(); // concurrent change: read it on retry
  }
}
