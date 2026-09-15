// Base for current and future lessons; the completion screen follows Tutor.
export const LESSON_PHASE_LABELS = ["Repaso", "Aprende", "Pronuncia", "Escribe", "Practica", "Tutor"] as const;

// v1: review, learn, pronounce, practice, tutor, completion.
// v2: review, learn, write, pronounce, practice, tutor, completion.
// v3: review, learn, pronounce, write, practice, tutor, completion.
export function restoreLessonPhase(value: unknown, version: unknown, completed: boolean) {
  if (completed) return LESSON_PHASE_LABELS.length;
  const max = version === 1 ? 4 : 5;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > max) return 0;
  if (version === 1) return value >= 3 ? value + 1 : value;
  if (version === 2 && (value === 2 || value === 3)) return 5 - value;
  return value;
}
