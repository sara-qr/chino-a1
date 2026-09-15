import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
// Compile only these pure local modules in memory; no browser or network needed.
const modules = new Map();
function load(file) {
  file = path.resolve(testDirectory, '..', file);
  if (!path.extname(file)) file += '.ts';
  if (modules.has(file)) return modules.get(file).exports;
  const compiledModule = { exports: {} }; modules.set(file, compiledModule);
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'module', 'exports', output)((id) => load(path.resolve(path.dirname(file), id)), compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const sync = load('lib/progress/syncProgress.ts');
const local = load('lib/progress/localProgress.ts');
const l1 = load('lib/progress/lesson1Progress.ts');
const l2 = load('lib/progress/lesson2Progress.ts');
function setup() {
  const values = new Map();
  global.window = Object.assign(new EventTarget(), { localStorage: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  } });
  return values;
}
function fakeClient(rows = [], fail = null, beforeRead = () => {}) {
  const writes = [];
  return { rows, writes, from(table) {
    assert.equal(table, 'user_progress');
    let op = 'read', payload, options; const filters = {};
    const query = {
      select() { return query; }, limit() { return query; },
      eq(key, value) { filters[key] = value; return query; },
      update(value) { op = 'update'; payload = value; return query; },
      upsert(value, opts) { op = 'upsert'; payload = value; options = opts; return query; },
      async abortSignal(signal) {
        if (signal.aborted) return { data: null, error: { code: 'aborted' } };
        if (fail) return { data: null, error: { code: fail } };
        if (op === 'read') { beforeRead(); return { data: rows.filter((r) => r.user_id === filters.user_id && r.lesson_id === filters.lesson_id).map((r) => ({ ...r })), error: null }; }
        writes.push({ op, payload, filters, options });
        if (op === 'upsert') {
          assert.deepEqual(options, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true });
          if (rows.some((r) => r.user_id === payload.user_id && r.lesson_id === payload.lesson_id)) return { data: [], error: null };
          rows.push(payload);
        } else {
          const row = rows.find((r) => Object.entries(filters).every(([key, value]) => r[key] === value));
          if (!row) return { data: [], error: null };
          Object.assign(row, payload);
        }
        return { data: [{ id: payload.id || filters.id }], error: null };
      },
    }; return query;
  } };
}
const run = (client, user = 'user-a') => sync.syncProgress(client, user, new AbortController().signal);
const completed = () => ({ ...l1.initialLesson1State(), phase: 5, sessionCompleted: true, tutorCompleted: true });

test('legacy completion beats an undated empty local/remote snapshot; newer reset wins', () => {
  setup();
  const full = { data: l1.lesson1Snapshot(completed()), meta: null };
  const empty = { data: l1.lesson1Snapshot(l1.initialLesson1State()), meta: null };
  assert.equal(sync.chooseProgress(full, empty), full);
  const reset = { ...empty, meta: { updatedAt: '2026-09-14T12:00:00Z', reset: true } };
  const old = { ...full, meta: { updatedAt: '2026-09-14T11:00:00Z', reset: false } };
  assert.equal(sync.chooseProgress(old, reset), reset);
  assert.equal(sync.chooseProgress(reset, old), reset);
});

test('both lessons upload once, recover remotely, and reset only lesson 2', async () => {
  setup(); sync.prepareAccount('user-a');
  l1.saveLesson1Progress(completed());
  l2.saveLesson2Progress({ ...l2.initialLesson2State(), phase: 5, sessionCompleted: true });
  const client = fakeClient(); await run(client);
  assert.equal(client.rows.length, 2);
  assert.ok(client.rows.every((r) => r.user_id === 'user-a' && r.completed && r.progress === 100));
  await run(client); assert.equal(client.writes.length, 2);
  const first = window.localStorage.getItem(l1.LESSON_1_PROGRESS_KEY);
  window.localStorage.removeItem(l2.LESSON_2_PROGRESS_KEY); window.localStorage.removeItem(local.metaKey(l2.LESSON_2_PROGRESS_KEY));
  await run(client); assert.equal(l2.loadLesson2Progress().sessionCompleted, true);
  l2.clearLesson2Progress(); l2.saveLesson2Progress(l2.initialLesson2State()); await run(client);
  assert.equal(client.rows.find((r) => r.lesson_id === 'lesson-2').completed, false);
  assert.equal(window.localStorage.getItem(l1.LESSON_1_PROGRESS_KEY), first);
  await run(client); assert.equal(window.localStorage.getItem(l2.LESSON_2_PROGRESS_KEY), null);
});

test('network error preserves local data and retries without duplicates', async () => {
  setup(); sync.prepareAccount('user-a'); l1.saveLesson1Progress(completed());
  const before = window.localStorage.getItem(l1.LESSON_1_PROGRESS_KEY);
  await assert.rejects(run(fakeClient([], 'network')));
  assert.equal(window.localStorage.getItem(l1.LESSON_1_PROGRESS_KEY), before);
  const client = fakeClient(); await run(client); await run(client); assert.equal(client.rows.length, 1);
});

test('account switch archives local progress without sharing it with another account', () => {
  setup(); l1.saveLesson1Progress(completed()); sync.prepareAccount('user-a');
  sync.prepareAccount('user-b'); assert.equal(l1.loadLesson1Progress().sessionCompleted, false);
  l1.saveLesson1Progress({ ...l1.initialLesson1State(), phase: 1 });
  sync.prepareAccount('user-a'); assert.equal(l1.loadLesson1Progress().sessionCompleted, true);
  sync.prepareAccount('user-b'); assert.equal(l1.loadLesson1Progress().phase, 1);
});

test('a response arriving after a new answer cannot overwrite it', async () => {
  setup(); sync.prepareAccount('user-a'); l1.saveLesson1Progress({ ...l1.initialLesson1State(), phase: 1 });
  let changed = false;
  const client = fakeClient([], null, () => { if (!changed) { changed = true; l1.saveLesson1Progress({ ...l1.initialLesson1State(), phase: 2, answers: { intro: '4' } }); } });
  await run(client); assert.equal(client.writes.length, 0);
  assert.equal(l1.loadLesson1Progress().answers.intro, '4');
  await run(client); assert.equal(client.rows[0].data.answers.intro, '4');
});

test('missing constraint and duplicate remote rows fail safely', async () => {
  setup(); sync.prepareAccount('user-a'); l1.saveLesson1Progress(completed());
  await assert.rejects(run(fakeClient([], '42P10')), /constraint único/);
  const rows = [1, 2].map((id) => ({ id, user_id: 'user-a', lesson_id: 'lesson-1' }));
  const client = fakeClient(rows); await assert.rejects(run(client), /duplicadas/); assert.equal(client.writes.length, 0);
  assert.equal(l1.loadLesson1Progress().sessionCompleted, true);
});

test('corrupt local data cannot overwrite valid remote completion using a stale timestamp', async () => {
  setup(); sync.prepareAccount('user-a');
  const data = l1.lesson1Snapshot(completed());
  const row = { id: 'row-1', user_id: 'user-a', lesson_id: 'lesson-1', updated_at: '2026-09-01T12:00:00Z', data };
  window.localStorage.setItem(l1.LESSON_1_PROGRESS_KEY, '{broken');
  window.localStorage.setItem(local.metaKey(l1.LESSON_1_PROGRESS_KEY), JSON.stringify({ updatedAt: '2026-09-14T12:00:00Z', reset: false }));
  await run(fakeClient([row]));
  assert.equal(l1.loadLesson1Progress().sessionCompleted, true);
});

test('unsupported remote data and cancelled sessions never write to the cloud', async () => {
  setup(); sync.prepareAccount('user-a'); l1.saveLesson1Progress(completed());
  const client = fakeClient([{ id: 'row-1', user_id: 'user-a', lesson_id: 'lesson-1', data: { version: 2 } }]);
  await assert.rejects(run(client), /no compatible/);
  assert.equal(client.writes.length, 0);
  const controller = new AbortController(); controller.abort();
  const empty = fakeClient(); await sync.syncProgress(empty, 'user-a', controller.signal);
  assert.equal(empty.writes.length, 0);
  assert.equal(l1.loadLesson1Progress().sessionCompleted, true);
});
