import { get, post } from '@/lib/api';
import { CreateCategoryFormValues, CreateQuestionFormValues } from '@/lib/validations';

import { ApiResponse, PaginatedResponse, type PaginationParams } from '@/types';

import { useMutation, useQuery } from '@tanstack/react-query';

/* =========================================================
   QUERY KEYS
========================================================= */

export const onboardingKeys = {
  all: ['onboarding'] as const,

  categories: () => [...onboardingKeys.all, 'categories'] as const,
  categoryList: (params: PaginationParams) => [...onboardingKeys.categories(), params] as const,

  questions: () => [...onboardingKeys.all, 'questions'] as const,
  questionList: (category_id: number) => [...onboardingKeys.questions(), { category_id }] as const
};

/* =========================================================
   CATEGORIES
========================================================= */

export function useOnboardingCategories(params: PaginationParams = {}) {
  return useQuery({
    queryKey: onboardingKeys.categoryList(params),
    queryFn: () => get<PaginatedResponse<any>>('/admin/onboarding/categories', params as Record<string, unknown>)
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: (data: CreateCategoryFormValues) => post<ApiResponse>('/admin/onboarding/categories', data)
  });
}

/* =========================================================
   QUESTIONS
========================================================= */

export function useOnboardingQuestions(category_id: number) {
  return useQuery({
    queryKey: onboardingKeys.questionList(category_id),
    queryFn: () => get<PaginatedResponse<any>>(`/admin/onboarding/questions/${category_id}`)
  });
}

export function useCreateQuestion() {
  return useMutation({
    mutationFn: (data: CreateQuestionFormValues) => post<ApiResponse>('/admin/onboarding/questions', data)
  });
}
