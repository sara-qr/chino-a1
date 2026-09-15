"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/auth/AccountMenu";

const links = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/course", label: "Curso" },
  { href: "/review", label: "Repaso" },
  { href: "/vocabulary", label: "Vocabulario" },
  { href: "/characters", label: "Caracteres" },
  { href: "/progress", label: "Progreso" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#12263F]/10 bg-[#F6F1E8]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-8">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-3 text-[#12263F]"
        >
          <span aria-hidden="true" className="relative isolate block h-10 w-10 shrink-0">
            <span className="absolute inset-[3px] translate-x-0.5 rotate-[10deg] rounded-[0.7rem] rounded-br-[1rem] bg-[#123EBB]" />
            <span className="absolute inset-[2px] flex -rotate-[7deg] items-center justify-center rounded-[0.7rem] rounded-br-[1rem] border border-[#123EBB] bg-[#FFFCF5] font-serif text-[1.75rem] leading-none text-[#123EBB] shadow-[0_1px_0_0_#123EBB]" lang="zh-Hans">你</span>
          </span>

          <div>
            <p className="text-lg font-semibold leading-none">Chino A1</p>
            <p className="mt-1 text-xs text-[#657386]">Desde cero</p>
          </div>
        </Link>

        <nav aria-label="Navegación principal" className="min-w-0">
          <ul className="flex flex-wrap items-center gap-1 lg:flex-nowrap lg:justify-end">
            {links.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#1F5EFF] text-white"
                        : "text-[#43546A] hover:bg-[#1F5EFF]/10 hover:text-[#1F5EFF]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="relative ml-1 shrink-0"><AccountMenu /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
