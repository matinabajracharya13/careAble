// ── Auth & User ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  onboardingCompleted: boolean;
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

  type?: 'slider'; // for now only slider (future-proof)

  // slider config (flexible for reuse)
  scale?: {
    min: number; // 1
    max: number; // 5
    labels: Record<number, string>;
  };
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

// ── Certificate ──────────────────────────────────────────────────────────────

export interface CertificateDomain {
  name: string;
  score: number;
  capabilityLevel: 'Strength area' | 'Growth area' | 'Support area';
}

export interface Certificate {
  id: string;
  userName: string;
  email: string;
  assessmentTitle: string;
  category: string;
  issuedAt: string;
  verificationCode: string;
  issuerName: string;
  domains: CertificateDomain[];
  topAreas: { name: string; score: number }[];
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
