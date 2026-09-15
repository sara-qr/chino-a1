"use client";

import { LESSON_PHASE_LABELS } from "@/lib/progress/lessonPhase";
import { REMOTE_PROGRESS_APPLIED } from "@/lib/progress/localProgress";
import { LessonShell } from "@/components/lesson/LessonShell";
import { LessonCompletion } from "@/components/lesson/LessonCompletion";
import { LessonTutor } from "@/components/lesson/LessonTutor";
import { LessonWriting } from "@/components/lesson/LessonWriting";
import { lesson1Writing } from "@/lib/characters/writing";
import { LessonAudio } from "@/components/lesson/LessonAudio";
import { useEffect, useMemo, useRef, useState } from "react";
import { buttonStyle, Choice, Matching, ToneCard } from "@/components/lesson/Activities";

import { clearLesson1Progress, initialLesson1State, lesson1Snapshot, loadLesson1Progress, saveLesson1Progress, type Lesson1State } from "@/lib/progress/lesson1Progress";

const stages = LESSON_PHASE_LABELS;
const titles = ["Antes de decir tu primera palabra", "Tu primera expresión", "Ahora vamos a decirlo", "Tus primeros trazos", "Comprueba lo que has aprendido", "Tutor oral"];
const durations = ["10 min", "15 min", "15 min", "8 min", "10 min", "Práctica oral"];
const meaningPairs: [string, string][] = [["你", "tú"], ["好", "bien / bueno"], ["你好", "hola"]];
const soundPairs: [string, string][] = [["你", "nǐ"], ["好", "hǎo"], ["你好", "Nǐ hǎo"]];
const tutorText = `TUTOR · SESIÓN 1

He terminado la Sesión 1 de mi curso de chino A1.

He aprendido:

- los cuatro tonos básicos
- 你 (nǐ)
- 好 (hǎo)
- 你好 (Nǐ hǎo)

Quiero practicar:

1. pronunciación de 你好
2. los cuatro tonos
3. especialmente el tercer tono
4. un pequeño ejercicio oral de saludo

No utilices vocabulario de lecciones posteriores.

Corrígeme paso a paso.`;

export default function LessonOnePage() {
  const [loaded, setLoaded] = useState<{ state: Lesson1State; error: string } | null>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        setLoaded({ state: loadLesson1Progress(), error: "" });
      } catch {
        setLoaded({ state: initialLesson1State(), error: "El navegador no permite acceder al progreso local. Puedes continuar, pero puede que no se guarde." });
      }
    });
    function refresh(event: Event) {
      const key = event instanceof StorageEvent ? event.key : (event as CustomEvent<{ key: string }>).detail?.key;
      if (key !== null && key !== "chino-a1:lesson-1-progress") return;
      try {
        setLoaded({ state: loadLesson1Progress(), error: "" });
        setGeneration((previous) => previous + 1);
      } catch { /* Keep the in-memory lesson usable if storage is unavailable. */ }
    }
    window.addEventListener(REMOTE_PROGRESS_APPLIED, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener(REMOTE_PROGRESS_APPLIED, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!loaded) return <main lang="es" className="min-h-screen bg-[#F6F1E8] p-8 text-[#10284F]"><p role="status">Cargando tu sesión…</p></main>;

  return <LessonOneSession key={generation} initial={loaded.state} initialError={loaded.error} onReset={() => {
    setLoaded({ state: initialLesson1State(), error: "" });
    setGeneration((previous) => previous + 1);
  }} />;
}

function LessonOneSession({ initial, initialError, onReset }: {
  initial: Lesson1State; initialError: string; onReset: () => void;
}) {
  const [writingCompleted, setWritingCompleted] = useState(initial.writingCompleted);
  const [phase, setPhase] = useState(initial.phase);
  const [answers, setAnswers] = useState(initial.answers);
  const [meanings, setMeanings] = useState(initial.meanings);
  const [sounds, setSounds] = useState(initial.sounds);
  const [showResult, setShowResult] = useState(initial.showResult);
  const [listeningCompleted, setListeningCompleted] = useState(initial.listeningCompleted);
  const [tutorCopied, setTutorCopied] = useState(initial.tutorCopied);
  const [tutorCompleted, setTutorCompleted] = useState(initial.tutorCompleted);
  const [sessionCompleted, setSessionCompleted] = useState(initial.sessionCompleted);
  const [copyStatus, setCopyStatus] = useState(initial.tutorCopied ? "Ya has copiado la ficha del tutor. Puedes volver a copiarla." : "");
  const [storageError, setStorageError] = useState(initialError);
  const tutorPhase = stages.length - 1;
  const finished = phase === stages.length;
  const snapshot = useMemo(() => lesson1Snapshot({
    phase, answers, meanings, sounds, showResult, writingCompleted, listeningCompleted, tutorCopied, tutorCompleted, sessionCompleted,
  }), [phase, answers, meanings, sounds, showResult, writingCompleted, listeningCompleted, tutorCopied, tutorCompleted, sessionCompleted]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        saveLesson1Progress({ phase, answers, meanings, sounds, showResult, writingCompleted, listeningCompleted, tutorCopied, tutorCompleted, sessionCompleted });
        setStorageError("");
      } catch {
        setStorageError("No se ha podido guardar el progreso en este navegador. Tu sesión sigue disponible mientras mantengas esta página abierta.");
      }
    });
    return () => { active = false; };
  }, [phase, answers, meanings, sounds, showResult, writingCompleted, listeningCompleted, tutorCopied, tutorCompleted, sessionCompleted]);

  function resetSession() {
    try {
      clearLesson1Progress();
      onReset();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      setStorageError("No se ha podido borrar el progreso. Revisa el almacenamiento del navegador e inténtalo de nuevo.");
    }
  }
  const heading = useRef<HTMLHeadingElement>(null);
  const update = (key: string, value: string) => {
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setShowResult(false);
  };
  const practiceDone = snapshot.exerciseCompleted.p1 && snapshot.exerciseCompleted.p2 && snapshot.exerciseCompleted.p3 && snapshot.exerciseCompleted.p4;
  const score = snapshot.score;
  const progress = snapshot.progress;
  function move(next: number) {
    setPhase(Math.max(0, Math.min(next, stages.length)));
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: "instant", block: "start" });
    });
  }
  async function copyTutor() {
    try {
      await navigator.clipboard.writeText(tutorText);
      setTutorCopied(true);
      setCopyStatus("Ficha copiada. Abre ChatGPT y pega esta ficha para empezar tu práctica oral.");
    } catch {
      setCopyStatus("No se ha podido copiar. Selecciona la ficha y cópiala manualmente.");
    }
  }

  return (
    <LessonShell number={1} chinese="你好" pinyin="Nǐ hǎo" spanish="Hola" topic="Saludos y primeros sonidos" duration={58}
      phases={stages.map((label, index) => ({ label, title: titles[index], duration: durations[index] }))}
      phase={phase} progress={progress} completed={sessionCompleted} headingRef={heading} onMove={move}
      onComplete={() => { setTutorCompleted(true); setSessionCompleted(true); setShowResult(true); move(stages.length); }} onReset={resetSession}
      beforeHeader={<>
        {storageError && <p role="alert" className="mt-4 rounded-2xl bg-[#FBE9E5] p-4 text-sm text-[#913329]">{storageError}</p>}
        {sessionCompleted && !finished && <div className="mt-4 rounded-2xl bg-[#E3E9F8] p-4 text-sm"><p>Sesión completada · Revisión de tus respuestas guardadas. Resultado: {score} / 4.</p><button onClick={() => move(stages.length)} className={`${buttonStyle} mt-2 border border-[#10284F]/25`}>Volver al cierre</button></div>}
      </>}
      completion={<LessonCompletion number={1} vocabulary="你好 · 你 · 好" pronunciation="Pronunciación: 4 tonos" score={score} maxScore={4} practiceDone={practiceDone} courseProgress={5} storageError={storageError} onReview={() => move(0)} />}
    >
            {!finished && phase === 0 && <>
              <p className="max-w-xl text-lg leading-relaxed">Estamos aprendiendo chino mandarín. Antes de empezar, conoce sus tres piezas principales.</p>
              <div className="grid gap-4 md:grid-cols-3">
                {[["字符", "Caracteres", "Los caracteres chinos representan la escritura."], ["Pinyin", "Pronunciación escrita con alfabeto latino", "Utilizaremos pinyin para aprender a pronunciarlos."], ["声调", "Tonos", "Cambiar el tono puede cambiar el significado de una palabra."]].map(([symbol, title, text]) => <div key={symbol} className="rounded-[2rem] border border-[#10284F]/15 bg-white p-6"><p className="font-serif text-4xl text-[#1748D5]">{symbol}</p><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#43546A]">{text}</p></div>)}
              </div>
              <h3 className="text-2xl font-medium">Cuatro tonos, cuatro movimientos</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((tone) => <ToneCard key={tone} tone={tone} />)}</div>
              <Choice question="¿Cuántos tonos principales tiene el mandarín?" options={["2", "3", "4", "5"]} correct="4" value={answers.intro} onChange={(value) => update("intro", value)} />
            </>}
            {!finished && phase === 1 && <>
              <div className="relative overflow-hidden rounded-[2.5rem] rounded-br-[5rem] bg-[#1748D5] p-8 text-center text-[#F6F1E8] sm:p-12">
                <span aria-hidden="true" className="absolute right-6 top-4 text-5xl">✳</span>
                <p lang="zh-Hans" className="font-serif text-8xl tracking-[0.15em] sm:text-[10rem]">你好</p>
                <p className="mt-4 text-2xl">Nǐ hǎo</p><p className="mt-2 font-serif text-4xl italic">Hola</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">{[["你", "nǐ", "tú"], ["好", "hǎo", "bien / bueno"]].map(([word, pinyin, meaning]) => <div key={word} className="flex items-center gap-6 rounded-3xl border border-[#10284F]/20 bg-white p-7"><span lang="zh-Hans" className="font-serif text-7xl text-[#1748D5]">{word}</span><div><p className="text-xl">{pinyin}</p><p className="mt-2 text-[#43546A]">{meaning}</p></div></div>)}</div>
              <p className="text-lg">你好 es el saludo básico que aprenderemos primero.</p>
              <Matching title="Relaciona cada expresión con su significado" pairs={meaningPairs} options={["hola", "tú", "bien / bueno"]} values={meanings} onChange={(key, value) => setMeanings((previous) => ({ ...previous, [key]: value }))} />
            </>}
            {!finished && phase === 2 && <>
              <div className="grid gap-5 md:grid-cols-3">{[["你", "nǐ"], ["好", "hǎo"], ["你好", "Nǐ hǎo"]].map(([word, pinyin], index) => <div key={word} className="rounded-[2rem] border border-[#10284F]/20 bg-white p-6"><p lang="zh-Hans" className="font-serif text-6xl text-[#1748D5]">{word}</p><p className="mb-5 mt-3 text-xl">{pinyin}</p>{index < 2 ? <><p className="mb-3 text-sm">Tercer tono</p><ToneCard tone={3} /></> : <p className="text-sm leading-relaxed text-[#43546A]">Al unir dos terceros tonos, el primero se pronuncia como un segundo tono: ní hǎo. Seguimos escribiendo Nǐ hǎo.</p>}</div>)}</div>
              <LessonAudio
                title="Escucha y repite el saludo"
                source="Textbook · Lesson 1 · 01-1.mp3"
                src="/audio/lesson-1/textbook-01-1.mp3"
                instruction="Escucha la pista completa: incluye la presentación de la lección, el diálogo 你好 / 你好 y el vocabulario 你, 好. Después, vuelve a reproducirla y repite el saludo en voz alta."
                transcript="Diálogo: 你好。你好。 (Nǐ hǎo. Nǐ hǎo. — Hola. Hola.) Vocabulario: 你 (nǐ, tú), 好 (hǎo, bien / bueno)."
              />
              <Choice question="Selecciona el tercer tono" options={["mā", "má", "mǎ", "mà"]} correct="mǎ" value={answers.tone} onChange={(value) => update("tone", value)} />
            </>}
            {!finished && phase === 3 && <LessonWriting characters={lesson1Writing} completed={writingCompleted} onCompletedChange={setWritingCompleted} />}
            {!finished && phase === 4 && <>
              <LessonAudio
                title="Listening · Identifica los tonos"
                source="Workbook · Lesson 1 · 01-5.mp3 · Ejercicio 6"
                src="/audio/lesson-1/workbook-01-5.mp3"
                instruction="El ejercicio 6 del Workbook pide escuchar, escribir los tonos y leer en voz alta. Prepara una lista del 1 al 20 en papel. Escucha cada palabra, anota el tono que reconoces (1, 2, 3 o 4) y repítela. Pausa cuando lo necesites y vuelve a escuchar para comparar tu pronunciación. No necesitas conocer el significado de las palabras. Esta práctica no puntúa en el resultado de abajo."
              />
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={listeningCompleted} onChange={(event) => setListeningCompleted(event.target.checked)} className="h-5 w-5 accent-[#1748D5]" />He terminado el listening</label>
              <Choice question="1. ¿Qué significa 你好?" options={["Adiós", "Hola", "Gracias", "Sí"]} correct="Hola" value={answers.p1} onChange={(value) => update("p1", value)} />
              <Choice question="2. ¿Qué significa 你?" options={["yo", "tú", "bien", "hola"]} correct="tú" value={answers.p2} onChange={(value) => update("p2", value)} />
              <Matching title="3. Relaciona cada expresión con su pinyin" pairs={soundPairs} options={["hǎo", "Nǐ hǎo", "nǐ"]} values={sounds} onChange={(key, value) => { setSounds((previous) => ({ ...previous, [key]: value })); setShowResult(false); }} />
              <Choice question="4. Selecciona la forma que representa el tercer tono" options={["mā", "má", "mǎ", "mà"]} correct="mǎ" value={answers.p4} onChange={(value) => update("p4", value)} />
              <p className="text-sm text-[#43546A]">Responde los cuatro ejercicios para ver tu resultado. Cada ejercicio vale un punto; las tres parejas cuentan juntas.</p>
              <button disabled={!practiceDone} onClick={() => setShowResult(true)} className={`${buttonStyle} bg-[#10284F] text-white disabled:cursor-not-allowed disabled:opacity-50`}>Ver resultado</button>
              {showResult && <div role="status" className="rounded-[2rem] bg-[#E3E9F8] p-7"><h3 className="text-xl">Resultado</h3><p className="mt-3 text-5xl text-[#1748D5]">{score} / 4</p><p className="mt-4">{score === 4 ? "Perfecto. Puedes continuar." : score >= 2 ? "Muy bien. Repasa los errores antes de continuar." : "Vamos a repetir esta parte."}</p></div>}
              <button onClick={() => { setAnswers((previous) => { const next = { ...previous }; delete next.p1; delete next.p2; delete next.p4; return next; }); setSounds({}); setShowResult(false); }} className={`${buttonStyle} ml-2 border border-[#10284F]/25`}>Repetir ejercicios</button>
            </>}
      {!finished && phase === tutorPhase && <LessonTutor
        objectives={["Pronunciar 你好", "Diferenciar los cuatro tonos", "Practicar especialmente el tercer tono", "Saludar de forma sencilla"]}
        text={tutorText} onCopy={copyTutor} copyStatus={copyStatus}
      />}
    </LessonShell>
  );
}
