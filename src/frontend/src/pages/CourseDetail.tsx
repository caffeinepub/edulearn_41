import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  useGetCourse,
  useGetUserProgress,
  useMarkLessonComplete,
} from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  Programming: "oklch(0.5 0.22 285)",
  Design: "oklch(0.65 0.13 192)",
  Business: "oklch(0.56 0.17 142)",
  Science: "oklch(0.67 0.19 42)",
};

const categoryImages: Record<string, string> = {
  Programming: "/assets/generated/course-programming.dim_800x450.jpg",
  Design: "/assets/generated/course-design.dim_800x450.jpg",
  Business: "/assets/generated/course-business.dim_800x450.jpg",
  Science: "/assets/generated/course-science.dim_800x450.jpg",
};

interface CourseDetailProps {
  courseId: bigint;
  navigate: (page: Page) => void;
}

export default function CourseDetail({
  courseId,
  navigate,
}: CourseDetailProps) {
  const { data: course, isLoading } = useGetCourse(courseId);
  const { data: progress } = useGetUserProgress();
  const markComplete = useMarkLessonComplete();

  const completedSet = new Set(
    (progress?.completedLessons ?? []).map((id) => id.toString()),
  );

  if (isLoading) {
    return (
      <div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-4"
        data-ocid="course.loading_state"
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16 text-center"
        data-ocid="course.error_state"
      >
        <p className="text-muted-foreground">Course not found.</p>
        <Button onClick={() => navigate({ name: "courses" })} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  const catKey = String(course.category);
  const catColor = categoryColors[catKey] ?? "oklch(0.245 0.095 248)";
  const catImage = categoryImages[catKey] ?? categoryImages.Programming;
  const durationMins = Number(course.duration);
  const lessons = course.lessons ?? [];
  const completedCount = lessons.filter((l) =>
    completedSet.has(l.id.toString()),
  ).length;
  const totalProgress =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  const handleMarkComplete = async (lessonId: bigint) => {
    try {
      await markComplete.mutateAsync({ courseId, lessonId });
      toast.success("Lesson marked as complete!");
    } catch {
      toast.error("Failed to mark lesson complete");
    }
  };

  return (
    <div
      className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="course.section"
    >
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate({ name: "courses" })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="course.link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden aspect-video shadow-card"
          >
            <img
              src={catImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Title & meta */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: catColor }}
              >
                {catKey}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background:
                    String(course.difficulty) === "Beginner"
                      ? "oklch(0.92 0.06 142)"
                      : String(course.difficulty) === "Advanced"
                        ? "oklch(0.95 0.05 27)"
                        : "oklch(0.96 0.06 89)",
                  color:
                    String(course.difficulty) === "Beginner"
                      ? "oklch(0.35 0.14 142)"
                      : String(course.difficulty) === "Advanced"
                        ? "oklch(0.45 0.2 27)"
                        : "oklch(0.5 0.15 75)",
                }}
              >
                {String(course.difficulty)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {durationMins} min
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {course.description}
            </p>
          </motion.div>

          {/* Lessons list */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border shadow-card"
          >
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-foreground">
                  Course Content
                </h2>
                <span className="text-xs text-muted-foreground">
                  {completedCount}/{lessons.length} completed
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalProgress}%`,
                    background: catColor,
                  }}
                />
              </div>
            </div>
            <ul className="divide-y divide-border">
              {lessons.length === 0 ? (
                <li
                  className="px-5 py-4 text-sm text-muted-foreground"
                  data-ocid="lessons.empty_state"
                >
                  No lessons available.
                </li>
              ) : (
                lessons.map((lesson, idx) => {
                  const done = completedSet.has(lesson.id.toString());
                  return (
                    <li
                      key={lesson.id.toString()}
                      className="px-5 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                      data-ocid={`lessons.item.${idx + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() => !done && handleMarkComplete(lesson.id)}
                        className="shrink-0 transition-colors"
                        aria-label={done ? "Completed" : "Mark complete"}
                        data-ocid={`lessons.checkbox.${idx + 1}`}
                      >
                        {done ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: catColor }}
                          />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="flex-1 text-left"
                        onClick={() =>
                          navigate({
                            name: "lesson",
                            courseId,
                            lessonId: lesson.id,
                          })
                        }
                        data-ocid={`lessons.link.${idx + 1}`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            done
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {idx + 1}. {lesson.title}
                        </span>
                      </button>
                      <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-5"
        >
          {/* Stats card */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground">
              Course Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Lessons
                </span>
                <span className="font-semibold text-foreground">
                  {lessons.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Duration
                </span>
                <span className="font-semibold text-foreground">
                  {durationMins} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Level
                </span>
                <span className="font-semibold text-foreground">
                  {String(course.difficulty)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
                <span className="font-semibold text-foreground">
                  {completedCount}/{lessons.length}
                </span>
              </div>
            </div>
          </div>

          {/* Start Quiz CTA */}
          <Button
            className="w-full font-semibold py-5 rounded-xl text-white"
            style={{ background: "oklch(0.245 0.095 248)" }}
            onClick={() => navigate({ name: "quiz", courseId })}
            data-ocid="course.primary_button"
          >
            <Award className="w-4 h-4 mr-2" />
            Start Quiz
          </Button>

          {/* Jump to lesson buttons */}
          {lessons.length > 0 && (
            <Button
              variant="outline"
              className="w-full font-semibold py-5 rounded-xl"
              onClick={() =>
                navigate({ name: "lesson", courseId, lessonId: lessons[0].id })
              }
              data-ocid="course.secondary_button"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
