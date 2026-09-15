"use client";

import { useState } from "react";
import { LESSON_PHASE_LABELS } from "@/lib/progress/lessonPhase";

// Review is presentation state only. Reload returns to the saved completion
// screen; navigating a finished lesson never writes a new progress revision.
export function useLessonNavigation(completed: boolean, savedPhase: number, savePhase: (phase: number) => void) {
  const [reviewPhase, setReviewPhase] = useState<number>(LESSON_PHASE_LABELS.length);
  return {
    phase: completed ? reviewPhase : savedPhase,
    move(next: number) {
      const phase = Math.max(0, Math.min(next, LESSON_PHASE_LABELS.length));
      if (completed) setReviewPhase(phase);
      else savePhase(phase);
    },
  };
}
