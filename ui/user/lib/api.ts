import type {
  ApiResponse,
  Assessment,
  AssessmentAttempt,
  AssessmentListItem,
  AssessmentProgress,
  AssessmentSubmissionData,
  Candidate,
  Certificate,
  ContactFormData,
  DashboardStats,
  OnboardingCategory,
  Roles,
  SignupPayload,
  User
} from '@/types';

// ── Base API (swap this URL for your real backend) ────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.careable.dev';

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('CareAble_token') : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? 'API error');
  }

  return res.json();
}

async function fetchWithAuthNoJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? 'API error');
  }

  return res.json();
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await fetchWithAuthNoJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return res.data;
  },

  me: async () => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: ApiResponse<User>;
    }>('/auth/me');
    return res.data;
  },

  signup: async (data: SignupPayload) => {
    const res = await fetchWithAuthNoJson('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res?.data;
  }
};

// ── Onboarding API ────────────────────────────────────────────────────────────

export const onboardingApi = {
  getCategories: async (): Promise<OnboardingCategory[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: OnboardingCategory[];
    }>(`/onboarding/questions`);
    return res.data;
  },

  submitResponses: async (data: Record<string, unknown>) => {
    console.log('Submitting onboarding data:', data);
    const res = await fetchWithAuth(`/onboarding/complete`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res;
  }
};

// --- user assessment api---
export const userAssessmentApi = {
  get: async (): Promise<AssessmentListItem[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentListItem[];
    }>('/auth/me/assessments');

    return res.data;
  }
};
// ── Assessment API ────────────────────────────────────────────────────────────

export const assessmentApi = {
  getAssessments: async (): Promise<Assessment[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Assessment[];
    }>('/assessments');

    return res.data;
  },

  startAssessment: async (assessmentId: number): Promise<AssessmentAttempt> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentAttempt;
    }>(`/assessments/${assessmentId}/start`, {
      method: 'POST'
    });

    return res.data;
  },

  getUserAssessmentProgress: async (): Promise<AssessmentProgress[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentProgress[];
    }>('/assessments/attempts');
    return res.data;
  },

  getAssessment: async (id: string): Promise<Assessment> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Assessment;
    }>(`/assessments/${id}`);

    return res.data;
  },

  getProgress: async (assessmentId: string, attemptId: string): Promise<AssessmentProgress> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentProgress;
    }>(`/assessments/${assessmentId}/attempts/${attemptId}/progress`);
    return res.data;
  },

  saveProgress: async (
    assessmentId: string,
    attemptId: string,
    payload: {
      answers: Record<string, { value: number; optionId: number }>;
      currentTopicIndex: number;
      currentPage: number;
    }
  ) => {
    return fetchWithAuth(`/assessments/${assessmentId}/attempts/${attemptId}/save-progress`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  submitAssessment: async (
    assessmentId: string,
    attemptId: string,

    payload: {
      answers: Record<string, { value: number; optionId: number }>;
    }
  ): Promise<AssessmentSubmissionData> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentSubmissionData;
    }>(`/assessments/${assessmentId}/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }
};

// -- Candidates API ---

export const candidatesApi = {
  getAllCandidates: async (): Promise<Candidate[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Candidate[];
    }>(`/candidates`);
    return res.data;
  },
  getCandidateById: async (id: string): Promise<Candidate> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Candidate;
    }>(`/candidates/${id}`);
    return res.data;
  },
  getCandidateHeatmap: async (id: string) => {
  const res = await fetchWithAuth<{
    success: boolean;
    message: string;
    data: any[];
  }>(`/candidates/${id}/heatmap`);

  return res.data;
},
};
// ── Certificate API ───────────────────────────────────────────────────────────

export const certificateApi = {
  getCertificate: async (): Promise<Certificate[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Certificate[];
    }>(`/certificates`);
    return res.data;
  },
  getCertificateByCode: async (code: string): Promise<Certificate> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Certificate;
    }>(`/certificates/${code}`);
    return res.data;
  },
  verifyCertificate: async (code: string): Promise<Certificate> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: Certificate;
    }>(`/certificates/verify/${code}`);
    return res.data;
  }
};

// ── Contact API ───────────────────────────────────────────────────────────────

export const contactApi = {
  submit: async (data: ContactFormData) => {
    const res = await fetchWithAuthNoJson<{
      success: boolean;
      message: string;
    }>(`/contacts`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res;
  }
};

/*
Public Routes (no auth required)
*/

export const roleApi = {
  getRoles: async (): Promise<Roles[]> => {
    const res = await fetchWithAuthNoJson('/roles');
    return res?.data;
  }
};

export const statsApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: DashboardStats;
    }>('/stats');
    return res.data;
  }
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
