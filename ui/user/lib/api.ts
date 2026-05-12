import type {
  User,
  OnboardingCategory,
  Assessment,
  AssessmentResult,
  Certificate,
  ContactFormData,
  AssessmentProgress,
  Roles,
  SignupPayload,
  ApiResponse
} from '@/types';

// ── Base API (swap this URL for your real backend) ────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.CareAble.dev';

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

async function fetchWithAuthNoJson(endpoint: string, options: RequestInit = {}) {
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
      body: JSON.stringify({email, password})
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
    return res.data;
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
   const res = await fetchWithAuth(`/onboarding/complete`,{
     
      method: 'POST',
      body: JSON.stringify(data)
    
    });
    return res;
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

  getUserAssessmentProgress: async (): Promise<AssessmentProgress[]> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentProgress[];
    }>('/assessments/progress');
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

  getProgress: async (assessmentId: string): Promise<AssessmentProgress> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentProgress;
    }>(`/assessments/${assessmentId}/progress`);
    return res.data;
  },

  saveProgress: async (
    assessmentId: string,
    payload: {
      answers: Record<string, string>;
      currentTopicIndex: number;
      currentPage: number;
    }
  ) => {
    return fetchWithAuth(`/assessments/${assessmentId}/save-progress`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  submitAssessment: async (assessmentId: string, payload: {
      answers: Record<string, string>;
     
    }): Promise<AssessmentResult> => {
    const res = await fetchWithAuth<{
      success: boolean;
      message: string;
      data: AssessmentResult;
    }>(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  }
};

// ── Certificate API ───────────────────────────────────────────────────────────

export const certificateApi = {
  getCertificate: async (id: string): Promise<Certificate> => {
    await delay(400);
    return {
      id,
      userId: 'u2',
      userName: 'James Okonkwo',
      assessmentId: 'assess1',
      assessmentTitle: 'JavaScript Fundamentals',
      category: 'Technology',
      level: 'Intermediate',
      score: 87,
      issuedAt: new Date().toISOString(),
      verificationCode: `SB-${id.slice(0, 8).toUpperCase()}`,
      issuerName: 'CareAble Academy'
    };
  }
};

// ── Contact API ───────────────────────────────────────────────────────────────

export const contactApi = {
  submit: async (data: ContactFormData) => {
    await delay(1000);
    return { success: true, message: "Message sent! We'll get back to you within 24 hours." };
  }
};

/*
Public Routes (no auth required)
*/

export const roleApi = {
  getRoles: async (): Promise<Roles[]> => {
    const res = await fetchWithAuthNoJson('/roles');
    return res.data;
  }
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
