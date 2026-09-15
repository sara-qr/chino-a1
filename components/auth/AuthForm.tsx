"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";

export function AuthForm({ register = false }: { register?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseClient();
    if (!client) { setMessage("Falta configurar la conexión con Supabase. Puedes continuar estudiando sin cuenta."); return; }
    setBusy(true); setMessage("");
    try {
      const result = register
        ? await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/login` } })
        : await client.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        const code = result.error.code;
        setMessage(code === "email_not_confirmed" ? "Confirma tu email antes de iniciar sesión."
          : code === "invalid_credentials" ? "Email o contraseña incorrectos."
          : code === "weak_password" ? "Elige una contraseña más larga y segura."
          : code === "over_email_send_rate_limit" || code === "over_request_rate_limit" ? "Demasiados intentos. Espera unos minutos y vuelve a intentarlo."
          : "No se ha podido completar la operación. Comprueba los datos y la conexión e inténtalo de nuevo.");
        return;
      }
      setPassword("");
      if (result.data.session) router.replace("/dashboard");
      else setMessage("Revisa tu correo para confirmar la cuenta. Después podrás iniciar sesión.");
    } catch { setMessage("No se ha podido conectar. Tu progreso local sigue disponible."); }
    finally { setBusy(false); }
  }
  return <main lang="es" className="min-h-screen bg-[#F6F1E8] px-6 py-12 text-[#10284F]">
    <section className="mx-auto max-w-md rounded-[2rem] border border-[#10284F]/15 bg-[#FFFCF5] p-7 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]">Tu chino, paso a paso</p>
      <h1 className="mt-3 font-serif text-4xl">{register ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <p className="mt-4 text-sm leading-relaxed">Guarda tu progreso en la nube y continúa desde otro dispositivo. También puedes seguir estudiando sin cuenta.</p>
      {user ? <p className="mt-6">Ya has iniciado sesión. <Link className="underline" href="/dashboard">Volver al inicio</Link></p> : <form onSubmit={submit} className="mt-7 space-y-5">
        <div><label htmlFor="email" className="block text-sm font-medium">Email</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#10284F]/25 bg-white p-3 focus-visible:outline-2 focus-visible:outline-[#1748D5]" /></div>
        <div><label htmlFor="password" className="block text-sm font-medium">Contraseña</label><input id="password" name="password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={register ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#10284F]/25 bg-white p-3 focus-visible:outline-2 focus-visible:outline-[#1748D5]" />{register && <p className="mt-2 text-xs">Al menos 8 caracteres.</p>}</div>
        <button disabled={busy} className="w-full rounded-full bg-[#1748D5] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Un momento…" : register ? "Registrarse" : "Iniciar sesión"}</button>
      </form>}
      {message && <p role="status" className="mt-5 rounded-xl border border-[#10284F]/15 p-3 text-sm">{message}</p>}
      <div className="mt-6 flex flex-wrap gap-4 text-sm underline"><Link href={register ? "/login" : "/register"}>{register ? "Ya tengo cuenta" : "Crear cuenta"}</Link><Link href="/dashboard">Seguir estudiando</Link></div>
    </section>
  </main>;
}
