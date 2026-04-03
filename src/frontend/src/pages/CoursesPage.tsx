import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import CourseCard from "../components/CourseCard";
import { useGetCourses } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Programming",
  "Design",
  "Business",
  "Science",
] as const;

interface CoursesPageProps {
  navigate: (page: Page) => void;
}

export default function CoursesPage({ navigate }: CoursesPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses, isLoading } = useGetCourses();

  const filtered = (courses ?? []).filter((c) => {
    const catMatch =
      activeCategory === "All" || String(c.category) === activeCategory;
    const searchMatch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        data-ocid="courses.section"
      >
        <h1 className="font-display font-bold text-3xl text-foreground mb-2">
          Explore Courses
        </h1>
        <p className="text-muted-foreground text-sm">
          Discover {courses?.length ?? 0}+ courses to level up your skills
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-ocid="courses.search_input"
          />
        </div>

        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          data-ocid="courses.tab"
        >
          <TabsList className="h-9">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs px-3"
                data-ocid="courses.tab"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton
              key={i}
              className="h-72 w-full rounded-xl"
              data-ocid="courses.loading_state"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="courses.empty_state"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-display font-semibold text-foreground text-lg mb-1">
            No courses found
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : "No courses in this category yet."}
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {filtered.map((course) => (
            <motion.div
              key={course.id.toString()}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CourseCard course={course} navigate={navigate} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
