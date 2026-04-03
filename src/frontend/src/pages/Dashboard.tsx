import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Flame,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import CourseCard from "../components/CourseCard";
import {
  useGetCourses,
  useGetDailyChallenge,
  useGetUserProgress,
} from "../hooks/useQueries";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STREAK_DOTS = [0, 1, 2, 3, 4, 5, 6];

interface DashboardProps {
  navigate: (page: Page) => void;
}

export default function Dashboard({ navigate }: DashboardProps) {
  const { data: courses, isLoading: coursesLoading } = useGetCourses();
  const { data: progress } = useGetUserProgress();
  const { data: dailyChallenge } = useGetDailyChallenge();

  const streak = Number(progress?.learningStreak ?? 0);
  const completedLessons = progress?.completedLessons?.length ?? 0;

  // Weekly activity: [dayIndex, count] pairs
  const weeklyActivity = progress?.weeklyActivity ?? [];
  const maxActivity = Math.max(...weeklyActivity.map(([, v]) => Number(v)), 1);

  // Build bar data for all 7 days
  const barData = DAYS.map((day, i) => {
    const found = weeklyActivity.find(([d]) => Number(d) === i);
    return { day, value: found ? Number(found[1]) : 0 };
  });

  // Recent courses (first 3)
  const recentCourses = (courses ?? []).slice(0, 3);
  const featuredCourses = (courses ?? []).slice(0, 6);

  // Upcoming quizzes (first 3 courses with quizzes)
  const upcomingQuizzes = (courses ?? []).slice(0, 3);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.245 0.095 248) 0%, oklch(0.35 0.12 260) 60%, oklch(0.45 0.15 280) 100%)",
        }}
        data-ocid="dashboard.panel"
      >
        <div className="px-8 py-10 relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">
            Welcome back 👋
          </p>
          <h1 className="text-white font-display font-bold text-3xl sm:text-4xl mb-2">
            Ready to learn today?
          </h1>
          <p className="text-white/60 text-sm mb-6 max-w-md">
            You have completed {completedLessons} lessons so far. Keep going!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate({ name: "courses" })}
              className="bg-white font-semibold rounded-full px-6 hover:bg-white/90 transition-colors"
              style={{ color: "oklch(0.245 0.095 248)" }}
              data-ocid="dashboard.primary_button"
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Start
            </Button>
            {dailyChallenge && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    name: "quiz",
                    courseId: BigInt(0),
                    isDaily: true,
                  })
                }
                className="border-white/40 text-white hover:bg-white/10 rounded-full px-6"
                data-ocid="dashboard.secondary_button"
              >
                <Flame className="w-4 h-4 mr-2" />
                Daily Challenge
              </Button>
            )}
          </div>
        </div>
        {/* Decorative circles */}
        <div
          className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: "oklch(0.65 0.13 192)" }}
        />
        <div
          className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: "oklch(0.82 0.17 89)" }}
        />
      </motion.div>

      {/* Progress section */}
      <section aria-labelledby="progress-heading">
        <h2
          id="progress-heading"
          className="font-display font-semibold text-foreground text-xl mb-4"
        >
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border shadow-card p-5"
            data-ocid="dashboard.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen
                className="w-4 h-4"
                style={{ color: "oklch(0.245 0.095 248)" }}
              />
              <h3 className="font-semibold text-sm text-foreground">
                Recent Courses
              </h3>
            </div>
            {coursesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : recentCourses.length === 0 ? (
              <p
                className="text-muted-foreground text-xs"
                data-ocid="dashboard.empty_state"
              >
                No courses yet. Start exploring!
              </p>
            ) : (
              <ul className="space-y-3">
                {recentCourses.map((course, idx) => {
                  const p = idx === 0 ? 65 : idx === 1 ? 30 : 10;
                  return (
                    <li
                      key={course.id.toString()}
                      className="space-y-1 cursor-pointer"
                      onClick={() =>
                        navigate({ name: "course", courseId: course.id })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          navigate({ name: "course", courseId: course.id });
                      }}
                      data-ocid={`dashboard.item.${idx + 1}`}
                    >
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-foreground line-clamp-1 max-w-[70%]">
                          {course.title}
                        </span>
                        <span className="text-muted-foreground">{p}%</span>
                      </div>
                      <Progress value={p} className="h-1.5" />
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>

          {/* Weekly Activity Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl border border-border shadow-card p-5"
            data-ocid="dashboard.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp
                className="w-4 h-4"
                style={{ color: "oklch(0.65 0.13 192)" }}
              />
              <h3 className="font-semibold text-sm text-foreground">
                Weekly Activity
              </h3>
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {barData.map(({ day, value }, i) => {
                const heightPct =
                  maxActivity > 0 ? (value / maxActivity) * 100 : 0;
                const isToday = i === new Date().getDay() - 1;
                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full flex-1 flex items-end rounded-sm overflow-hidden">
                      <div
                        className="w-full rounded-t-sm transition-all duration-500"
                        style={{
                          height: `${Math.max(heightPct, 4)}%`,
                          background: isToday
                            ? "oklch(0.65 0.13 192)"
                            : value > 0
                              ? "oklch(0.75 0.08 248)"
                              : "oklch(0.93 0.01 248)",
                          minHeight: "4px",
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs ${
                        isToday ? "font-bold" : "text-muted-foreground"
                      }`}
                      style={
                        isToday ? { color: "oklch(0.65 0.13 192)" } : undefined
                      }
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {weeklyActivity.reduce((sum, [, v]) => sum + Number(v), 0)}{" "}
              lessons this week
            </p>
          </motion.div>

          {/* Learning Streak */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border shadow-card p-5 flex flex-col items-center justify-center"
            data-ocid="dashboard.card"
          >
            <div className="flex items-center gap-2 mb-4 w-full">
              <Flame
                className="w-4 h-4"
                style={{ color: "oklch(0.67 0.19 42)" }}
              />
              <h3 className="font-semibold text-sm text-foreground">
                Learning Streak
              </h3>
            </div>
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center mb-3"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.97 0.03 42) 0%, oklch(0.93 0.05 42) 100%)",
                boxShadow:
                  "0 0 0 4px oklch(0.88 0.08 42), 0 0 0 8px oklch(0.94 0.04 42)",
              }}
            >
              <div className="text-center">
                <div
                  className="font-display font-bold text-4xl leading-none"
                  style={{ color: "oklch(0.55 0.18 42)" }}
                >
                  {streak}
                </div>
                <div
                  className="text-xs font-medium mt-0.5"
                  style={{ color: "oklch(0.55 0.18 42)" }}
                >
                  Day Streak
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {STREAK_DOTS.map((dotIdx) => (
                <div
                  key={dotIdx}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background:
                      dotIdx < streak % 7
                        ? "oklch(0.67 0.19 42)"
                        : "oklch(0.93 0.02 248)",
                    color:
                      dotIdx < streak % 7 ? "white" : "oklch(0.7 0.02 248)",
                  }}
                >
                  <Flame className="w-2.5 h-2.5" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Featured Courses */}
        <section className="lg:col-span-3" aria-labelledby="featured-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="featured-heading"
              className="font-display font-semibold text-foreground text-xl"
            >
              Explore Featured Courses
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ name: "courses" })}
              className="text-sm font-medium"
              style={{ color: "oklch(0.245 0.095 248)" }}
              data-ocid="dashboard.link"
            >
              View all
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          {coursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : featuredCourses.length === 0 ? (
            <div
              className="bg-card rounded-xl border border-border p-8 text-center"
              data-ocid="featured.empty_state"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                No courses available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id.toString()}
                  course={course}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right: Practice & Assessments */}
        <section
          className="lg:col-span-2 space-y-6"
          aria-labelledby="practice-heading"
        >
          <h2
            id="practice-heading"
            className="font-display font-semibold text-foreground text-xl"
          >
            Practice &amp; Assessments
          </h2>

          {/* Daily Challenge Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.13 192) 0%, oklch(0.5 0.18 248) 100%)",
            }}
            data-ocid="daily-challenge.card"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-white/80 text-xs font-medium uppercase tracking-wide">
                  Daily Challenge
                </span>
              </div>
              <h3 className="text-white font-display font-bold text-lg mb-1">
                Test Your Knowledge!
              </h3>
              <p className="text-white/70 text-xs mb-4">
                Complete today's challenge to keep your streak alive.
              </p>
              <Button
                size="sm"
                className="bg-white font-semibold text-xs px-4 rounded-full hover:bg-white/90"
                style={{ color: "oklch(0.5 0.18 248)" }}
                onClick={() =>
                  navigate({ name: "quiz", courseId: BigInt(0), isDaily: true })
                }
                data-ocid="daily-challenge.primary_button"
              >
                Start Challenge
              </Button>
            </div>
            <div
              className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-20"
              style={{ background: "oklch(0.82 0.17 89)" }}
            />
          </motion.div>

          {/* Upcoming Quizzes */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card rounded-xl border border-border shadow-card p-5"
            data-ocid="quizzes.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar
                className="w-4 h-4"
                style={{ color: "oklch(0.5 0.22 285)" }}
              />
              <h3 className="font-semibold text-sm text-foreground">
                Upcoming Quizzes
              </h3>
            </div>
            {coursesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : upcomingQuizzes.length === 0 ? (
              <p
                className="text-muted-foreground text-xs"
                data-ocid="quizzes.empty_state"
              >
                No quizzes scheduled.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcomingQuizzes.map((course, idx) => (
                  <li
                    key={course.id.toString()}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate({ name: "quiz", courseId: course.id })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        navigate({ name: "quiz", courseId: course.id });
                    }}
                    data-ocid={`quizzes.item.${idx + 1}`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.quiz?.questions?.length ?? 0} questions
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-3 shrink-0"
                      style={{ color: "oklch(0.5 0.22 285)" }}
                      data-ocid={`quizzes.secondary_button.${idx + 1}`}
                    >
                      Take Quiz
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
