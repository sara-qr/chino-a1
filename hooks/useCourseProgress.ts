"use client";

import { useSyncExternalStore } from "react";
import { LESSON_1_PROGRESS_CHANGED, LESSON_1_PROGRESS_KEY, loadLesson1Progress } from "@/lib/progress/lesson1Progress";

export const TOTAL_SESSIONS = 20;

function getSnapshot() {
  try {
    return loadLesson1Progress().sessionCompleted;
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LESSON_1_PROGRESS_KEY || event.key === null) onChange();
  };
  window.addEventListener(LESSON_1_PROGRESS_CHANGED, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LESSON_1_PROGRESS_CHANGED, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCourseProgress() {
  // A boolean snapshot is stable; server rendering never reads localStorage.
  const lesson1Completed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const completedSessions = lesson1Completed ? 1 : 0;
  return {
    lesson1Completed,
    completedSessions,
    courseProgressPercent: completedSessions / TOTAL_SESSIONS * 100,
    nextSession: lesson1Completed ? 2 : 1,
  };
}
