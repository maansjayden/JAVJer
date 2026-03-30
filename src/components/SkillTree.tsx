import React from "react";
import { motion } from "motion/react";
import { CheckCircle, Lock, Play } from "lucide-react";
import { Lesson, UserProgress } from "../types";
import { LESSONS } from "../constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkillTreeProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ progress, onSelectLesson }) => {
  return (
    <div className="flex flex-col items-center py-12 space-y-12">
      <h1 className="text-4xl font-bold text-white mb-8">Your Java Journey</h1>
      <div className="relative flex flex-col items-center space-y-16">
        {LESSONS.map((lesson, index) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const isAvailable = lesson.prerequisites.every(p => progress.completedLessons.includes(p));
          const isCurrent = progress.currentLessonId === lesson.id;

          return (
            <div key={lesson.id} className="relative flex flex-col items-center">
              {index < LESSONS.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-full h-16 w-1",
                    isCompleted ? "bg-green-500" : "bg-gray-700"
                  )}
                />
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (isAvailable || isCompleted) && onSelectLesson(lesson.id)}
                className={cn(
                  "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                  isCompleted ? "bg-green-900/30 border-green-500 text-green-500" :
                  isCurrent ? "bg-blue-900/30 border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" :
                  isAvailable ? "bg-gray-800 border-gray-600 text-gray-400" :
                  "bg-gray-900 border-gray-800 text-gray-700 cursor-not-allowed"
                )}
              >
                {isCompleted ? <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" /> :
                 isAvailable ? <Play className="w-8 h-8 sm:w-10 sm:h-10" /> :
                 <Lock className="w-8 h-8 sm:w-10 sm:h-10" />}
                
                <div className="absolute top-full sm:top-auto sm:left-full mt-4 sm:mt-0 sm:ml-6 w-40 sm:w-48 text-center sm:text-left">
                  <p className={cn(
                    "font-bold text-base sm:text-lg whitespace-nowrap sm:whitespace-normal",
                    isAvailable || isCompleted ? "text-white" : "text-gray-600"
                  )}>
                    {lesson.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {isCompleted ? "Completed" : isAvailable ? "Ready to start" : "Locked"}
                  </p>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
