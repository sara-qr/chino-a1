export const LESSON_1_PROGRESS_KEY = "chino-a1:lesson-1-progress";

export const LESSON_1_PROGRESS_CHANGED = "chino-a1:lesson-1-progress-changed";

export type Lesson1State = {
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

const words = ["你", "好", "你好"];

export function initialLesson1State(): Lesson1State {
  return {
    phase: 0, answers: {}, meanings: {}, sounds: {}, showResult: false, listeningCompleted: false,
    tutorCopied: false, tutorCompleted: false, sessionCompleted: false,
  };
}

// Completion means answered, independently of whether the answer is correct.
// The listening activity is done on paper and is explicitly marked by the learner.
export function lesson1Snapshot(state: Lesson1State) {
  const exerciseCompleted = {
    listening: state.listeningCompleted,
    intro: Boolean(state.answers.intro),
    meanings: Object.fromEntries(words.map((word) => [word, Boolean(state.meanings[word])])),
    meaningMatching: words.every((word) => Boolean(state.meanings[word])),
    pronunciation: Boolean(state.answers.tone),
    p1: Boolean(state.answers.p1),
    p2: Boolean(state.answers.p2),
    sounds: Object.fromEntries(words.map((word) => [word, Boolean(state.sounds[word])])),
    p3: words.every((word) => Boolean(state.sounds[word])),
    p4: Boolean(state.answers.p4),
  };
  return {
    version: 1,
    ...state,
    score: Number(state.answers.p1 === "Hola") + Number(state.answers.p2 === "tú")
      + Number(state.answers.p4 === "mǎ")
      + Number(state.sounds["你"] === "nǐ" && state.sounds["好"] === "hǎo" && state.sounds["你好"] === "Nǐ hǎo"),
    exerciseCompleted,
    practiceCompleted: exerciseCompleted.listening && exerciseCompleted.p1 && exerciseCompleted.p2 && exerciseCompleted.p3 && exerciseCompleted.p4,
    progress: state.sessionCompleted ? 100 : state.phase * 20,
  };
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function validAnswers(value: unknown, options: Record<string, string[]>) {
  const data = record(value);
  return Object.fromEntries(Object.entries(options).flatMap(([key, allowed]) =>
    typeof data[key] === "string" && allowed.includes(data[key]) ? [[key, data[key]]] : []));
}

export function parseLesson1Progress(raw: string | null): Lesson1State {
  const initial = initialLesson1State();
  if (!raw) return initial;
  try {
    const data = record(JSON.parse(raw));
    if (data.version !== 1) return initial;
    const completed = data.sessionCompleted === true;
    return {
      // A completed session always reopens on its summary; review is explicit.
      phase: completed ? 5 : typeof data.phase === "number" && Number.isInteger(data.phase) && data.phase >= 0 && data.phase <= 4 ? data.phase : 0,
      answers: validAnswers(data.answers, {
        intro: ["2", "3", "4", "5"], tone: ["mā", "má", "mǎ", "mà"],
        p1: ["Adiós", "Hola", "Gracias", "Sí"], p2: ["yo", "tú", "bien", "hola"],
        p4: ["mā", "má", "mǎ", "mà"],
      }),
      meanings: validAnswers(data.meanings, Object.fromEntries(words.map((word) => [word, ["hola", "tú", "bien / bueno"]]))),
      sounds: validAnswers(data.sounds, Object.fromEntries(words.map((word) => [word, ["hǎo", "Nǐ hǎo", "nǐ"]]))),
      showResult: data.showResult === true,
      listeningCompleted: data.listeningCompleted === true,
      tutorCopied: data.tutorCopied === true,
      tutorCompleted: completed || data.tutorCompleted === true,
      sessionCompleted: completed,
    };
  } catch {
    return initial;
  }
}

export function loadLesson1Progress(): Lesson1State {
  return parseLesson1Progress(window.localStorage.getItem(LESSON_1_PROGRESS_KEY));
}

export function saveLesson1Progress(state: Lesson1State) {
  // Keep the key absent after a reset, including after the next page load.
  if (JSON.stringify(state) === JSON.stringify(initialLesson1State())) {
    window.localStorage.removeItem(LESSON_1_PROGRESS_KEY);
  } else {
    window.localStorage.setItem(LESSON_1_PROGRESS_KEY, JSON.stringify(lesson1Snapshot(state)));
  }
  window.dispatchEvent(new CustomEvent(LESSON_1_PROGRESS_CHANGED));
}

export function clearLesson1Progress() {
  window.localStorage.removeItem(LESSON_1_PROGRESS_KEY);
  window.dispatchEvent(new CustomEvent(LESSON_1_PROGRESS_CHANGED));
}
