"use client";

import { useSyncExternalStore } from "react";
import { LESSON_1_PROGRESS_CHANGED, LESSON_1_PROGRESS_KEY, loadLesson1Progress } from "@/lib/progress/lesson1Progress";
import { LESSON_2_PROGRESS_CHANGED, LESSON_2_PROGRESS_KEY, loadLesson2Progress } from "@/lib/progress/lesson2Progress";

export const TOTAL_SESSIONS = 20;
const trackedSessions = [
  { key: LESSON_1_PROGRESS_KEY, event: LESSON_1_PROGRESS_CHANGED, load: loadLesson1Progress },
  { key: LESSON_2_PROGRESS_KEY, event: LESSON_2_PROGRESS_CHANGED, load: loadLesson2Progress },
];
function getSnapshot() {
  // A primitive snapshot stays stable between reads, unlike a newly allocated object.
  return trackedSessions.map(({ load }) => {
    try { return load().sessionCompleted ? "1" : "0"; } catch { return "0"; }
  }).join("");
}
function getServerSnapshot() { return "00"; }
function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || trackedSessions.some(({ key }) => key === event.key)) onChange();
  };
  trackedSessions.forEach(({ event }) => window.addEventListener(event, onChange));
  window.addEventListener("storage", onStorage);
  return () => {
    trackedSessions.forEach(({ event }) => window.removeEventListener(event, onChange));
    window.removeEventListener("storage", onStorage);
  };
}
export function useCourseProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completed = [...snapshot].map((value) => value === "1");
  const completedSessions = completed.filter(Boolean).length;
  const firstIncomplete = completed.findIndex((value) => !value);
  return {
    lesson1Completed: completed[0], lesson2Completed: completed[1], completedSessions,
    courseProgressPercent: completedSessions / TOTAL_SESSIONS * 100,
    nextSession: firstIncomplete === -1 ? trackedSessions.length + 1 : firstIncomplete + 1,
  };
}
