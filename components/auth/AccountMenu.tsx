"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function AccountMenu() {
  const { user, ready, status, signOut } = useAuth();
  return <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-x-4 gap-y-1 px-6 pb-3 text-xs text-[#43546A] lg:px-8">
    {!ready ? <span>Conectando cuenta…</span> : user ? <>
      <span className="max-w-60 truncate" title={user.email}>{user.email || "Mi cuenta"}</span>
      <button onClick={() => { void signOut(); }} className="rounded-full border border-[#12263F]/20 px-3 py-1.5 hover:bg-white focus-visible:outline-2">Cerrar sesión</button>
    </> : <Link href="/login" className="rounded-full border border-[#12263F]/20 px-3 py-1.5 hover:bg-white">Iniciar sesión</Link>}
    {status && <span role="status" className="w-full text-right">{status}</span>}
  </div>;
}
