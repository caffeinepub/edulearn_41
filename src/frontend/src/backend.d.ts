import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CourseInput {
    title: string;
    duration: bigint;
    difficulty: Difficulty;
    quiz: Quiz;
    description: string;
    lessons: Array<Lesson>;
    category: Category;
}
export interface Course {
    id: CourseId;
    title: string;
    duration: bigint;
    difficulty: Difficulty;
    quiz: Quiz;
    description: string;
    lessons: Array<Lesson>;
    category: Category;
}
export type Time = bigint;
export interface Lesson {
    id: LessonId;
    title: string;
    content: string;
}
export type LessonId = bigint;
export interface UserProgressView {
    quizScores: Array<[bigint, bigint]>;
    lastActiveDay: Time;
    weeklyActivity: Array<[bigint, bigint]>;
    completedLessons: Array<bigint>;
    learningStreak: bigint;
}
export interface Quiz {
    id: QuizId;
    questions: Array<Question>;
}
export type CourseId = bigint;
export interface Question {
    question: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export type QuizId = bigint;
export enum Category {
    Business = "Business",
    Design = "Design",
    Programming = "Programming",
    Science = "Science"
}
export enum Difficulty {
    Beginner = "Beginner",
    Advanced = "Advanced",
    Intermediate = "Intermediate"
}
export interface backendInterface {
    createCourse(courseInput: CourseInput): Promise<void>;
    getCourse(id: CourseId): Promise<Course>;
    getCourses(): Promise<Array<Course>>;
    getDailyChallenge(): Promise<Quiz>;
    getLessons(courseId: CourseId): Promise<Array<Lesson>>;
    getQuiz(courseId: CourseId): Promise<Quiz>;
    getUserProgress(user: Principal): Promise<UserProgressView>;
    markLessonComplete(courseId: CourseId, lessonId: LessonId): Promise<void>;
    submitQuizAnswers(courseId: CourseId, answers: Array<bigint>): Promise<bigint>;
}
