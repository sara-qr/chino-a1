import Link from "next/link";
import { buttonStyle } from "./Activities";

export function LessonCompletion({ number, vocabulary, pronunciation, score, maxScore, practiceDone, courseProgress, storageError, onReview }: {
  number: number; vocabulary: string; pronunciation: string; score: number; maxScore: number;
  practiceDone: boolean; courseProgress: number; storageError: string; onReview: () => void;
}) {
  return <div className="rounded-[2.5rem] bg-[#10284F] p-8 text-[#F6F1E8] sm:p-12">
    <p className="text-lg">Has aprendido:</p><p lang="zh-Hans" className="mt-5 break-words font-serif text-5xl sm:text-7xl">{vocabulary}</p>
    <p className="mt-7">{pronunciation}</p><p className="mt-4">Resultado de práctica: {score} / {maxScore}{!practiceDone && " · Hay ejercicios sin responder"}</p>
    <div className="mt-8 border-t border-white/25 pt-6"><p>Sesión {number} / 20</p><p className="mt-3 text-4xl">{courseProgress}% del curso</p><p className="mt-4 text-sm">{storageError ? "El guardado local no está disponible." : "Tu progreso se guarda automáticamente en este navegador."}</p></div>
    <div className="mt-8 flex flex-wrap gap-3"><button onClick={onReview} className={`${buttonStyle} bg-[#F6F1E8] text-[#10284F] focus-visible:outline-white`}>Revisar sesión</button><Link href="/course" className={`${buttonStyle} bg-[#F6F1E8] text-[#10284F] focus-visible:outline-white`}>Volver al curso</Link><Link href="/dashboard" className={`${buttonStyle} border border-white/50 focus-visible:outline-white`}>Continuar más tarde</Link></div>
  </div>;
}
