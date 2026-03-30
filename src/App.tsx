import React, { useState, useEffect } from "react";
import { SkillTree } from "./components/SkillTree";
import { LessonView } from "./components/LessonView";
import { UserProgress, Lesson } from "./types";
import { LESSONS } from "./constants";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_PROGRESS: UserProgress = {
  completedLessons: [],
  currentLessonId: LESSONS[0].id,
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("java-journey-progress");
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("java-journey-progress", JSON.stringify(progress));
  }, [progress]);

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const handleCompleteLesson = (lessonId: string) => {
    const lesson = LESSONS.find(l => l.id === lessonId);
    const nextLessonId = lesson?.nextLessonId || null;

    setProgress(prev => {
      const newCompleted = prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId];
      
      return {
        completedLessons: newCompleted,
        currentLessonId: nextLessonId || prev.currentLessonId,
      };
    });

    setActiveLessonId(null);
  };

  const activeLesson = LESSONS.find(l => l.id === activeLessonId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 selection:bg-blue-500/30 selection:text-blue-200">
      <AnimatePresence mode="wait">
        {!activeLessonId ? (
          <motion.div
            key="skill-tree"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6"
          >
            <SkillTree 
              progress={progress} 
              onSelectLesson={handleSelectLesson} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="lesson-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-screen"
          >
            {activeLesson && (
              <LessonView 
                lesson={activeLesson} 
                onBack={() => setActiveLessonId(null)}
                onComplete={handleCompleteLesson}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
