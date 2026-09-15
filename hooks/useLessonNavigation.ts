"use client";

import { useState } from "react";
import { LESSON_PHASE_LABELS } from "@/lib/progress/lessonPhase";

// Owned by the page, outside the progress-restored/keyed session component.
// A remote refresh can remount session data without destroying review navigation.
export function useLessonNavigation() {
  const [review, setReview] = useState({ reviewMode: false, reviewPhase: 0 });
  return {
    ...review,
    visiblePhase(completed: boolean, savedPhase: number) {
      return completed && review.reviewMode ? review.reviewPhase : savedPhase;
    },
    onReviewSession() { setReview({ reviewMode: true, reviewPhase: 0 }); },
    exitReview() { setReview({ reviewMode: false, reviewPhase: 0 }); },
    move(next: number, completed: boolean, savePhase: (phase: number) => void) {
      const phase = Math.max(0, Math.min(next, LESSON_PHASE_LABELS.length));
      if (completed) setReview({ reviewMode: phase < LESSON_PHASE_LABELS.length, reviewPhase: phase });
      else savePhase(phase);
    },
  };
}
