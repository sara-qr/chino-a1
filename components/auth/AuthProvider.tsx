"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import { prepareAccount, progressLessons, syncProgress } from "@/lib/progress/syncProgress";

const AuthContext = createContext<{ user: User | null; ready: boolean; status: string; signOut: () => Promise<void> }>({ user: null, ready: false, status: "", signOut: async () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    let active = true;
    const client = getSupabaseClient();
    if (!client) {
      queueMicrotask(() => { if (active) { setReady(true); setStatus("Conexión no configurada. Puedes seguir estudiando en este navegador."); } });
      return () => { active = false; };
    }
    function applyUser(nextUser: User | null) {
      try {
        prepareAccount(nextUser?.id ?? null);
        setUser(nextUser);
      } catch {
        setUser(null);
        setStatus("No se ha podido preparar el progreso de la cuenta. La sincronización está pausada para conservar tus datos locales.");
      }
      setReady(true);
    }
    let authEventReceived = false;
    // The callback stays synchronous: no Supabase calls inside its auth lock.
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (active) { authEventReceived = true; if (event === "SIGNED_OUT") setStatus(""); applyUser(session?.user ?? null); }
    });
    client.auth.getSession().then(({ data, error }) => {
      if (!active || authEventReceived) return;
      if (!error) applyUser(data.session?.user ?? null);
      else setReady(true);
      if (error) setStatus("No se ha podido recuperar tu cuenta. El progreso local sigue disponible.");
    }).catch(() => { if (active) { setReady(true); setStatus("Sin conexión con tu cuenta. Puedes continuar en local."); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    const client = getSupabaseClient();
    if (!client) return;
    const controller = new AbortController();
    let running = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout>;
    async function run() {
      if (controller.signal.aborted) return;
      if (running) { pending = true; return; }
      running = true;
      try {
        setStatus("Sincronizando progreso…");
        const task = async () => {
          if (controller.signal.aborted) return;
          await syncProgress(client!, userId!, controller.signal);
        };
        if (navigator.locks) await navigator.locks.request(`chino-a1:sync:${userId}`, { signal: controller.signal }, task);
        else await task();
        if (!controller.signal.aborted) setStatus("Progreso sincronizado");
      } catch (error) {
        if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : "Sin conexión. Tu progreso sigue guardado en este navegador.");
      } finally {
        running = false;
        if (pending && !controller.signal.aborted) { pending = false; schedule(); }
      }
    }
    function schedule(event?: Event) {
      if (event instanceof CustomEvent && event.detail?.remote) return;
      clearTimeout(timer);
      timer = setTimeout(() => { void run(); }, 500);
    }
    function storage(event: StorageEvent) {
      if (event.key === null || progressLessons.some(({ key }) => event.key === key || event.key === `${key}:sync`)) schedule();
    }
    schedule();
    progressLessons.forEach(({ event }) => window.addEventListener(event, schedule));
    window.addEventListener("online", schedule);
    window.addEventListener("storage", storage);
    const interval = setInterval(schedule, 30000);
    return () => {
      controller.abort(); clearTimeout(timer); clearInterval(interval);
      progressLessons.forEach(({ event }) => window.removeEventListener(event, schedule));
      window.removeEventListener("online", schedule); window.removeEventListener("storage", storage);
    };
  }, [userId]);

  async function signOut() {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) { setStatus("No se ha podido cerrar sesión. Inténtalo de nuevo cuando tengas conexión."); return; }
      setUser(null); setStatus("");
    } catch { setStatus("No se ha podido cerrar sesión. Tu progreso local se conserva."); }
  }
  return <AuthContext.Provider value={{ user, ready, status, signOut }}>{children}</AuthContext.Provider>;
}
