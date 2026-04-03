import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Course, Lesson, Quiz, UserProgressView } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetCourses() {
  const { actor, isFetching } = useActor();
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourse(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Course | null>({
    queryKey: ["course", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getCourse(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetLessons(courseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson[]>({
    queryKey: ["lessons", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return [];
      return actor.getLessons(courseId);
    },
    enabled: !!actor && !isFetching && courseId !== null,
  });
}

export function useGetQuiz(courseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Quiz | null>({
    queryKey: ["quiz", courseId?.toString()],
    queryFn: async () => {
      if (!actor || courseId === null) return null;
      return actor.getQuiz(courseId);
    },
    enabled: !!actor && !isFetching && courseId !== null,
  });
}

export function useGetUserProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProgressView | null>({
    queryKey: ["userProgress"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProgress(Principal.anonymous());
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDailyChallenge() {
  const { actor, isFetching } = useActor();
  return useQuery<Quiz | null>({
    queryKey: ["dailyChallenge"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyChallenge();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkLessonComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
    }: { courseId: bigint; lessonId: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.markLessonComplete(courseId, lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });
}

export function useSubmitQuizAnswers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      answers,
    }: { courseId: bigint; answers: bigint[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitQuizAnswers(courseId, answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });
}
