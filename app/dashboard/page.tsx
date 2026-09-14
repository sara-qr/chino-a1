"use client";

import Link from "next/link";
import { TOTAL_SESSIONS, useCourseProgress } from "@/hooks/useCourseProgress";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F5EFF]";
const stages = [
  { label: "Repaso", time: "10 min", mark: "01" },
  { label: "Contenido nuevo", time: "15 min", mark: "02" },
  { label: "Pronunciación", time: "15 min", mark: "03" },
  { label: "Ejercicios", time: "10 min", mark: "04" },
];
const reviews = [
  { label: "Vocabulario", value: "0 palabras", symbol: "词" },
  { label: "Caracteres", value: "0", symbol: "字" },
  { label: "Pronunciación", value: "Sin sesiones pendientes", symbol: "声" },
];
const shortcuts = [
  { label: "Curso", href: "/course", symbol: "学", caption: "Tu camino, paso a paso" },
  { label: "Vocabulario", href: "/vocabulary", symbol: "词", caption: "Palabras para conectar" },
  { label: "Caracteres", href: "/characters", symbol: "字", caption: "Un trazo cada vez" },
  { label: "Progreso", href: "/progress", symbol: "步", caption: "Cada pequeño avance" },
];

export default function DashboardPage() {
  const { lesson1Completed, completedSessions, courseProgressPercent, nextSession } = useCourseProgress();
  const nextHref = lesson1Completed ? `/course/lesson-${nextSession}` : "/course";
  return (
    <main lang="es" className="min-h-screen bg-[#F6F1E8] text-[#12263F]">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 lg:pt-12">
        <section aria-labelledby="welcome-heading" className="relative grid items-center gap-8 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-14">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#1F5EFF]" />
              Tu curso de chino A1
            </p>
            <h1 id="welcome-heading" className="mt-6 text-[2.75rem] font-medium leading-[1.1] tracking-[-0.055em] sm:text-6xl lg:text-[4.75rem]">
              <span lang="zh-Hans" className="font-serif text-[#1F5EFF]">你好</span>, Sara<span className="text-[#1F5EFF]">.</span>
            </h1>
            <p className="mt-5 text-xl text-[#43546A] sm:text-2xl">Sigue avanzando paso a paso</p>
            <div className="mt-8 max-w-md">
              <div className="mb-3 flex items-end justify-between gap-4 text-sm">
                <span>Tu recorrido por el A1</span>
                <span className="text-xl font-semibold tabular-nums">{courseProgressPercent}%</span>
              </div>
              <div role="progressbar" aria-label="Progreso global del A1" aria-valuenow={courseProgressPercent} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-[#12263F]/10"><div className="h-full rounded-full bg-[#1F5EFF]" style={{ width: `${courseProgressPercent}%` }} /></div>
              <p className="mt-3 text-xs text-[#43546A]">Todo empieza con un primer <span lang="zh-Hans">你好</span>.</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={nextHref} className={`inline-flex min-h-12 items-center justify-center gap-6 rounded-full bg-[#1F5EFF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#174ACB] ${focus}`}>
                {lesson1Completed ? `Continuar con Sesión ${nextSession}` : "Continuar clase"} <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/course" className={`inline-flex min-h-12 items-center justify-center rounded-full border border-[#12263F]/25 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white ${focus}`}>Ver curso</Link>
            </div>
          </div>
          <div aria-hidden="true" className="relative isolate mx-auto flex h-80 w-full max-w-lg items-center justify-center sm:h-96 lg:h-[27rem]">
            <div className="absolute h-56 w-[90%] -rotate-[24deg] rounded-[50%] border border-[#1F5EFF]/35 sm:h-72 lg:h-80" />
            <div className="absolute -z-10 h-60 w-60 rounded-full bg-[#EAE3D5] sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]" />
            <span className="absolute left-[3%] top-[14%] h-9 w-7 -rotate-12 rounded-tl-full border-l-2 border-t-2 border-[#1F5EFF]" />
            <span className="absolute bottom-[18%] right-[1%] h-12 w-9 rotate-[25deg] rounded-br-full border-b-2 border-r-2 border-[#1F5EFF]" />
            <span className="absolute left-[16%] top-[4%] h-8 w-16 -rotate-[25deg] rounded-[50%] border border-[#1F5EFF]/50" />
            <div className="absolute left-[8%] top-[13%] flex h-48 w-36 -rotate-[14deg] flex-col items-center justify-center rounded-[1.5rem] border border-[#12263F]/15 bg-white shadow-[5px_7px_0_0_#DED7C9] before:absolute before:inset-3 before:rounded-xl before:border before:border-dashed before:border-[#1F5EFF]/20 sm:h-64 sm:w-48">
              <span className="font-serif text-8xl text-[#1F5EFF] sm:text-[7rem]">你</span>
              <span className="mt-3 text-sm tracking-widest">nǐ</span>
            </div>
            <div className="absolute right-[9%] top-[26%] flex h-48 w-36 rotate-[12deg] flex-col items-center justify-center rounded-[1.5rem] border border-[#174ACB] bg-[#1F5EFF] text-white shadow-[5px_7px_0_0_#12263F] before:absolute before:inset-3 before:rounded-xl before:border before:border-white/25 sm:h-64 sm:w-48">
              <span className="font-serif text-8xl sm:text-[7rem]">好</span>
              <span className="mt-3 text-sm tracking-widest">hǎo</span>
            </div>
            <span className="absolute right-[9%] top-[6%] rotate-12 text-6xl text-[#1F5EFF]">✳</span>
            <span className="absolute bottom-0 left-[2%] -rotate-3 border-b border-[#1F5EFF]/40 px-2 py-2 font-serif text-base italic sm:bottom-1 sm:left-[8%] sm:text-lg">Un pequeño paso, un nuevo mundo.</span>
          </div>
        </section>

        <div className="grid items-stretch gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-x-7 lg:gap-y-8">
          <section aria-labelledby="next-class-heading" className="relative isolate overflow-hidden rounded-[2rem] rounded-tr-[4rem] border border-[#12263F]/10 bg-white p-6 before:pointer-events-none before:absolute before:inset-y-0 before:left-4 before:-z-10 before:border-l before:border-[#1F5EFF]/15 sm:p-10 sm:before:left-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="next-class-heading" className="text-xs font-bold tracking-[0.16em] uppercase">Próxima clase</h2>
              <span className="-rotate-3 rounded-lg border border-[#12263F]/15 bg-[#F6F1E8] px-4 py-2 text-xs font-medium">{lesson1Completed ? "Siguiente sesión" : "Aprox. 50 min"}</span>
            </div>
            <p className="mt-8 inline-block rounded-full border border-[#1F5EFF]/30 px-3 py-1 text-xs font-semibold tracking-wider text-[#1F5EFF]">Siguiente: Sesión {nextSession}</p>
            <h3 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">{lesson1Completed ? `Sesión ${nextSession}` : <><span lang="zh-Hans" className="font-serif">你好</span> <span className="text-[#1F5EFF]">·</span> Nǐ hǎo</>}</h3>
            <p className="mt-3 text-lg text-[#43546A]">{lesson1Completed ? "Tu siguiente paso en el curso" : "Saludos y primeros sonidos"}</p>
            {!lesson1Completed && <ol className="mt-8 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-dashed border-[#12263F]/25 pt-6 sm:grid-cols-4">
              {stages.map((stage) => (
                <li key={stage.mark}>
                  <span aria-hidden="true" className="font-mono text-xs font-semibold text-[#1F5EFF]">{stage.mark} /</span>
                  <p className="mt-2 text-sm font-semibold">{stage.label}</p>
                  <p className="mt-1 text-sm text-[#43546A]">{stage.time}</p>
                </li>
              ))}
            </ol>}
            <Link href={nextHref} className={`mt-8 inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-full bg-[#12263F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1F5EFF] sm:w-auto sm:gap-12 ${focus}`}>
              {lesson1Completed ? `Continuar con Sesión ${nextSession}` : "Empezar clase"} <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <section aria-labelledby="oral-tutor-heading" className="relative isolate flex flex-col overflow-hidden rounded-[2.5rem] rounded-br-[5rem] bg-[#1F5EFF] p-6 text-white sm:p-9 lg:mt-5 lg:-mb-2">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/40 px-3 py-1.5 text-xs">Escucha · Repite · Conversa</span>
              <span aria-hidden="true" className="text-3xl">✳</span>
            </div>
            <div aria-hidden="true" className="relative my-8 flex h-24 w-56 max-w-full items-center justify-center gap-2 self-center rounded-[50%] border border-white/60 before:absolute before:-right-3 before:-top-3 before:h-8 before:w-12 before:rounded-[50%] before:border before:border-white/40 after:absolute after:-bottom-2 after:left-9 after:h-5 after:w-5 after:-skew-x-12 after:rotate-12 after:border-b after:border-l after:border-white/60 after:bg-[#1F5EFF]">
              {[18, 32, 48, 30, 64, 42, 56, 28, 16].map((height, index) => (
                <span key={index} className="w-2.5 rounded-full bg-white" style={{ height, opacity: index % 3 === 0 ? 0.5 : 1 }} />
              ))}
            </div>
            <h2 id="oral-tutor-heading" className="font-serif text-4xl tracking-tight sm:text-5xl">Tutor oral</h2>
            <p id="tutor-description" className="mt-3 max-w-sm text-base leading-relaxed">Cuando la clase lo indique, practica conmigo pronunciación, tonos y conversación.</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
              <p id="tutor-status" className="flex items-center gap-2 text-sm"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white" />Aún no toca</p>
              <button type="button" disabled aria-describedby="tutor-status tutor-description" className="min-h-12 cursor-not-allowed rounded-full border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white">Ir al tutor</button>
            </div>
          </section>

          <section aria-labelledby="review-heading" className="py-5 sm:py-7">
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <h2 id="review-heading" className="text-[1.7rem] font-medium tracking-[-0.04em]">Repaso pendiente</h2>
              <span className="text-xs text-[#43546A]">A tu ritmo</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_0.85fr_1.2fr] sm:items-start">
              {reviews.map((review) => (
                <div key={review.label} className="relative overflow-hidden rounded-3xl border border-[#12263F]/15 bg-[#EDE4D5] p-5 first:rounded-tl-[2.75rem] even:bg-white even:sm:mt-4 last:rounded-br-[2.75rem] last:bg-[#E6EAF7]">
                  <span aria-hidden="true" className="font-serif text-5xl text-[#1F5EFF]">{review.symbol}</span>
                  <h3 className="mt-5 text-sm font-semibold">{review.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#43546A]">{review.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="progress-heading" className="relative overflow-hidden rounded-[2rem] rounded-tl-[3.5rem] bg-[#12263F] p-6 text-[#F6F1E8] sm:p-8">
            <h2 id="progress-heading" className="text-[1.7rem] font-medium tracking-[-0.04em]">Tu progreso</h2>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold">Nivel A1</span>
              <span className="font-serif text-5xl tracking-tight text-[#F6F1E8]">{courseProgressPercent}%</span>
            </div>
            <dl className="mt-5 space-y-4 border-t border-[#F6F1E8]/25 pt-5 text-sm">
              {[["Lecciones completadas", `${completedSessions} / ${TOTAL_SESSIONS}`], ["Vocabulario aprendido", "0"], ["Caracteres aprendidos", "0"]].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-[#F6F1E8]/80">{label}</dt>
                  <dd className="shrink-0 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section aria-labelledby="shortcuts-heading" className="mt-10 border-t border-[#12263F]/15 pt-8 sm:mt-12 sm:pt-10">
          <h2 id="shortcuts-heading" className="text-[1.7rem] font-medium tracking-[-0.04em]">Accesos rápidos</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_1.15fr]">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.href} href={shortcut.href} className={`group rounded-3xl border border-[#12263F]/15 bg-transparent p-6 transition-colors first:rounded-tl-[3rem] first:bg-white last:rounded-br-[3rem] last:bg-[#EDE4D5] hover:bg-[#E6EAF7] ${focus}`}>
                <div aria-hidden="true" className="flex items-center justify-between text-[#1F5EFF]">
                  <span className="font-serif text-5xl">{shortcut.symbol}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#12263F]/15 text-xl transition-colors group-hover:bg-[#1F5EFF] group-hover:text-white">↗</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{shortcut.label}</h3>
                <p className="mt-1 text-xs text-[#43546A]">{shortcut.caption}</p>
              </Link>
            ))}
          </div>
        </section>
        <p className="mt-10 text-center text-xs tracking-wide text-[#43546A]"><span lang="zh-Hans">慢慢来</span> · Sin prisa. Cada paso cuenta.</p>
      </div>
    </main>
  );
}
