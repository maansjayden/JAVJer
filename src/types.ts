export type LessonStatus = "locked" | "available" | "completed";

export interface Lesson {
  id: string;
  title: string;
  analogy: string;
  concept: string;
  initialCode: string;
  expectedOutput?: string;
  nextLessonId?: string;
  prerequisites: string[];
}

export interface UserProgress {
  completedLessons: string[];
  currentLessonId: string;
}
