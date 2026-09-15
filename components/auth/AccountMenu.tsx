"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

const pillStyle = "inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border border-[#12263F]/20 bg-[#FFFCF5] px-3 py-2 text-xs font-medium text-[#12263F] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123EBB]";

export function AccountMenu() {
  const { user, ready, status, signOut } = useAuth();
  if (!ready) return <span className={pillStyle} role="status">Conectando…</span>;
  if (!user) return <>
    <Link href="/login" className={pillStyle} title={status || undefined}>Entrar</Link>
    {status && <span role="status" className="sr-only">{status}</span>}
  </>;
  return <details className="group text-xs text-[#43546A]">
    <summary className={`${pillStyle} cursor-pointer list-none gap-2 [&::-webkit-details-marker]:hidden`}>
      Mi cuenta<span aria-hidden="true" className="text-[10px] transition-transform group-open:rotate-180">▾</span>
    </summary>
    <div className="absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#12263F]/15 bg-[#FFFCF5] p-4 shadow-lg">
      <p className="break-words font-medium text-[#12263F]">{user.email || "Mi cuenta"}</p>
      {status && <p role="status" className="mt-2 leading-relaxed">{status}</p>}
      <button onClick={() => { void signOut(); }} className={`${pillStyle} mt-3 w-full`}>Cerrar sesión</button>
    </div>
  </details>;
}
