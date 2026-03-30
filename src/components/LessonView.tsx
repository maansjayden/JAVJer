import React, { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-java";
import "prismjs/themes/prism-tomorrow.css";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Lesson } from "../types";
import { translateJavaError } from "../services/geminiService";

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack, onComplete }) => {
  const [code, setCode] = useState(lesson.initialCode);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [translatedError, setTranslatedError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setCode(lesson.initialCode);
    setOutput("");
    setError(null);
    setTranslatedError(null);
    setIsSuccess(false);
  }, [lesson]);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setTranslatedError(null);
    setOutput("");
    setIsSuccess(false);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (data.success) {
        setOutput(data.output);
        // Check if output matches expected (simple trim comparison)
        if (lesson.expectedOutput && data.output.trim() === lesson.expectedOutput.trim()) {
          setIsSuccess(true);
        }
      } else {
        setError(data.error);
        setIsTranslating(true);
        const translated = await translateJavaError(data.error);
        setTranslatedError(translated);
        setIsTranslating(false);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-gray-200 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800 bg-[#0f0f0f]">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            onClick={onBack}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-white truncate max-w-[150px] sm:max-w-none">{lesson.title}</h2>
        </div>
        {isSuccess && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => onComplete(lesson.id)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold transition-colors text-sm sm:text-base"
          >
            <span>Continue</span>
            <CheckCircle size={18} />
          </motion.button>
        )}
      </header>

      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Panel: Content */}
        <div className="w-full lg:w-1/3 p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-800 bg-[#0f0f0f] max-h-[40%] lg:max-h-none">
          <section className="mb-6 lg:mb-8">
            <h3 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 sm:mb-4 flex items-center">
              <Sparkles size={14} className="mr-2" />
              The Analogy
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 italic">
              "{lesson.analogy}"
            </p>
          </section>

          <section>
            <h3 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 sm:mb-4">
              The Concept
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {lesson.concept}
            </p>
          </section>
        </div>

        {/* Right Panel: Editor & Console */}
        <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-mono text-sm">
            <div className="rounded-xl border border-gray-800 bg-[#0f0f0f] overflow-hidden">
              <div className="px-3 sm:px-4 py-2 bg-gray-800/50 border-b border-gray-800 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-gray-500">Main.java</span>
                <button 
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-3 sm:px-4 py-1 rounded text-[10px] sm:text-xs font-bold transition-colors"
                >
                  {isRunning ? <span>Running...</span> : (
                    <>
                      <Play size={12} />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              </div>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={code => highlight(code, languages.java, "java")}
                padding={16}
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 13,
                  minHeight: "200px",
                  backgroundColor: "transparent",
                }}
                className="focus:outline-none"
              />
            </div>
          </div>

          {/* Console Area */}
          <div className="h-1/3 border-t border-gray-800 bg-[#0a0a0a] p-4 sm:p-6 font-mono overflow-y-auto">
            <h4 className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase mb-3 sm:mb-4">Console Output</h4>
            
            <AnimatePresence mode="wait">
              {output && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs sm:text-sm"
                >
                  {output.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-start space-x-2 sm:space-x-3 text-red-400 bg-red-900/10 p-3 sm:p-4 rounded-lg border border-red-900/30">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold mb-1 text-xs sm:text-sm">Java says:</p>
                      <pre className="text-[10px] sm:text-xs whitespace-pre-wrap opacity-70">{error}</pre>
                    </div>
                  </div>

                  {isTranslating ? (
                    <div className="flex items-center space-x-2 text-blue-400 text-[10px] sm:text-sm italic">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles size={14} />
                      </motion.div>
                      <span>Translating to plain English...</span>
                    </div>
                  ) : translatedError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-900/10 p-3 sm:p-4 rounded-lg border border-blue-900/30 text-blue-200"
                    >
                      <p className="font-bold text-blue-400 mb-1.5 sm:mb-2 flex items-center text-xs sm:text-sm">
                        <Sparkles size={14} className="mr-2" />
                        Plain English Advice:
                      </p>
                      <p className="text-xs sm:text-sm leading-relaxed">{translatedError}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {!output && !error && (
                <div className="text-gray-700 italic text-[10px] sm:text-sm">
                  Click "Run Code" to see the output here...
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
