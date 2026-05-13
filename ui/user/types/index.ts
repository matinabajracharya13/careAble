// ── Auth & User ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  onboarding_completed: boolean;
  skills?: string[];
  company?: string; // employer only
  jobTitle?: string; // career only
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Onboarding ───────────────────────────────────────────────────────────────

export type QuestionType = 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'range';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface OnboardingQuestion {
  id: string;
  category: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  min?: number;
  max?: number;
}

export interface OnboardingCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: OnboardingQuestion[];
}

export interface OnboardingResponse {
  questionId: string;
  answer: string | string[] | number;
}

// ── Assessment ───────────────────────────────────────────────────────────────

export type AssessmentStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface Assessment {
  title: string;
  description: string;
  category: string;
  assessment_id: number;
  domain: string;

  totalQuestions: number;

  // NEW: topic-based structure
  topics: AssessmentTopic[];
}

export interface AssessmentTopic {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;

  type: 'slider'; // for now only slider (future-proof)
  options: {
    id: number;
    label: string;
    value: number;
  }[];
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  score: number;
  passed: boolean;
  answers: { questionId: string; selectedAnswer: string; correct: boolean }[];
  completedAt: string;
  timeSpent: number; // seconds
  certificateId?: string;
}

// ── Contact Form ─────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

// ── Partners ─────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: 'platinum' | 'gold' | 'silver';
}

// ── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ── Theme ─────────────────────────────────────────────────────────────────────

export type ColorTheme = 'cobalt' | 'emerald' | 'violet' | 'rose' | 'amber' | 'slate';

export interface ThemeConfig {
  name: string;
  value: ColorTheme;
  primaryColor: string;
  description: string;
}

export interface AssessmentProgress {
  assessment_id: number;
  progress_id: number;
  answers: string;
  current_topic_index: number;
  current_page: number;
}

export interface Roles {
  id: number;
  role_name: string;
  description: string;
  label: string;
  icon_key: string;
}

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  postcode: string;
  password: string;
  role: string;
  accepted_terms: boolean;
  research_consent: boolean;
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
  issued_at: string; // depends on backend (timestamp or ISO)
  pdf_url: string | null;
  validity_status: 'valid' | 'expired' | string;
  validity_date: string | null;
  title: string;
  description: string;
}

export interface AssessmentSubmissionData {
  attemptId: number;
  assessmentId: number;
  passed: boolean;
  certificate: Certificate | null;
}
