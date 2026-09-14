import { lesson2MeaningPairs, lesson2Quiz, lesson2Review, lesson2SoundPairs } from "../lessons/lesson2";

export const LESSON_2_PROGRESS_KEY = "chino-a1:lesson-2-progress";
export const LESSON_2_PROGRESS_CHANGED = "chino-a1:lesson-2-progress-changed";
export type Lesson2State = {
  phase: number;
  answers: Record<string, string>;
  meanings: Record<string, string>;
  sounds: Record<string, string>;
  showResult: boolean;
  listeningCompleted: boolean;
  tutorCopied: boolean;
  tutorCompleted: boolean;
  sessionCompleted: boolean;
};
export function initialLesson2State(): Lesson2State {
  return { phase: 0, answers: {}, meanings: {}, sounds: {}, showResult: false, listeningCompleted: false, tutorCopied: false, tutorCompleted: false, sessionCompleted: false };
}
export function lesson2Snapshot(state: Lesson2State) {
  // Answered is different from correct. The listening is self-assessed, not scored.
  const exerciseCompleted = {
    ...Object.fromEntries([...lesson2Review, ...lesson2Quiz].map(({ id }) => [id, Boolean(state.answers[id])])),
    meanings: Object.fromEntries(lesson2MeaningPairs.map(([word]) => [word, Boolean(state.meanings[word])])),
    meaningMatching: lesson2MeaningPairs.every(([word]) => Boolean(state.meanings[word])),
    pronunciation: Boolean(state.answers.tone),
    sounds: Object.fromEntries(lesson2SoundPairs.map(([word]) => [word, Boolean(state.sounds[word])])),
    p5: lesson2SoundPairs.every(([word]) => Boolean(state.sounds[word])),
    listening: state.listeningCompleted,
  };
  const quizCompleted = lesson2Quiz.every(({ id }) => Boolean(state.answers[id])) && exerciseCompleted.p5;
  return {
    version: 1, ...state,
    score: lesson2Quiz.reduce((score, item) => score + Number(state.answers[item.id] === item.correct), 0)
      + Number(lesson2SoundPairs.every(([word, answer]) => state.sounds[word] === answer)),
    exerciseCompleted, quizCompleted,
    practiceCompleted: quizCompleted && state.listeningCompleted,
    progress: state.sessionCompleted ? 100 : state.phase * 20,
  };
}
function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function answers(value: unknown, options: Record<string, string[]>) {
  const data = record(value);
  return Object.fromEntries(Object.entries(options).flatMap(([key, allowed]) => typeof data[key] === "string" && allowed.includes(data[key]) ? [[key, data[key]]] : []));
}
export function parseLesson2Progress(raw: string | null): Lesson2State {
  if (!raw) return initialLesson2State();
  try {
    const data = record(JSON.parse(raw));
    if (data.version !== 1) return initialLesson2State();
    const completed = data.sessionCompleted === true;
    return {
      phase: completed ? 5 : typeof data.phase === "number" && Number.isInteger(data.phase) && data.phase >= 0 && data.phase <= 4 ? data.phase : 0,
      answers: answers(data.answers, { ...Object.fromEntries([...lesson2Review, ...lesson2Quiz].map((item) => [item.id, item.options])), tone: ["primero", "segundo", "tercero", "cuarto"] }),
      meanings: answers(data.meanings, Object.fromEntries(lesson2MeaningPairs.map(([word]) => [word, lesson2MeaningPairs.map(([, meaning]) => meaning)]))),
      sounds: answers(data.sounds, Object.fromEntries(lesson2SoundPairs.map(([word]) => [word, lesson2SoundPairs.map(([, sound]) => sound)]))),
      showResult: data.showResult === true, listeningCompleted: data.listeningCompleted === true,
      tutorCopied: data.tutorCopied === true, tutorCompleted: completed || data.tutorCompleted === true, sessionCompleted: completed,
    };
  } catch { return initialLesson2State(); }
}
export function loadLesson2Progress() {
  return parseLesson2Progress(window.localStorage.getItem(LESSON_2_PROGRESS_KEY));
}
export function saveLesson2Progress(state: Lesson2State) {
  if (JSON.stringify(state) === JSON.stringify(initialLesson2State())) window.localStorage.removeItem(LESSON_2_PROGRESS_KEY);
  else window.localStorage.setItem(LESSON_2_PROGRESS_KEY, JSON.stringify(lesson2Snapshot(state)));
  window.dispatchEvent(new CustomEvent(LESSON_2_PROGRESS_CHANGED));
}
export function clearLesson2Progress() {
  window.localStorage.removeItem(LESSON_2_PROGRESS_KEY);
  window.dispatchEvent(new CustomEvent(LESSON_2_PROGRESS_CHANGED));
}
