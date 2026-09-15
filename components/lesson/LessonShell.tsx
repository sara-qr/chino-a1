"use client";

import Link from "next/link";
import { useState, type ReactNode, type RefObject } from "react";
import { buttonStyle } from "./Activities";

export type LessonPhase = { label: string; title: string; duration: string };

type LessonShellProps = {
  number: number;
  total?: number;
  chinese: string;
  pinyin: string;
  spanish: string;
  topic: string;
  duration: number;
  phases: LessonPhase[];
  phase: number;
  progress: number;
  completed: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onMove: (phase: number) => void;
  onComplete: () => void;
  onReset: () => void;
  beforeHeader?: ReactNode;
  children: ReactNode;
  completion: ReactNode;
};

// Presentation and navigation only: answers, scoring and persistence stay in each session.
export function LessonShell({ number, total = 20, chinese, pinyin, spanish, topic, duration, phases, phase, progress, completed, headingRef, onMove, onComplete, onReset, beforeHeader, children, completion }: LessonShellProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const finished = phase === phases.length;
  return (
    <main lang="es" className="min-h-screen bg-[#F6F1E8] text-[#10284F]">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/course" className={`inline-flex border border-[#10284F]/20 ${buttonStyle}`}>← Volver al curso</Link>
        {beforeHeader}
        <header className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.2em]">SESIÓN {String(number).padStart(2, "0")} / {total}</p>
              <h1 className={`mt-4 break-words font-serif text-[#1748D5] ${chinese.length > 6 ? "text-5xl sm:text-6xl" : "text-7xl sm:text-8xl"}`} lang="zh-Hans">{chinese}</h1>
              <p className="mt-3 text-xl">{pinyin} <span className="text-[#43546A]">· {spanish}</span></p>
              <p className="mt-3 text-lg text-[#43546A]">{topic}</p>
            </div>
            <p className="rounded-full border border-[#10284F]/25 px-5 py-3 text-sm">Duración aproximada · {duration} min</p>
          </div>
          <div className="mt-8 flex justify-between gap-4 text-xs"><span>Progreso de la sesión</span><span>{progress}%</span></div>
          <div role="progressbar" aria-label="Progreso de la sesión" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-3 h-2 overflow-hidden rounded-full bg-[#10284F]/10">
            <div className="h-full rounded-full bg-[#1748D5]" style={{ width: `${progress}%` }} />
          </div>
          <ol aria-label="Etapas de la sesión" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {phases.map((stage, index) => <li key={stage.label} aria-current={!finished && phase === index ? "step" : undefined} className={`rounded-2xl border px-3 py-3 text-sm ${!finished && phase === index ? "border-[#1748D5] bg-[#1748D5] text-white" : "border-[#10284F]/15"}`}><span className="mr-2 font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>{stage.label}</li>)}
          </ol>
        </header>
        <section className="mt-10" aria-labelledby="phase-heading">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase">{finished ? "El primer paso ya está dado" : `Etapa 0${phase + 1} · ${phases[phase].duration}`}</p>
          <h2 ref={headingRef} tabIndex={-1} id="phase-heading" className="mt-3 scroll-mt-64 text-3xl sm:scroll-mt-40 font-semibold tracking-tight outline-none sm:text-4xl">{finished ? `Sesión ${number} completada` : phases[phase].title}</h2>
          <fieldset disabled={completed && phase < phases.length - 1} className="mt-7 min-w-0 space-y-7">{finished ? completion : children}</fieldset>
        </section>
        {!finished && <nav aria-label="Navegación de la sesión" className="mt-10 flex flex-wrap justify-between gap-4 border-t border-[#10284F]/20 pt-6">
          {phase > 0 ? <button onClick={() => onMove(phase - 1)} className={`${buttonStyle} border border-[#10284F]/25`}>Anterior</button> : <span />}
          {phase < phases.length - 1 && <button onClick={() => onMove(phase + 1)} className={`${buttonStyle} bg-[#1748D5] text-white`}>Continuar</button>}
          {phase === phases.length - 1 && <button onClick={completed ? () => onMove(phases.length) : onComplete} className={`${buttonStyle} bg-[#1748D5] text-white`}>{completed ? "Volver al cierre" : "Completar sesión"}</button>}
        </nav>}
        <div className="mt-8 border-t border-[#10284F]/15 pt-5">
          <button onClick={() => setConfirmReset(true)} className={`${buttonStyle} border border-[#10284F]/25`}>Reiniciar sesión</button>
          {confirmReset && <section aria-labelledby="reset-heading" className="mt-4 rounded-2xl border border-[#10284F]/20 bg-white p-5">
            <h3 id="reset-heading" className="font-semibold">¿Reiniciar la Sesión {number}?</h3>
            <p className="mt-2 text-sm">Se borrarán las respuestas y el progreso guardado de esta sesión. Los demás datos de la app se conservarán.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={onReset} className={`${buttonStyle} bg-[#10284F] text-white`}>Sí, reiniciar sesión</button>
              <button onClick={() => setConfirmReset(false)} className={`${buttonStyle} border border-[#10284F]/25`}>Cancelar</button>
            </div>
          </section>}
        </div>
      </div>
    </main>
  );
}
