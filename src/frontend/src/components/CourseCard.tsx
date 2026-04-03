import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Clock, Star } from "lucide-react";
import type { Page } from "../App";
import type { Category, Course, Difficulty } from "../backend.d.ts";

const categoryConfig: Record<
  string,
  { color: string; bg: string; image: string }
> = {
  Programming: {
    color: "oklch(0.5 0.22 285)",
    bg: "oklch(0.9 0.06 285)",
    image: "/assets/generated/course-programming.dim_800x450.jpg",
  },
  Design: {
    color: "oklch(0.65 0.13 192)",
    bg: "oklch(0.85 0.08 192)",
    image: "/assets/generated/course-design.dim_800x450.jpg",
  },
  Business: {
    color: "oklch(0.56 0.17 142)",
    bg: "oklch(0.88 0.07 142)",
    image: "/assets/generated/course-business.dim_800x450.jpg",
  },
  Science: {
    color: "oklch(0.67 0.19 42)",
    bg: "oklch(0.92 0.06 42)",
    image: "/assets/generated/course-science.dim_800x450.jpg",
  },
};

const difficultyConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  Beginner: {
    label: "Beginner",
    color: "oklch(0.35 0.14 142)",
    bg: "oklch(0.92 0.06 142)",
  },
  Intermediate: {
    label: "Intermediate",
    color: "oklch(0.5 0.15 75)",
    bg: "oklch(0.96 0.06 89)",
  },
  Advanced: {
    label: "Advanced",
    color: "oklch(0.45 0.2 27)",
    bg: "oklch(0.95 0.05 27)",
  },
};

function getCategoryKey(_category: Category | string): string {
  return String(_category);
}

function getDifficultyKey(_difficulty: Difficulty | string): string {
  return String(_difficulty);
}

interface CourseCardProps {
  course: Course;
  progress?: number;
  navigate: (page: Page) => void;
  variant?: "default" | "featured";
}

export default function CourseCard({
  course,
  progress,
  navigate,
  variant = "default",
}: CourseCardProps) {
  const catKey = getCategoryKey(course.category);
  const diffKey = getDifficultyKey(course.difficulty);
  const catCfg = categoryConfig[catKey] || categoryConfig.Programming;
  const diffCfg = difficultyConfig[diffKey] || difficultyConfig.Beginner;
  const durationMins = Number(course.duration);
  const lessonCount = course.lessons?.length ?? 0;

  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col group">
      {/* Thumbnail */}
      <button
        type="button"
        className="relative aspect-video overflow-hidden w-full cursor-pointer"
        onClick={() => navigate({ name: "course", courseId: course.id })}
      >
        <img
          src={catCfg.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category pill */}
        <span
          className="absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: catCfg.color, color: "white" }}
        >
          {catKey}
        </span>
      </button>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {course.title}
        </h3>
        {variant === "featured" && (
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {durationMins}m
          </span>
          <span className="flex items-center gap-1">
            <Star
              className="w-3 h-3 fill-current"
              style={{ color: "oklch(0.82 0.17 89)" }}
            />
            4.8
          </span>
          <span>{lessonCount} lessons</span>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: diffCfg.bg, color: diffCfg.color }}
          >
            {diffCfg.label}
          </span>
        </div>

        {/* Progress if available */}
        {progress !== undefined && progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* CTA */}
        <Button
          size="sm"
          className="w-full mt-1 text-xs font-semibold"
          style={{ background: "oklch(0.245 0.095 248)", color: "white" }}
          onClick={() => navigate({ name: "course", courseId: course.id })}
          data-ocid="course.primary_button"
        >
          {progress !== undefined && progress > 0 ? "Continue" : "Enroll Now"}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </article>
  );
}
