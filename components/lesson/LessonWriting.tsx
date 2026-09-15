import type { WritingCharacter } from "@/lib/characters/writing";

function StrokeDiagram({ item, step }: { item: WritingCharacter; step?: number }) {
  const start = step === undefined ? null : item.geometry.medians[step][0];
  return <svg viewBox="0 0 1024 1024" role="img" aria-label={step === undefined ? item.character : `${item.character}, trazo ${step + 1}: ${item.steps[step]}`} className="aspect-square w-full rounded-2xl border border-[#10284F]/15 bg-[#FFFCF5]">
    <path d="M512 0V1024M0 512H1024M0 0L1024 1024M1024 0L0 1024" stroke="#10284F" strokeOpacity="0.12" strokeWidth="4" strokeDasharray="12 12" />
    <g transform="translate(0 900) scale(1 -1)">
      {item.geometry.strokes.map((d, index) => <path key={index} d={d} fill={step === undefined || index === step ? "#123EBB" : index < step ? "#7185AC" : "#E7E3DA"} />)}
      {start && <circle cx={start[0]} cy={start[1]} r="19" fill="#FFFCF5" stroke="#10284F" strokeWidth="8" />}
    </g>
  </svg>;
}

export function LessonWriting({ characters, completed, onCompletedChange }: {
  characters: WritingCharacter[]; completed: boolean; onCompletedChange: (value: boolean) => void;
}) {
  return <div className="space-y-7">
    <p className="max-w-2xl leading-relaxed text-[#43546A]">Prepara papel y lápiz. Sigue cada paso de la secuencia: el trazo nuevo está en azul y el círculo indica dónde empezar. Levanta el lápiz al terminar cada trazo, no en mitad de un giro.</p>
    {characters.map((item) => <article key={item.character} className="rounded-[2rem] border border-[#10284F]/15 bg-[#FFFCF5] p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-6">
        <div className="w-36 shrink-0 sm:w-44"><StrokeDiagram item={item} /></div>
        <div className="min-w-0 flex-1 basis-40">
          <h3 className="font-serif text-5xl text-[#123EBB]" lang="zh-Hans">{item.character}</h3>
          <p className="mt-3 text-xl">{item.pinyin} <span className="text-[#43546A]">· {item.meaning}</span></p>
          <p className="mt-3 inline-block rounded-full border border-[#10284F]/20 px-3 py-1 text-sm">{item.geometry.strokes.length} trazos</p>
        </div>
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed">{item.components}</p>
      {item.note && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#43546A]">{item.note}</p>}
      <h4 className="mt-7 font-semibold">Trazo a trazo</h4>
      <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {item.steps.map((description, index) => <li key={index} className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider">Trazo {index + 1}</p>
          <StrokeDiagram item={item} step={index} />
          <p className="mt-3 text-sm leading-relaxed text-[#43546A]">{description}</p>
        </li>)}
      </ol>
      <div className="mt-7 rounded-2xl bg-[#F6F1E8] p-4 text-sm leading-relaxed"><strong>Ahora tú:</strong> escribe {item.character} 3 veces mirando el modelo y 2 veces de memoria. Después compara el orden y la posición de los trazos.</div>
    </article>)}
    <label className="flex items-start gap-3 rounded-2xl border border-[#10284F]/15 bg-[#E3E9F8] p-5 text-sm">
      <input type="checkbox" checked={completed} onChange={(event) => onCompletedChange(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1748D5]" />
      He completado la práctica de escritura: 3 veces mirando y 2 de memoria por carácter.
    </label>
    <p className="text-xs leading-relaxed text-[#657386]">Modelos de trazos: <a href="https://github.com/chanind/hanzi-writer-data" target="_blank" rel="noopener noreferrer" className="underline">Hanzi Writer Data / Make Me a Hanzi (abre otra pestaña)</a> · Arphic Public License. Práctica en papel, sin evaluación automática.</p>
  </div>;
}
