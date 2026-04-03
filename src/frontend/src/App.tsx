import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CourseDetail from "./pages/CourseDetail";
import CoursesPage from "./pages/CoursesPage";
import Dashboard from "./pages/Dashboard";
import LessonViewer from "./pages/LessonViewer";
import QuizPage from "./pages/QuizPage";

export type Page =
  | { name: "dashboard" }
  | { name: "courses" }
  | { name: "course"; courseId: bigint }
  | { name: "lesson"; courseId: bigint; lessonId: bigint }
  | { name: "quiz"; courseId: bigint; isDaily?: boolean };

export default function App() {
  const [page, setPage] = useState<Page>({ name: "dashboard" });

  const navigate = (p: Page) => setPage(p);

  const renderPage = () => {
    switch (page.name) {
      case "dashboard":
        return <Dashboard navigate={navigate} />;
      case "courses":
        return <CoursesPage navigate={navigate} />;
      case "course":
        return <CourseDetail courseId={page.courseId} navigate={navigate} />;
      case "lesson":
        return (
          <LessonViewer
            courseId={page.courseId}
            lessonId={page.lessonId}
            navigate={navigate}
          />
        );
      case "quiz":
        return (
          <QuizPage
            courseId={page.courseId}
            isDaily={page.isDaily}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={page.name} navigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
