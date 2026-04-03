import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  useGetCourse,
  useGetUserProgress,
  useMarkLessonComplete,
} from "../hooks/useQueries";

interface LessonViewerProps {
  courseId: bigint;
  lessonId: bigint;
  navigate: (page: Page) => void;
}

export default function LessonViewer({
  courseId,
  lessonId,
  navigate,
}: LessonViewerProps) {
  const { data: course, isLoading } = useGetCourse(courseId);
  const { data: progress } = useGetUserProgress();
  const markComplete = useMarkLessonComplete();

  const completedSet = new Set(
    (progress?.completedLessons ?? []).map((id) => id.toString()),
  );

  const lessons = course?.lessons ?? [];
  const currentIndex = lessons.findIndex(
    (l) => l.id.toString() === lessonId.toString(),
  );
  const lesson = lessons[currentIndex] ?? null;
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const isCompleted = completedSet.has(lessonId.toString());

  const handleMarkComplete = async () => {
    try {
      await markComplete.mutateAsync({ courseId, lessonId });
      toast.success("Lesson marked as complete! 🎉");
    } catch {
      toast.error("Failed to mark lesson complete");
    }
  };

  if (isLoading) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4"
        data-ocid="lesson.loading_state"
      >
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center"
        data-ocid="lesson.error_state"
      >
        <p className="text-muted-foreground">Lesson not found.</p>
        <Button
          className="mt-4"
          onClick={() => navigate({ name: "course", courseId })}
        >
          Back to Course
        </Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="lesson.section"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <button
          type="button"
          onClick={() => navigate({ name: "courses" })}
          className="hover:text-foreground transition-colors"
          data-ocid="lesson.link"
        >
          Courses
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate({ name: "course", courseId })}
          className="hover:text-foreground transition-colors line-clamp-1 max-w-[140px]"
          data-ocid="lesson.link"
        >
          {course?.title}
        </button>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1 max-w-[140px]">
          {lesson.title}
        </span>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground">
          Lesson {currentIndex + 1} of {lessons.length}
        </span>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / lessons.length) * 100}%`,
              background: "oklch(0.65 0.13 192)",
            }}
          />
        </div>
      </div>

      {/* Lesson content */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-card p-8 mb-6"
      >
        <div className="flex items-start gap-3 mb-6">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "oklch(0.9 0.06 248)" }}
          >
            <BookOpen
              className="w-4 h-4"
              style={{ color: "oklch(0.245 0.095 248)" }}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-0.5 uppercase tracking-wide">
              Lesson {currentIndex + 1}
            </p>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground">
              {lesson.title}
            </h1>
          </div>
          {isCompleted && (
            <CheckCircle2
              className="w-5 h-5 ml-auto shrink-0"
              style={{ color: "oklch(0.56 0.17 142)" }}
            />
          )}
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
          <p>{lesson.content}</p>
        </div>
      </motion.article>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevLesson}
            onClick={() =>
              prevLesson &&
              navigate({ name: "lesson", courseId, lessonId: prevLesson.id })
            }
            data-ocid="lesson.link"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!nextLesson}
            onClick={() =>
              nextLesson &&
              navigate({ name: "lesson", courseId, lessonId: nextLesson.id })
            }
            data-ocid="lesson.link"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Mark as complete */}
        {!isCompleted ? (
          <Button
            onClick={handleMarkComplete}
            disabled={markComplete.isPending}
            className="font-semibold text-white"
            style={{ background: "oklch(0.56 0.17 142)" }}
            data-ocid="lesson.primary_button"
          >
            {markComplete.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {markComplete.isPending ? "Saving..." : "Mark as Complete"}
          </Button>
        ) : (
          <div
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "oklch(0.56 0.17 142)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completed!
          </div>
        )}
      </div>

      {/* Back to course */}
      <div className="mt-6 pt-6 border-t border-border">
        <button
          type="button"
          onClick={() => navigate({ name: "course", courseId })}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="lesson.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {course?.title ?? "Course"}
        </button>
      </div>
    </div>
  );
}
