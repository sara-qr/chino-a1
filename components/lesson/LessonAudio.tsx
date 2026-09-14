"use client";

import { useId, useState } from "react";

export function LessonAudio({ title, source, src, instruction, transcript }: {
  title: string;
  source: string;
  src: string;
  instruction: string;
  transcript?: string;
}) {
  const id = useId();
  const [failed, setFailed] = useState(false);

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-3xl border border-[#10284F]/20 bg-white p-5 sm:p-7">
      <p className="text-xs font-semibold tracking-wide text-[#43546A]">{source}</p>
      <h3 id={`${id}-title`} className="mt-3 text-xl font-semibold">{title}</h3>
      <p id={`${id}-instructions`} className="mt-3 text-sm leading-relaxed text-[#43546A]">{instruction}</p>
      <audio controls preload="metadata" aria-labelledby={`${id}-title`} aria-describedby={`${id}-instructions`} onError={() => setFailed(true)} className="mt-5 w-full" src={src}>
        Tu navegador no admite la reproducción de audio HTML5.
      </audio>
      {failed && <p role="alert" className="mt-3 text-sm text-[#913329]">No se ha podido cargar el audio. Prueba a abrir el archivo con el enlace de abajo.</p>}
      <a href={src} className="mt-3 inline-block rounded text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#1748D5]">Abrir audio completo</a>
      {transcript && <details className="mt-4 text-sm leading-relaxed"><summary className="cursor-pointer rounded py-2 font-semibold focus-visible:outline-2 focus-visible:outline-[#1748D5]">Ver el diálogo y el vocabulario</summary><p className="mt-2">{transcript}</p></details>}
    </section>
  );
}
