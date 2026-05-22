import 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Roles {
  id: number;
  role_name: string;
  description: string;
  label: string;
  icon_key: string;
}

export interface OnboardingAnswer {
  question_id: number;
  answer: string | string[] | boolean | number | null;
}

export interface AssessmentAttempt {
  assessment_id: number;
  attempt_id: number;
  user_id: number;
  started_at: string;
  submitted: string | null;
  status: 'in_progress' | 'completed' | 'not_started';
}

export interface Certificate {
  certificate_id: number;
  certificate_code: string;
  attempt_id: number;
  issued_at: number | string; // depends on backend (timestamp or ISO)
  pdf_url: string | null;
  validity_status: 'valid' | 'expired' | string;
  validity_date: string | null;
  title: string;
  description: string;
}

export interface CandidateProfile {
  user_id: number;
  name: string;
  email: string;
  postcode: string;
  role: string;
  is_active: boolean;
  created_at: string;

  latest_attempt?: {
    attempt_id: number;
    assessment_id: number;
    assessment_title: string;
    submitted_at: string;
    score: number;
  };

  certificates: {
    certificate_code: string;
    issued_at: string;
  }[];

  onboarding_answers: Record<string, any>;
}
