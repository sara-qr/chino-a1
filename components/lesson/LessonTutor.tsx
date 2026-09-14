import type { ReactNode } from "react";
import { buttonStyle } from "./Activities";

export function LessonTutor({ objectives, conversation, text, onCopy, copyStatus }: {
  objectives: string[]; conversation?: ReactNode; text: string; onCopy: () => void; copyStatus: string;
}) {
  return <>
    <div className="rounded-[2.5rem] rounded-br-[5rem] bg-[#1748D5] p-7 text-white sm:p-10">
      <p className="font-serif text-3xl sm:text-4xl">Ahora toca practicar conmigo.</p>
      <h3 className="mt-7 text-sm font-semibold">Objetivos de esta sesión</h3>
      <ul className="mt-4 list-disc space-y-3 pl-5">{objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
      {conversation}
    </div>
    <div className="rounded-3xl border border-[#10284F]/20 bg-white p-6">
      <label htmlFor="tutor-sheet" className="font-semibold">Tu ficha para el tutor</label><textarea id="tutor-sheet" readOnly value={text} rows={19} className="mt-4 w-full rounded-2xl border border-[#10284F]/20 bg-[#F6F1E8] p-4 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-[#1748D5]" />
      <div className="mt-4 flex flex-wrap gap-3"><button onClick={onCopy} className={`${buttonStyle} bg-[#1748D5] text-white`}>Copiar para ChatGPT</button><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className={`${buttonStyle} inline-flex items-center border border-[#10284F]/25`}>Abrir ChatGPT<span className="sr-only"> (se abre en una nueva pestaña)</span></a></div>
      <p className="mt-4 text-sm">Abre ChatGPT y pega esta ficha para empezar tu práctica oral.</p><p role="status" className="mt-3 text-sm">{copyStatus}</p>
    </div>
  </>;
}
