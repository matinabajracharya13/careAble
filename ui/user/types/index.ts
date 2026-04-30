// ── Auth & User ─────────────────────────────────────────────────────────────

export type UserRole = "employer" | "career";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  onboardingCompleted: boolean;
  skills?: string[];
  company?: string;       // employer only
  jobTitle?: string;      // career only
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ── Onboarding ───────────────────────────────────────────────────────────────

export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "range";

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

export type AssessmentStatus = "not_started" | "in_progress" | "completed" | "failed";


export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;

  // optional now (since self-assessment may not need them)
  level?: "beginner" | "intermediate" | "advanced";
  duration?: number | null;        // optional / not required
  passingScore?: number | null;    // optional / not used

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

  type?: "slider"; // for now only slider (future-proof)

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
  timeSpent: number;       // seconds
  certificateId?: string;
}

// ── Certificate ──────────────────────────────────────────────────────────────

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  assessmentId: string;
  assessmentTitle: string;
  category: string;
  level: string;
  score: number;
  issuedAt: string;
  expiresAt?: string;
  verificationCode: string;
  issuerName: string;
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
  tier: "platinum" | "gold" | "silver";
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

export type ColorTheme = "cobalt" | "emerald" | "violet" | "rose" | "amber" | "slate";

export interface ThemeConfig {
  name: string;
  value: ColorTheme;
  primaryColor: string;
  description: string;
}
