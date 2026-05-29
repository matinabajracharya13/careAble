// hooks/use-assessment.ts

import { useMutation, useQuery } from '@tanstack/react-query';

import { get, post, put } from '@/lib/api';
import { CreateAssessmentFormValues } from '@/lib/validations';

// ======================================================
// TYPES
// ======================================================

export interface AssessmentTopic {
  assessment_topic_id: number;
  assessment_id: number;
  title: string;
  code?: string;
  display_order?: number;
}

export interface AssessmentQuestionOption {
  assessment_question_options_id: number;
  assessment_question_id: number;
  option_label: string;
  option_value: string;
  score_value: number;
}

export interface AssessmentQuestion {
  assessment_question_id: number;
  assessment_id: number;
  assessment_topic_id: number;

  question_text: string;

  question_type: string;
  input_type: string;

  is_required: boolean;

  is_reverse_scored: boolean;

  weight: number;

  helper_text?: string;

  display_order?: number;

  options: AssessmentQuestionOption[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ======================================================
// QUERY KEYS
// ======================================================

export const assessmentKeys = {
  all: ['assessment'] as const,
  lists: () => [...assessmentKeys.all, 'lists'] as const,

  topics: () => [...assessmentKeys.all, 'topics'] as const,

  topic: (assessmentId: number) => [...assessmentKeys.topics(), assessmentId] as const,

  questions: () => [...assessmentKeys.all, 'questions'] as const,

  question: (topicId: number) => [...assessmentKeys.questions(), topicId] as const
};

export function useAssessments() {
  return useQuery({
    queryKey: assessmentKeys.lists(),

    queryFn: () => get<ApiResponse<AssessmentTopic[]>>(`/admin/assessments`)
  });
}

export function useCreateAssessment() {
  return useMutation({
    mutationFn: (data: Partial<CreateAssessmentFormValues>) => post<ApiResponse>('/admin/assessments', data)
  });
}

// ======================================================
// TOPICS
// ======================================================

export function useAssessmentTopics(assessmentId?: number) {
  return useQuery({
    queryKey: assessmentKeys.topic(assessmentId || 0),

    queryFn: () => get<ApiResponse<AssessmentTopic[]>>(`/admin/assessments/${assessmentId}/topics`),

    enabled: !!assessmentId
  });
}

// ======================================================
// QUESTIONS
// ======================================================

export function useAssessmentQuestions(topicId?: number) {
  return useQuery({
    queryKey: assessmentKeys.question(topicId || 0),

    queryFn: () => get<ApiResponse<AssessmentQuestion[]>>(`/admin/assessments/topics/${topicId}/questions`),

    enabled: !!topicId
  });
}

// ======================================================
// CREATE TOPIC
// ======================================================

export function useCreateAssessmentTopic() {
  return useMutation({
    mutationFn: (data: Partial<AssessmentTopic>) => post<ApiResponse>(`/admin/assessments/${data.assessment_id}/topics`, data)
  });
}

// ======================================================
// UPDATE TOPIC
// ======================================================

export function useUpdateAssessmentTopic() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AssessmentTopic> }) => put<ApiResponse>(`/admin/assessment-topics/${id}`, data)
  });
}

// ======================================================
// DELETE TOPIC
// ======================================================

// export function useDeleteAssessmentTopic() {
//   return useMutation({
//     mutationFn: (id: number) => remove<ApiResponse>(`/admin/assessment-topics/${id}`)
//   });
// }

// ======================================================
// CREATE QUESTION
// ======================================================

export function useCreateAssessmentQuestion() {
  return useMutation({
    mutationFn: (data: Partial<AssessmentQuestion>) => post<ApiResponse>('/admin/assessment-questions', data)
  });
}

// ======================================================
// UPDATE QUESTION
// ======================================================

export function useUpdateAssessmentQuestion() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AssessmentQuestion> }) =>
      put<ApiResponse>(`/admin/assessment-questions/${id}`, data)
  });
}

// ======================================================
// DELETE QUESTION
// ======================================================

// export function useDeleteAssessmentQuestion() {
//   return useMutation({
//     mutationFn: (id: number) => remove<ApiResponse>(`/admin/assessment-questions/${id}`)
//   });
// }
