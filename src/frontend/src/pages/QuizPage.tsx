import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Trophy, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  useGetDailyChallenge,
  useGetQuiz,
  useSubmitQuizAnswers,
} from "../hooks/useQueries";

interface QuizPageProps {
  courseId: bigint;
  isDaily?: boolean;
  navigate: (page: Page) => void;
}

export default function QuizPage({
  courseId,
  isDaily,
  navigate,
}: QuizPageProps) {
  const regularQuiz = useGetQuiz(isDaily ? null : courseId);
  const dailyQuiz = useGetDailyChallenge();
  const submitAnswers = useSubmitQuizAnswers();

  const quizData = isDaily ? dailyQuiz.data : regularQuiz.data;
  const isLoading = isDaily ? dailyQuiz.isLoading : regularQuiz.isLoading;

  const questions = quizData?.questions ?? [];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<bigint[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (isLoading) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4"
        data-ocid="quiz.loading_state"
      >
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center"
        data-ocid="quiz.error_state"
      >
        <p className="text-muted-foreground mb-4">
          No quiz available for this course.
        </p>
        <Button onClick={() => navigate({ name: "courses" })}>
          Back to Courses
        </Button>
      </div>
    );
  }

  const question = questions[currentQ];
  const totalQ = questions.length;
  const progressPct = (currentQ / totalQ) * 100;

  const handleSelect = (optIndex: number) => {
    setSelected(optIndex);
  };

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = [...answers, BigInt(selected)];
    setAnswers(newAnswers);

    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      // Submit quiz
      try {
        const result = await submitAnswers.mutateAsync({
          courseId,
          answers: newAnswers,
        });
        setScore(Number(result));
        setShowResult(true);
        toast.success("Quiz submitted!");
      } catch {
        // Calculate score client-side as fallback
        let correct = 0;
        questions.forEach((q, i) => {
          if (Number(newAnswers[i]) === Number(q.correctAnswer)) correct++;
        });
        setScore(correct);
        setShowResult(true);
      }
    }
  };

  // Result screen
  if (showResult && score !== null) {
    const percentage = Math.round((score / totalQ) * 100);
    const passed = percentage >= 60;

    return (
      <div
        className="max-w-2xl mx-auto px-4 sm:px-6 py-12"
        data-ocid="quiz.section"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border shadow-card p-10 text-center"
          data-ocid="quiz.success_state"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: passed
                ? "oklch(0.92 0.06 142)"
                : "oklch(0.95 0.05 27)",
            }}
          >
            {passed ? (
              <Trophy
                className="w-10 h-10"
                style={{ color: "oklch(0.56 0.17 142)" }}
              />
            ) : (
              <XCircle
                className="w-10 h-10"
                style={{ color: "oklch(0.45 0.2 27)" }}
              />
            )}
          </div>

          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            {passed ? "Excellent Work! 🎉" : "Keep Practicing!"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            You scored {score} out of {totalQ} questions correctly.
          </p>

          {/* Score ring */}
          <div className="flex items-center justify-center mb-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${passed ? "oklch(0.56 0.17 142)" : "oklch(0.67 0.19 42)"} ${percentage * 3.6}deg, oklch(0.93 0.01 248) 0deg)`,
              }}
            >
              <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
                <div>
                  <div className="font-display font-bold text-2xl text-foreground">
                    {percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate({ name: "courses" })}
              data-ocid="quiz.secondary_button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Courses
            </Button>
            {!isDaily && (
              <Button
                className="text-white"
                style={{ background: "oklch(0.245 0.095 248)" }}
                onClick={() => navigate({ name: "course", courseId })}
                data-ocid="quiz.primary_button"
              >
                Back to Course
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz question screen
  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="quiz.section"
    >
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          isDaily
            ? navigate({ name: "dashboard" })
            : navigate({ name: "course", courseId })
        }
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="quiz.link"
      >
        <ArrowLeft className="w-4 h-4" />
        {isDaily ? "Back to Dashboard" : "Back to Course"}
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display font-bold text-xl text-foreground">
            {isDaily ? "Daily Challenge" : "Course Quiz"}
          </h1>
          <span className="text-sm text-muted-foreground font-medium">
            {currentQ + 1} / {totalQ}
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8 mb-6"
        >
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">
            Question {currentQ + 1}
          </p>
          <h2 className="font-display font-semibold text-foreground text-lg sm:text-xl mb-6 leading-snug">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-edu-navy text-edu-navy"
                      : "border-border text-foreground hover:border-muted-foreground hover:bg-secondary/50"
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: "oklch(0.245 0.095 248)",
                          background: "oklch(0.93 0.03 248)",
                        }
                      : {}
                  }
                  data-ocid={`quiz.radio.${i + 1}`}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-3"
                    style={{
                      background: isSelected
                        ? "oklch(0.245 0.095 248)"
                        : "oklch(0.92 0.02 248)",
                      color: isSelected ? "white" : "oklch(0.5 0.04 248)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {selected !== null
            ? "Answer selected"
            : "Select an answer to continue"}
        </span>
        <Button
          disabled={selected === null || submitAnswers.isPending}
          onClick={handleNext}
          className="font-semibold text-white"
          style={{ background: "oklch(0.245 0.095 248)" }}
          data-ocid="quiz.submit_button"
        >
          {submitAnswers.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {submitAnswers.isPending
            ? "Submitting..."
            : currentQ === totalQ - 1
              ? "Submit Quiz"
              : "Next Question"}
        </Button>
      </div>
    </div>
  );
}
