"use client";

export const buttonStyle = "min-h-12 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1748D5]";

export function Choice({ question, options, correct, value, onChange }: {
  question: string; options: string[]; correct: string; value: string | undefined; onChange: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0 rounded-[1.75rem] border border-[#10284F]/15 bg-[#FFFCF5] p-0">
      <legend className="sr-only">{question}</legend>
      <div className="p-5 sm:p-6">
      <p aria-hidden="true" className="mb-4 text-lg font-semibold leading-snug text-[#10284F]">{question}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}
            className={`${buttonStyle} border ${value === option ? option === correct ? "border-[#276544] bg-[#E3F2E8] text-[#205337]" : "border-[#A33B30] bg-[#FBE9E5] text-[#913329]" : "border-[#10284F]/25 bg-[#F6F1E8] hover:bg-[#E3E9F8]"}`}>{option}</button>
        ))}
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className={`text-sm leading-relaxed ${value ? "mt-3" : ""} ${value === correct ? "text-[#205337]" : "text-[#913329]"}`}>
        {value ? value === correct ? "Correcto. ¡Muy bien!" : "Todavía no. Prueba otra vez." : ""}
      </p>
      </div>
    </fieldset>
  );
}

export function Matching({ title, pairs, options, values, onChange }: {
  title: string; pairs: [string, string][]; options: string[]; values: Record<string, string>; onChange: (key: string, value: string) => void;
}) {
  return (
    <fieldset className="min-w-0 rounded-3xl border border-[#10284F]/20 bg-white p-5 sm:p-7">
      <legend className="max-w-full px-2 text-lg font-semibold">{title}</legend>
      <p className="mb-4 text-sm text-[#43546A]">Elige una pareja para cada expresión.</p>
      <div className="space-y-4">
        {pairs.map(([word, answer]) => (
          <div key={word} className="flex flex-wrap items-center gap-3 border-t border-[#10284F]/10 pt-4">
            <label className="flex w-full flex-wrap items-center justify-between gap-3">
              <span lang="zh-Hans" className="font-serif text-3xl text-[#1748D5]">{word}</span>
              <select aria-label={`Relaciona ${word}`} value={values[word] ?? ""} onChange={(event) => onChange(word, event.target.value)}
                className="min-h-12 max-w-full rounded-xl border border-[#10284F]/30 bg-[#F6F1E8] px-4 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1748D5]">
                <option value="">Selecciona</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <p role="status" className={`min-h-5 text-sm ${values[word] === answer ? "text-[#205337]" : "text-[#913329]"}`}>
              {values[word] ? values[word] === answer ? "Pareja correcta." : "Revisa esta pareja e inténtalo de nuevo." : ""}
            </p>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

const tones = [
  { syllable: "mā", description: "alto y mantenido", line: "top-3 left-3 w-20" },
  { syllable: "má", description: "ascendente", line: "top-7 left-3 w-20 -rotate-[25deg]" },
  { syllable: "mǎ", description: "baja y vuelve a subir", line: "top-7 left-3 w-10 rotate-[30deg]", second: true },
  { syllable: "mà", description: "caída fuerte", line: "top-7 left-3 w-20 rotate-[35deg]" },
];

export function ToneCard({ tone }: { tone: number }) {
  const item = tones[tone - 1];
  return (
    <div className="rounded-3xl border border-[#1748D5]/25 bg-[#F6F1E8] p-5">
      <p className="text-xs font-bold tracking-wider">{tone}.º tono</p>
      <p className="mt-3 text-4xl text-[#1748D5]">{item.syllable}</p>
      <div aria-hidden="true" className="relative my-3 h-14 w-28 border-b border-dashed border-[#10284F]/20">
        <span className={`absolute h-0.5 rounded-full bg-[#1748D5] ${item.line}`} />
        {item.second && <span className="absolute left-[46px] top-6 h-0.5 w-12 -rotate-[40deg] rounded-full bg-[#1748D5]" />}
      </div>
      <p className="text-sm text-[#43546A]">{item.description}</p>
    </div>
  );
}
