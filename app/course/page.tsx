"use client";

import Link from "next/link";
import { TOTAL_SESSIONS, useCourseProgress } from "@/hooks/useCourseProgress";

type Lesson = {
  number: number;
  chinese: string;
  pinyin: string;
  title: string;
  subtitle?: string;
  duration?: number;
  status: "available" | "locked" | "completed";
  oralTutor: boolean;
};

// Contenido provisional: no representa el índice oficial del libro.
const lessons: Lesson[] = [
  { number: 1, chinese: "你好", pinyin: "Nǐ hǎo", title: "Hola", subtitle: "Saludos y primeros sonidos", duration: 50, status: "available", oralTutor: true },
  { number: 2, chinese: "谢谢你", pinyin: "Xièxie nǐ", title: "Gracias", subtitle: "Agradecimientos y respuestas básicas", duration: 50, status: "locked", oralTutor: true },
  { number: 3, chinese: "", pinyin: "", title: "Sesión 3", status: "locked", oralTutor: false },
  { number: 4, chinese: "你叫什么名字", pinyin: "Nǐ jiào shénme míngzi", title: "¿Cómo te llamas?", duration: 50, status: "locked", oralTutor: true },
  { number: 5, chinese: "你是哪国人", pinyin: "Nǐ shì nǎ guó rén", title: "¿De qué país eres?", duration: 50, status: "locked", oralTutor: true },
  { number: 6, chinese: "我的家", pinyin: "Wǒ de jiā", title: "Mi familia", duration: 55, status: "locked", oralTutor: false },
  { number: 7, chinese: "今天几月几号", pinyin: "Jīntiān jǐ yuè jǐ hào", title: "¿Qué fecha es hoy?", duration: 50, status: "locked", oralTutor: false },
  { number: 8, chinese: "我想喝茶", pinyin: "Wǒ xiǎng hē chá", title: "Quiero tomar té", duration: 50, status: "locked", oralTutor: true },
  { number: 9, chinese: "你在哪儿工作", pinyin: "Nǐ zài nǎr gōngzuò", title: "¿Dónde trabajas?", duration: 55, status: "locked", oralTutor: true },
  { number: 10, chinese: "我学习汉语", pinyin: "Wǒ xuéxí Hànyǔ", title: "Estudio chino", duration: 50, status: "locked", oralTutor: false },
  { number: 11, chinese: "现在几点", pinyin: "Xiànzài jǐ diǎn", title: "¿Qué hora es?", duration: 50, status: "locked", oralTutor: true },
  { number: 12, chinese: "你住在哪儿", pinyin: "Nǐ zhù zài nǎr", title: "¿Dónde vives?", duration: 50, status: "locked", oralTutor: true },
  { number: 13, chinese: "今天天气怎么样", pinyin: "Jīntiān tiānqì zěnmeyàng", title: "¿Qué tiempo hace hoy?", duration: 50, status: "locked", oralTutor: false },
  { number: 14, chinese: "这个多少钱", pinyin: "Zhège duōshao qián", title: "¿Cuánto cuesta esto?", duration: 55, status: "locked", oralTutor: true },
  { number: 15, chinese: "很高兴认识你", pinyin: "Hěn gāoxìng rènshi nǐ", title: "Encantado de conocerte", duration: 50, status: "locked", oralTutor: true },
  ...Array.from({ length: 5 }, (_, index): Lesson => ({
    number: index + 16, chinese: "", pinyin: "", title: `Sesión ${index + 16}`,
    status: "locked", oralTutor: false,
  })),
];

const blocks = [
  {
    title: "Primer contacto", subtitle: "Saludos, sonidos y primeras estructuras",
    start: 1, end: 3, symbol: "你", number: "01",
    surface: "bg-[#E9E2D6] rounded-tr-[4rem]",
    heading: "bg-[#123EBB] text-white rounded-br-[4rem]",
    grid: "lg:grid-cols-[1.2fr_1fr_1fr]",
  },
  {
    title: "Información personal", subtitle: "Nombre, nacionalidad, edad y familia",
    start: 4, end: 6, symbol: "我", number: "02",
    surface: "border border-[#10284F]/15 bg-transparent",
    heading: "bg-[#ECE5D7] text-[#10284F] rounded-tl-[4rem]",
    grid: "lg:grid-cols-3",
  },
  {
    title: "Vida cotidiana", subtitle: "Fechas, comida, trabajo y rutinas",
    start: 7, end: 10, symbol: "日", number: "03",
    surface: "bg-[#ECE5D7] rounded-bl-[4rem]",
    heading: "bg-[#10284F] text-[#F6F1E8] rounded-tr-[4rem]",
    grid: "lg:grid-cols-2",
  },
  {
    title: "Comunicación básica", subtitle: "Hora, lugares, clima y situaciones sencillas",
    start: 11, end: 20, symbol: "说", number: "04",
    surface: "bg-[#EDE4D5] rounded-tr-[4rem]",
    heading: "border border-[#10284F]/20 bg-[#F6F1E8] text-[#10284F] rounded-br-[4rem]",
    grid: "lg:grid-cols-3",
  },
];

function LessonCard({ lesson }: { lesson: Lesson }) {
  const available = lesson.status === "available";
  const locked = lesson.status === "locked";
  const statusLabel = locked ? "Bloqueada" : available ? "Disponible" : "Completada";

  return (
    <article aria-labelledby={`lesson-${lesson.number}-title`} className={`relative flex min-w-0 flex-col rounded-[1.75rem] border bg-[#FFFCF5] p-6 ${available ? "border-[#123EBB] rounded-tr-[3.5rem] sm:p-7" : "border-[#10284F]/25"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase">Lección {String(lesson.number).padStart(2, "0")}</p>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${available ? "bg-[#123EBB] text-white" : "bg-[#F6F1E8] text-[#43546A]"}`}>
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${available ? "bg-white" : "border border-current"}`} />
          {statusLabel}
        </span>
      </div>
      <div className="mt-7">
        <p lang="zh-Hans" className={`break-words font-serif leading-[1.45] tracking-wide text-[#123EBB] ${available ? "text-6xl" : "text-4xl"}`}>{lesson.chinese}</p>
        <p className="mt-2 text-sm text-[#43546A]">{lesson.pinyin}</p>
        <h3 id={`lesson-${lesson.number}-title`} className="mt-5 text-xl font-semibold tracking-tight">{lesson.title}</h3>
        {lesson.subtitle && <p className="mt-2 text-sm leading-relaxed text-[#43546A]">{lesson.subtitle}</p>}
      </div>
      <div className="mt-auto pt-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[#10284F]/20 pt-4 text-xs text-[#43546A]">
          <span>{lesson.duration ? `Aprox. ${lesson.duration} min` : "Contenido por definir"}</span>
          <span className="inline-flex items-center gap-1.5">
            {lesson.oralTutor && (
              <span aria-hidden="true" className="flex h-4 items-center gap-0.5 text-[#123EBB]">
                <span className="h-1.5 w-0.5 rounded-full bg-current" />
                <span className="h-3.5 w-0.5 rounded-full bg-current" />
                <span className="h-2.5 w-0.5 rounded-full bg-current" />
              </span>
            )}
            Tutor oral · {lesson.oralTutor ? "Sí" : "No"}
          </span>
        </div>
        {locked ? (
          <button type="button" disabled aria-label={`Empezar lección ${lesson.number}: bloqueada`} className="mt-5 min-h-11 w-full cursor-not-allowed rounded-full border border-[#10284F]/15 bg-[#F6F1E8] px-5 py-2.5 text-sm font-semibold text-[#657080]">Empezar</button>
        ) : (
          <Link href={`/course/lesson-${lesson.number}`} aria-label={`${available ? "Empezar" : "Revisar"} lección ${lesson.number}: ${lesson.title}`} className="mt-5 flex min-h-11 items-center justify-between gap-3 rounded-full bg-[#123EBB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#10284F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#123EBB]">
            {available ? "Empezar" : "Revisar"} <span aria-hidden="true">↗</span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default function CoursePage() {
  const { lesson1Completed, lesson2Completed, completedSessions, nextSession } = useCourseProgress();
  const courseLessons = lessons.map((lesson): Lesson => ({
    ...lesson,
    status: lesson.number === 1 ? (lesson1Completed ? "completed" : "available")
      : lesson.number === 2 ? (lesson2Completed ? "completed" : lesson1Completed ? "available" : "locked")
      : lesson.number === 3 && lesson1Completed && lesson2Completed ? "available" : "locked",
  }));
  return (
    <main lang="es" className="min-h-screen bg-[#F6F1E8] text-[#10284F]">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:pt-14">
        <header className="grid items-center gap-8 pb-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold tracking-[0.18em] uppercase"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#123EBB]" />Tu curso de chino A1</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Un nuevo idioma.<br /><span className="text-[#123EBB]">Tu propio ritmo.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#43546A]">De tu primer saludo a tus primeras conversaciones. Un recorrido basado en HSK Standard Course 1.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full border border-[#10284F]/20 px-4 py-2">Nivel A1</span>
              <span className="rounded-full border border-[#10284F]/20 px-4 py-2">4 bloques · {TOTAL_SESSIONS} sesiones</span>
              <span className="rounded-full bg-[#ECE5D7] px-4 py-2 text-[#123EBB]">{completedSessions} / {TOTAL_SESSIONS} completadas</span>
            </div>
          </div>
          <div aria-hidden="true" className="relative isolate mx-auto flex h-80 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-[3rem] rounded-br-[6rem] bg-[#123EBB] text-[#F6F1E8] sm:h-96">
            <span className="absolute left-7 top-7 -rotate-12 text-4xl text-[#F6F1E8]/80">✳</span>
            <span className="absolute right-8 top-7 flex h-11 w-20 rotate-[8deg] items-center justify-center gap-1.5 rounded-[50%] border border-[#F6F1E8]/65 after:absolute after:-bottom-1.5 after:left-4 after:h-3 after:w-3 after:-skew-x-12 after:border-b after:border-l after:border-[#F6F1E8]/65 after:bg-[#123EBB]">
              <span className="h-1 w-1 rounded-full bg-[#F6F1E8]" /><span className="h-1 w-1 rounded-full bg-[#F6F1E8]" /><span className="h-1 w-1 rounded-full bg-[#F6F1E8]" />
            </span>
            <span className="absolute left-[8%] top-[24%] h-40 w-[84%] -rotate-[18deg] rounded-[50%] border border-[#F6F1E8]/20 sm:h-52" />
            <div className="absolute left-[12%] top-[24%] flex h-40 w-[39%] -rotate-[12deg] flex-col items-center justify-center rounded-[1.25rem] rounded-tr-[2.25rem] border border-[#10284F]/10 bg-[#F6F1E8] text-[#123EBB] shadow-[4px_6px_0_0_#10284F33] sm:h-48">
              <span lang="zh-Hans" className="font-serif text-7xl leading-none sm:text-8xl">你</span>
              <span className="mt-4 text-sm tracking-[0.16em]">nǐ</span>
            </div>
            <div className="absolute right-[11%] top-[33%] flex h-40 w-[39%] rotate-[10deg] flex-col items-center justify-center rounded-[1.25rem] rounded-br-[2.5rem] border border-[#10284F]/10 bg-[#E9DFC9] text-[#123EBB] shadow-[4px_6px_0_0_#10284F33] sm:h-48">
              <span lang="zh-Hans" className="font-serif text-7xl leading-none sm:text-8xl">好</span>
              <span className="mt-4 text-sm tracking-[0.16em]">hǎo</span>
            </div>
            <span className="absolute bottom-[23%] left-[7%] h-8 w-5 -rotate-[20deg] rounded-bl-full border-b border-l border-[#F6F1E8]/70" />
            <span className="absolute right-[8%] top-[35%] h-5 w-3 rotate-[20deg] rounded-tr-full border-r border-t border-[#F6F1E8]/70" />
            <span className="absolute bottom-7 left-9 -rotate-[4deg] font-serif text-lg italic">Todo empieza con un hola.</span>
          </div>
        </header>

        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3 border-t border-[#10284F]/20 pt-6">
          <h2 className="text-2xl font-medium tracking-tight">Tu recorrido</h2>
          <p className="text-xs text-[#43546A]">Siguiente: Sesión {nextSession} · Contenido provisional</p>
        </div>
        <div className="space-y-8 sm:space-y-10">
          {blocks.map((block) => (
            <section key={block.number} aria-labelledby={`block-${block.number}-title`} className={`rounded-[2rem] p-4 sm:p-6 ${block.surface}`}>
              <div className={`grid gap-5 lg:gap-6 ${block.number === "03" ? "lg:grid-cols-[0.8fr_1.7fr]" : ""}`}>
                <div className={`relative isolate overflow-hidden rounded-[1.5rem] p-6 sm:p-8 ${block.heading}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-3 -z-10 font-serif text-[10rem] leading-none opacity-[0.08] sm:right-8 sm:text-[13rem]">{block.symbol}</span>
                  <div className={`flex gap-6 ${block.number === "03" ? "flex-col" : "flex-col sm:flex-row sm:items-center sm:gap-8"}`}>
                    <span aria-hidden="true" className="font-serif text-6xl leading-none tracking-tight opacity-80 sm:text-7xl">{block.number}</span>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.16em] uppercase">Bloque {block.number} · Lecciones {block.start}–{block.end}</p>
                      <h2 id={`block-${block.number}-title`} className="mt-3 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">{block.title}</h2>
                      <p className="mt-3 max-w-md text-sm leading-relaxed">{block.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className={`grid gap-4 md:grid-cols-2 ${block.grid}`}>
                  {courseLessons.filter((lesson) => lesson.number >= block.start && lesson.number <= block.end).map((lesson) => (
                    <LessonCard key={lesson.number} lesson={lesson} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-center font-serif text-lg italic text-[#43546A]"><span lang="zh-Hans">慢慢来</span> · Cada pequeño paso cuenta.</p>
      </div>
    </main>
  );
}
