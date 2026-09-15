"use client";

import { REMOTE_PROGRESS_APPLIED } from "@/lib/progress/localProgress";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonStyle, Choice, Matching, ToneCard } from "@/components/lesson/Activities";
import { LessonShell, type LessonPhase } from "@/components/lesson/LessonShell";
import { LessonCompletion } from "@/components/lesson/LessonCompletion";
import { LessonTutor } from "@/components/lesson/LessonTutor";
import { LessonAudio } from "@/components/lesson/LessonAudio";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { lesson2MeaningPairs, lesson2Quiz, lesson2Review, lesson2SoundPairs, lesson2TutorText, lesson2Vocabulary } from "@/lib/lessons/lesson2";
import { clearLesson2Progress, initialLesson2State, lesson2Snapshot, loadLesson2Progress, saveLesson2Progress, type Lesson2State } from "@/lib/progress/lesson2Progress";

const phases: LessonPhase[] = [
  { label: "Repaso", title: "Antes de dar las gracias", duration: "8 min" },
  { label: "Aprende", title: "Un gracias y su respuesta", duration: "12 min" },
  { label: "Pronuncia", title: "Escucha, pausa y repite", duration: "12 min" },
  { label: "Practica", title: "Ponlo en práctica", duration: "12 min" },
  { label: "Tutor", title: "Tutor oral", duration: "6 min" },
];

export default function LessonTwoPage() {
  const [loaded, setLoaded] = useState<{ state: Lesson2State; error: string } | null>(null);
  const [generation, setGeneration] = useState(0);
  const { lesson1Completed } = useCourseProgress();
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try { setLoaded({ state: loadLesson2Progress(), error: "" }); }
      catch { setLoaded({ state: initialLesson2State(), error: "No se ha podido acceder al progreso local." }); }
    });
    function refresh(event: Event) {
      const key = event instanceof StorageEvent ? event.key : (event as CustomEvent<{ key: string }>).detail?.key;
      if (key !== null && key !== "chino-a1:lesson-2-progress") return;
      try {
        setLoaded({ state: loadLesson2Progress(), error: "" });
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
  if (!lesson1Completed) return <main lang="es" className="min-h-screen bg-[#F6F1E8] px-6 py-12 text-[#10284F]"><div className="mx-auto max-w-xl rounded-3xl border border-[#10284F]/15 bg-[#FFFCF5] p-8"><h1 className="text-3xl font-semibold">Primero, tu primer saludo</h1><p className="mt-4">Completa la Sesión 1 para continuar con la Sesión 2.</p><Link href="/course/lesson-1" className={`${buttonStyle} mt-6 inline-block bg-[#1748D5] text-white`}>Ir a la Sesión 1</Link></div></main>;
  return <LessonTwoSession key={generation} initial={loaded.state} initialError={loaded.error} onReset={() => {
    setLoaded({ state: initialLesson2State(), error: "" }); setGeneration((previous) => previous + 1);
  }} />;
}

function LessonTwoSession({ initial, initialError, onReset }: { initial: Lesson2State; initialError: string; onReset: () => void }) {
  const [state, setState] = useState(initial);
  const [storageError, setStorageError] = useState(initialError);
  const [copyStatus, setCopyStatus] = useState(initial.tutorCopied ? "Ya has copiado la ficha del tutor. Puedes volver a copiarla." : "");
  const heading = useRef<HTMLHeadingElement>(null);
  const { completedSessions, courseProgressPercent } = useCourseProgress();
  const snapshot = lesson2Snapshot(state);
  const { phase, answers, meanings, sounds, showResult, sessionCompleted, listeningCompleted } = state;
  const finished = phase === phases.length;

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try { saveLesson2Progress(state); setStorageError(""); }
      catch { setStorageError("No se ha podido guardar el progreso. Puedes continuar, pero podría perderse al cerrar esta página."); }
    });
    return () => { active = false; };
  }, [state]);

  function move(next: number) {
    setState((previous) => ({ ...previous, phase: Math.max(0, Math.min(next, phases.length)) }));
    requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ behavior: "instant", block: "start" }); });
  }
  function answer(id: string, value: string) {
    setState((previous) => ({ ...previous, answers: { ...previous.answers, [id]: value }, showResult: false }));
  }
  function reset() {
    try { clearLesson2Progress(); onReset(); window.scrollTo({ top: 0, behavior: "instant" }); }
    catch { setStorageError("No se ha podido borrar el progreso de la Sesión 2. Inténtalo de nuevo."); }
  }
  async function copyTutor() {
    try {
      await navigator.clipboard.writeText(lesson2TutorText);
      setState((previous) => ({ ...previous, tutorCopied: true }));
      setCopyStatus("Ficha copiada. Abre ChatGPT y pega esta ficha para empezar tu práctica oral.");
    } catch { setCopyStatus("No se ha podido copiar. Selecciona la ficha y cópiala manualmente."); }
  }

  return <LessonShell number={2} chinese="谢谢你" pinyin="Xièxie nǐ" spanish="Gracias a ti" topic="Agradecimientos y respuestas básicas" duration={50}
    phases={phases} phase={phase} progress={snapshot.progress} completed={sessionCompleted} headingRef={heading} onMove={move} onReset={reset}
    onComplete={() => { setState((previous) => ({ ...previous, tutorCompleted: true, sessionCompleted: true, showResult: true })); move(phases.length); }}
    beforeHeader={<>
      {storageError && <p role="alert" className="mt-4 rounded-2xl bg-[#FBE9E5] p-4 text-sm text-[#913329]">{storageError}</p>}
      {sessionCompleted && !finished && <div className="mt-4 rounded-2xl bg-[#E3E9F8] p-4 text-sm"><p>Sesión completada · Revisión de tus respuestas guardadas. Resultado: {snapshot.score} / 5.</p><button onClick={() => move(phases.length)} className={`${buttonStyle} mt-2 border border-[#10284F]/25`}>Volver al cierre</button></div>}
    </>}
    completion={<>
      <LessonCompletion number={2} vocabulary="谢谢 · 不客气 · 不谢" pronunciation="Dar las gracias, responder y pronunciar con atención al tono y a las sílabas suaves." score={snapshot.score} maxScore={5} practiceDone={snapshot.quizCompleted} courseProgress={courseProgressPercent} storageError={storageError} onReview={() => move(0)} />
      <p className="text-sm text-[#43546A]">{completedSessions} / 20 sesiones completadas · {completedSessions === 2 ? "Sesión 3 disponible en el curso." : "Consulta tu progreso en el curso."}</p>
    </>}
  >
    {phase === 0 && <>
      <p className="max-w-xl text-lg leading-relaxed">Antes de empezar, recupera tu primer saludo: <span lang="zh-Hans">你好</span> · nǐ hǎo · hola. Ya conoces <span lang="zh-Hans">你</span> (nǐ, tú) y <span lang="zh-Hans">好</span> (hǎo, bien / bueno).</p>
      {lesson2Review.map((item) => <Choice key={item.id} {...item} value={answers[item.id]} onChange={(value) => answer(item.id, value)} />)}
      <details className="rounded-3xl border border-[#10284F]/15 bg-[#FFFCF5] p-5"><summary className="cursor-pointer font-semibold">Recordar los cuatro tonos</summary><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((tone) => <ToneCard key={tone} tone={tone} />)}</div></details>
    </>}
    {phase === 1 && <>
      <p className="max-w-xl text-lg leading-relaxed">Hoy aprenderás a dar las gracias y a responder. Estas expresiones aparecen en los dos primeros diálogos de la Lesson 2.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{lesson2Vocabulary.map((word) => <div key={word.chinese} className="rounded-[2rem] border border-[#10284F]/15 bg-[#FFFCF5] p-6"><p lang="zh-Hans" className="font-serif text-5xl text-[#1748D5]">{word.chinese}</p><p className="mt-4 text-xl">{word.pinyin}</p><p className="mt-2 font-semibold">{word.meaning}</p><p className="mt-3 text-sm leading-relaxed text-[#43546A]">{word.note}</p></div>)}</div>
      <div className="rounded-[2rem] bg-[#1748D5] p-7 text-[#F6F1E8]"><p className="text-sm">Un intercambio sencillo</p><p lang="zh-Hans" className="mt-4 font-serif text-4xl sm:text-5xl">A: 谢谢你！<br />B: 不客气！</p><p className="mt-5">A: Xièxie nǐ! · Gracias a ti.</p><p className="mt-2">B: Bú kèqi! · De nada.</p></div>
      <p className="max-w-xl leading-relaxed"><span lang="zh-Hans">谢谢你</span> (xièxie nǐ) añade el <span lang="zh-Hans">你</span> que ya conoces: «gracias a ti». Puedes responder con <span lang="zh-Hans">不客气</span> (bú kèqi) o <span lang="zh-Hans">不谢</span> (bú xiè). Aprende estas respuestas como expresiones completas.</p>
      <Matching title="Relaciona expresión y significado" pairs={lesson2MeaningPairs} options={lesson2MeaningPairs.map(([, meaning]) => meaning)} values={meanings} onChange={(key, value) => setState((previous) => ({ ...previous, meanings: { ...previous.meanings, [key]: value } }))} />
    </>}
    {phase === 2 && <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#10284F]/15 bg-[#FFFCF5] p-6"><p lang="zh-Hans" className="font-serif text-5xl text-[#1748D5]">谢谢</p><p className="mt-3 text-2xl">xièxie · gracias</p><p className="mt-4 leading-relaxed">La primera sílaba, xiè, tiene cuarto tono: la voz baja. La segunda, xie, es breve y suave; por eso no lleva marca tonal.</p></div>
        <div className="rounded-3xl border border-[#10284F]/15 bg-[#FFFCF5] p-6"><p lang="zh-Hans" className="font-serif text-5xl text-[#1748D5]">不客气</p><p className="mt-3 text-2xl">bú kèqi · de nada</p><p className="mt-4 leading-relaxed">Imita la expresión completa del audio: bú sube, kè baja y qi se dice suave. No acentúes las tres sílabas por igual.</p></div>
      </div>
      <LessonAudio title="Diálogo 1 · Gracias y una respuesta breve" source="Textbook · Lesson 2 · 02-1.mp3 · Text 1 + vocabulario" src="/audio/lesson-2/textbook-02-1.mp3" instruction="Escucha la pista completa. Incluye la presentación de la lección, 谢谢 / 不谢 y el vocabulario 谢谢, 不. Pausa después de cada intervención y repite. Vuelve a escuchar para comparar el ritmo." transcript="A: 谢谢。Xièxie. — Gracias. B: 不谢。Bú xiè. — De nada. Al final se presentan 谢谢 (xièxie, gracias) y 不 (bù, no). En 不谢 lo practicamos dentro de la respuesta completa." />
      <LessonAudio title="Diálogo 2 · Gracias a ti / De nada" source="Textbook · Lesson 2 · 02-2.mp3 · Text 2 + vocabulario" src="/audio/lesson-2/textbook-02-2.mp3" instruction="Escucha 谢谢你 / 不客气 y la presentación de 不客气. Repite primero la respuesta y después el diálogo completo. Practica tres veces usando los controles para volver al principio." transcript="A: 谢谢你！Xièxie nǐ! — Gracias a ti. B: 不客气！Bú kèqi! — De nada. Vocabulario al final: 不客气 (bú kèqi, de nada / no hay de qué)." />
      <Choice question="¿Qué tono lleva la primera sílaba xiè de xièxie?" options={["primero", "segundo", "tercero", "cuarto"]} correct="cuarto" value={answers.tone} onChange={(value) => answer("tone", value)} />
    </>}
    {phase === 3 && <>
      {lesson2Quiz.map((item) => <Choice key={item.id} {...item} value={answers[item.id]} onChange={(value) => answer(item.id, value)} />)}
      <Matching title="5. Relaciona cada expresión con su pinyin" pairs={lesson2SoundPairs} options={lesson2SoundPairs.map(([, sound]) => sound)} values={sounds} onChange={(key, value) => setState((previous) => ({ ...previous, sounds: { ...previous.sounds, [key]: value }, showResult: false }))} />
      <p className="text-sm text-[#43546A]">Cada pregunta vale un punto. Las tres parejas de pinyin cuentan juntas como un punto: máximo 5. Responde los cinco ejercicios para ver tu resultado.</p>
      <div className="flex flex-wrap gap-3"><button disabled={!snapshot.quizCompleted} onClick={() => setState((previous) => ({ ...previous, showResult: true }))} className={`${buttonStyle} bg-[#10284F] text-white disabled:cursor-not-allowed disabled:opacity-50`}>Ver resultado</button><button onClick={() => setState((previous) => ({ ...previous, answers: Object.fromEntries(Object.entries(previous.answers).filter(([key]) => !lesson2Quiz.some(({ id }) => id === key))), sounds: {}, showResult: false }))} className={`${buttonStyle} border border-[#10284F]/25`}>Repetir ejercicios</button></div>
      {showResult && <div role="status" className="rounded-3xl bg-[#E3E9F8] p-6"><h3 className="text-xl font-semibold">Resultado</h3><p className="mt-3 text-5xl text-[#1748D5]">{snapshot.score} / 5</p><p className="mt-4">{snapshot.score === 5 ? "Muy bien. Ya puedes agradecer y responder." : "Repasa las respuestas y vuelve a intentarlo."}</p></div>}
      <LessonAudio title="Listening · Escucha los tonos y repite" source="Workbook · Lesson 2 · 02-5.mp3 · Ejercicio 6" src="/audio/lesson-2/workbook-02-5.mp3" instruction="El ejercicio pide escuchar, escribir los tonos y leer en voz alta. Numera del 1 al 20 en papel. Escucha cada sílaba, anota el tono que reconoces y repítela. Pausa cuando lo necesites. Practicamos sonidos: no necesitas aprender el significado de estas palabras. Este listening no tiene corrección automática ni suma puntos al quiz." />
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#1748D5]" checked={listeningCompleted} onChange={(event) => setState((previous) => ({ ...previous, listeningCompleted: event.target.checked }))} />He terminado el listening</label>
    </>}
    {phase === 4 && <LessonTutor objectives={["Saludar con 你好", "Dar las gracias con 谢谢 y 谢谢你", "Responder con 不客气 o 不谢", "Imitar los tonos y las sílabas suaves del audio"]} text={lesson2TutorText} onCopy={copyTutor} copyStatus={copyStatus} conversation={<div className="mt-6 border-t border-white/25 pt-5"><p lang="zh-Hans" className="font-serif text-3xl">A: 谢谢你！<br />B: 不客气！</p><p className="mt-3 text-sm">Xièxie nǐ! · Gracias a ti.<br />Bú kèqi! · De nada.</p></div>} />}
  </LessonShell>;
}
