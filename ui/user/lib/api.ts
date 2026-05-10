import type {
  User,
  OnboardingCategory,
  Assessment,
  AssessmentResult,
  Certificate,
  ContactFormData,
  AssessmentProgress,
  Roles
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
    // MOCK: replace with real call
    await delay(800);
    const users: Record<string, { token: string; user: User }> = {
      'employer@demo.com': {
        token: 'mock-token-employer',
        user: {
          id: 'u1',
          email: 'employer@demo.com',
          name: 'Sarah Chen',
          role: 'employer',
          company: 'TechCorp Inc.',
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        }
      },
      'career@demo.com': {
        token: 'mock-token-career',
        user: {
          id: 'u2',
          email: 'career@demo.com',
          name: 'James Okonkwo',
          role: 'career',
          jobTitle: 'Software Engineer',
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        }
      }
    };
    const match = users[email];
    if (!match || password !== 'demo123') throw new Error('Invalid email or password. Try employer@demo.com / demo123');
    return match;
  },

  signup: async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await fetchWithAuthNoJson('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  }
};

// ── Onboarding API ────────────────────────────────────────────────────────────

export const onboardingApi = {
  getCategories: async (role: 'employer' | 'career'): Promise<OnboardingCategory[]> => {
    await delay(600);
    const careerCategories: OnboardingCategory[] = [
      {
        id: 'cat1',
        title: 'Professional Background',
        description: 'Tell us about your work experience',
        icon: 'Briefcase',
        questions: [
          {
            id: 'q1',
            category: 'cat1',
            question: 'What is your current job title?',
            type: 'text',
            placeholder: 'e.g. Software Engineer',
            required: true
          },
          {
            id: 'q2',
            category: 'cat1',
            question: 'Years of professional experience?',
            type: 'radio',
            options: [
              { label: '0-1 years', value: '0-1' },
              { label: '2-5 years', value: '2-5' },
              { label: '5-10 years', value: '5-10' },
              { label: '10+ years', value: '10+' }
            ],
            required: true
          },
          {
            id: 'q3',
            category: 'cat1',
            question: 'Which industry are you in?',
            type: 'select',
            options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Finance', value: 'finance' },
              { label: 'Healthcare', value: 'healthcare' },
              { label: 'Education', value: 'education' },
              { label: 'Other', value: 'other' }
            ],
            required: true
          }
        ]
      },
      {
        id: 'cat2',
        title: 'Skills & Expertise',
        description: 'What are your core competencies?',
        icon: 'Zap',
        questions: [
          {
            id: 'q4',
            category: 'cat2',
            question: 'Select your primary skills (choose all that apply)',
            type: 'multiselect',
            options: [
              { label: 'JavaScript', value: 'js' },
              { label: 'Python', value: 'python' },
              { label: 'Data Analysis', value: 'data' },
              { label: 'Project Management', value: 'pm' },
              { label: 'Design', value: 'design' },
              { label: 'Marketing', value: 'marketing' }
            ],
            required: true
          },
          {
            id: 'q5',
            category: 'cat2',
            question: 'How would you rate your overall technical proficiency?',
            type: 'range',
            min: 1,
            max: 10,
            required: true
          }
        ]
      },
      {
        id: 'cat3',
        title: 'Career Goals',
        description: 'What are you looking to achieve?',
        icon: 'Target',
        questions: [
          {
            id: 'q6',
            category: 'cat3',
            question: 'What is your primary career goal?',
            type: 'radio',
            options: [
              { label: 'Get a new job', value: 'new_job' },
              { label: 'Get promoted', value: 'promotion' },
              { label: 'Switch industries', value: 'switch' },
              { label: 'Start a business', value: 'business' },
              { label: 'Improve skills', value: 'skills' }
            ],
            required: true
          },
          {
            id: 'q7',
            category: 'cat3',
            question: 'Tell us about your dream role',
            type: 'textarea',
            placeholder: 'Describe your ideal position, company culture, and what success means to you...',
            required: false
          }
        ]
      }
    ];

    const employerCategories: OnboardingCategory[] = [
      {
        id: 'ecat1',
        title: 'Company Information',
        description: 'Tell us about your organisation',
        icon: 'Building2',
        questions: [
          { id: 'eq1', category: 'ecat1', question: 'Company name', type: 'text', placeholder: 'e.g. Acme Corp', required: true },
          {
            id: 'eq2',
            category: 'ecat1',
            question: 'Company size',
            type: 'radio',
            options: [
              { label: '1-10', value: 'micro' },
              { label: '11-50', value: 'small' },
              { label: '51-200', value: 'medium' },
              { label: '201-1000', value: 'large' },
              { label: '1000+', value: 'enterprise' }
            ],
            required: true
          },
          {
            id: 'eq3',
            category: 'ecat1',
            question: 'Industry',
            type: 'select',
            options: [
              { label: 'Technology', value: 'tech' },
              { label: 'Finance', value: 'finance' },
              { label: 'Healthcare', value: 'healthcare' },
              { label: 'Retail', value: 'retail' },
              { label: 'Manufacturing', value: 'manufacturing' }
            ],
            required: true
          }
        ]
      },
      {
        id: 'ecat2',
        title: 'Hiring Needs',
        description: 'What kind of talent are you looking for?',
        icon: 'Users',
        questions: [
          {
            id: 'eq4',
            category: 'ecat2',
            question: 'What roles are you most commonly hiring for?',
            type: 'multiselect',
            options: [
              { label: 'Software Developers', value: 'dev' },
              { label: 'Data Scientists', value: 'ds' },
              { label: 'Product Managers', value: 'pm' },
              { label: 'Designers', value: 'design' },
              { label: 'Sales', value: 'sales' },
              { label: 'Operations', value: 'ops' }
            ],
            required: true
          },
          {
            id: 'eq5',
            category: 'ecat2',
            question: 'How many hires are you expecting in the next 6 months?',
            type: 'radio',
            options: [
              { label: '1-5', value: '1-5' },
              { label: '6-20', value: '6-20' },
              { label: '21-50', value: '21-50' },
              { label: '50+', value: '50+' }
            ],
            required: true
          }
        ]
      }
    ];

    return role === 'employer' ? employerCategories : careerCategories;
  },

  submitResponses: async (responses: Record<string, unknown>) => {
    await delay(800);
    return { success: true };
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

  submitAssessment: async (assessmentId: string, answers: Record<string, string>): Promise<AssessmentResult> => {
    await delay(1200);
    // const assessment = MOCK_ASSESSMENTS;
    // if (!assessment) throw new Error('Assessment not found');

    // // Calculate score
    const score = 100;
    // // const answerDetails: AssessmentResult["answers"] = assessment.topics.map((q) => {
    // //   const selected = answers[q.id] ?? "";
    // //   const isCorrect = selected === q.correctAnswer;
    // //   if (isCorrect) correct++;
    // //   return { questionId: q.id, selectedAnswer: selected, correct: isCorrect };
    // // });

    // // const score = Math.round((correct / assessment.questions.length) * 100);
    // // const passed = score >= assessment.passingScore;
    const passed = true;
    const result: AssessmentResult = {
      assessmentId,
      userId: 'current-user',
      score,
      passed,
      answers: [],
      completedAt: new Date().toISOString(),
      timeSpent: 1200,
      certificateId: passed ? `cert-${Date.now()}` : undefined
    };

    return result;
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
