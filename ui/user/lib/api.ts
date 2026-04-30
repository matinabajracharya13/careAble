import type {
  User,
  OnboardingCategory,
  Assessment,
  AssessmentResult,
  Certificate,
  ContactFormData,
} from "@/types";

// ── Base API (swap this URL for your real backend) ────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.CareAble.dev";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("CareAble_token")
      : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "API error");
  }

  return res.json();
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string) => {
    // MOCK: replace with real call
    await delay(800);
    const users: Record<string, { token: string; user: User }> = {
      "employer@demo.com": {
        token: "mock-token-employer",
        user: {
          id: "u1",
          email: "employer@demo.com",
          name: "Sarah Chen",
          role: "employer",
          company: "TechCorp Inc.",
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
        },
      },
      "career@demo.com": {
        token: "mock-token-career",
        user: {
          id: "u2",
          email: "career@demo.com",
          name: "James Okonkwo",
          role: "career",
          jobTitle: "Software Engineer",
          onboardingCompleted: false,
          createdAt: new Date().toISOString(),
        },
      },
    };
    const match = users[email];
    if (!match || password !== "demo123")
      throw new Error("Invalid email or password. Try employer@demo.com / demo123");
    return match;
  },

  signup: async (data: { name: string; email: string; password: string; role: "employer" | "career" }) => {
    await delay(1000);
    const user: User = {
      id: `u${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };
    return { token: `mock-token-${Date.now()}`, user };
  },
};

// ── Onboarding API ────────────────────────────────────────────────────────────

export const onboardingApi = {
  getCategories: async (role: "employer" | "career"): Promise<OnboardingCategory[]> => {
    await delay(600);
    const careerCategories: OnboardingCategory[] = [
      {
        id: "cat1",
        title: "Professional Background",
        description: "Tell us about your work experience",
        icon: "Briefcase",
        questions: [
          { id: "q1", category: "cat1", question: "What is your current job title?", type: "text", placeholder: "e.g. Software Engineer", required: true },
          { id: "q2", category: "cat1", question: "Years of professional experience?", type: "radio", options: [{ label: "0-1 years", value: "0-1" }, { label: "2-5 years", value: "2-5" }, { label: "5-10 years", value: "5-10" }, { label: "10+ years", value: "10+" }], required: true },
          { id: "q3", category: "cat1", question: "Which industry are you in?", type: "select", options: [{ label: "Technology", value: "tech" }, { label: "Finance", value: "finance" }, { label: "Healthcare", value: "healthcare" }, { label: "Education", value: "education" }, { label: "Other", value: "other" }], required: true },
        ],
      },
      {
        id: "cat2",
        title: "Skills & Expertise",
        description: "What are your core competencies?",
        icon: "Zap",
        questions: [
          { id: "q4", category: "cat2", question: "Select your primary skills (choose all that apply)", type: "multiselect", options: [{ label: "JavaScript", value: "js" }, { label: "Python", value: "python" }, { label: "Data Analysis", value: "data" }, { label: "Project Management", value: "pm" }, { label: "Design", value: "design" }, { label: "Marketing", value: "marketing" }], required: true },
          { id: "q5", category: "cat2", question: "How would you rate your overall technical proficiency?", type: "range", min: 1, max: 10, required: true },
        ],
      },
      {
        id: "cat3",
        title: "Career Goals",
        description: "What are you looking to achieve?",
        icon: "Target",
        questions: [
          { id: "q6", category: "cat3", question: "What is your primary career goal?", type: "radio", options: [{ label: "Get a new job", value: "new_job" }, { label: "Get promoted", value: "promotion" }, { label: "Switch industries", value: "switch" }, { label: "Start a business", value: "business" }, { label: "Improve skills", value: "skills" }], required: true },
          { id: "q7", category: "cat3", question: "Tell us about your dream role", type: "textarea", placeholder: "Describe your ideal position, company culture, and what success means to you...", required: false },
        ],
      },
    ];

    const employerCategories: OnboardingCategory[] = [
      {
        id: "ecat1",
        title: "Company Information",
        description: "Tell us about your organisation",
        icon: "Building2",
        questions: [
          { id: "eq1", category: "ecat1", question: "Company name", type: "text", placeholder: "e.g. Acme Corp", required: true },
          { id: "eq2", category: "ecat1", question: "Company size", type: "radio", options: [{ label: "1-10", value: "micro" }, { label: "11-50", value: "small" }, { label: "51-200", value: "medium" }, { label: "201-1000", value: "large" }, { label: "1000+", value: "enterprise" }], required: true },
          { id: "eq3", category: "ecat1", question: "Industry", type: "select", options: [{ label: "Technology", value: "tech" }, { label: "Finance", value: "finance" }, { label: "Healthcare", value: "healthcare" }, { label: "Retail", value: "retail" }, { label: "Manufacturing", value: "manufacturing" }], required: true },
        ],
      },
      {
        id: "ecat2",
        title: "Hiring Needs",
        description: "What kind of talent are you looking for?",
        icon: "Users",
        questions: [
          { id: "eq4", category: "ecat2", question: "What roles are you most commonly hiring for?", type: "multiselect", options: [{ label: "Software Developers", value: "dev" }, { label: "Data Scientists", value: "ds" }, { label: "Product Managers", value: "pm" }, { label: "Designers", value: "design" }, { label: "Sales", value: "sales" }, { label: "Operations", value: "ops" }], required: true },
          { id: "eq5", category: "ecat2", question: "How many hires are you expecting in the next 6 months?", type: "radio", options: [{ label: "1-5", value: "1-5" }, { label: "6-20", value: "6-20" }, { label: "21-50", value: "21-50" }, { label: "50+", value: "50+" }], required: true },
        ],
      },
    ];

    return role === "employer" ? employerCategories : careerCategories;
  },

  submitResponses: async (responses: Record<string, unknown>) => {
    await delay(800);
    return { success: true };
  },
};

// ── Assessment API ────────────────────────────────────────────────────────────

export const assessmentApi = {
  getAssessments: async (): Promise<Assessment> => {
    await delay(500);
    return MOCK_ASSESSMENTS;
  },

  getAssessment: async (id: string): Promise<Assessment> => {
    await delay(400);
    const a = MOCK_ASSESSMENTS
    if (!a) throw new Error("Assessment not found");
    return a;
  },

  saveProgress: async (id: string,data:any): Promise<Assessment> => {
    await delay(400);
    const a = MOCK_ASSESSMENTS
    if (!a) throw new Error("Assessment not found");
    return a;
  },

  submitAssessment: async (
    assessmentId: string,
    answers: Record<string, string>
  ): Promise<AssessmentResult> => {
    await delay(1200);
    const assessment = MOCK_ASSESSMENTS;
    if (!assessment) throw new Error("Assessment not found");

    // Calculate score
    const score = 100;
    // const answerDetails: AssessmentResult["answers"] = assessment.topics.map((q) => {
    //   const selected = answers[q.id] ?? "";
    //   const isCorrect = selected === q.correctAnswer;
    //   if (isCorrect) correct++;
    //   return { questionId: q.id, selectedAnswer: selected, correct: isCorrect };
    // });

    // const score = Math.round((correct / assessment.questions.length) * 100);
    // const passed = score >= assessment.passingScore;
    const passed =true
    const result: AssessmentResult = {
      assessmentId,
      userId: "current-user",
      score,
      passed,
      answers: [],
      completedAt: new Date().toISOString(),
      timeSpent: 1200,
      certificateId: passed ? `cert-${Date.now()}` : undefined,
    };

    return result;
  },
};

// ── Certificate API ───────────────────────────────────────────────────────────

export const certificateApi = {
  getCertificate: async (id: string): Promise<Certificate> => {
    await delay(400);
    return {
      id,
      userId: "u2",
      userName: "James Okonkwo",
      assessmentId: "assess1",
      assessmentTitle: "JavaScript Fundamentals",
      category: "Technology",
      level: "Intermediate",
      score: 87,
      issuedAt: new Date().toISOString(),
      verificationCode: `SB-${id.slice(0, 8).toUpperCase()}`,
      issuerName: "CareAble Academy",
    };
  },
};

// ── Contact API ───────────────────────────────────────────────────────────────

export const contactApi = {
  submit: async (data: ContactFormData) => {
    await delay(1000);
    return { success: true, message: "Message sent! We'll get back to you within 24 hours." };
  },
};

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ASSESSMENTS: Assessment = {
  id: "wellbeing1",
  title: "Caregiver Wellbeing Assessment",
  category: "Wellbeing",
  description: "Understand your wellbeing across key life areas.",
  totalQuestions: 32,

  topics: [
    {
      id: "social",
      title: "Social Connection & Belonging",
      questions: [
        { id: "sc1", text: "I maintain social connections outside my caregiving role.", type: "slider" },
        { id: "sc2", text: "I feel connected to peers, family, or community.", type: "slider" },
        { id: "sc3", text: "I seek support when feeling isolated.", type: "slider" },
        { id: "sc4", text: "I maintain interests or identity beyond caregiving.", type: "slider" },
        { id: "sc5", text: "I experience a sense of belonging rather than isolation.", type: "slider" },
      ],
    },

    {
      id: "emotional",
      title: "Emotional Wellbeing",
      questions: [
        { id: "em1", text: "I feel emotionally supported in my daily life.", type: "slider" },
        { id: "em2", text: "I am able to manage stress effectively.", type: "slider" },
        { id: "em3", text: "I feel overwhelmed by responsibilities.", type: "slider" },
        { id: "em4", text: "I feel emotionally drained at the end of the day.", type: "slider" },
        { id: "em5", text: "I can find time to relax and recharge.", type: "slider" },
      ],
    },

    {
      id: "physical",
      title: "Physical Health",
      questions: [
        { id: "ph1", text: "I get enough sleep regularly.", type: "slider" },
        { id: "ph2", text: "I maintain a balanced and healthy diet.", type: "slider" },
        { id: "ph3", text: "I engage in regular physical activity.", type: "slider" },
        { id: "ph4", text: "I feel physically exhausted most of the time.", type: "slider" },
        { id: "ph5", text: "I take time to rest when needed.", type: "slider" },
        { id: "ph6", text: "I experience physical strain from caregiving tasks.", type: "slider" },
      ],
    },

    {
      id: "financial",
      title: "Financial Stability",
      questions: [
        { id: "fi1", text: "I feel financially secure in my current situation.", type: "slider" },
        { id: "fi2", text: "I can comfortably manage my daily expenses.", type: "slider" },
        { id: "fi3", text: "I have access to financial support if needed.", type: "slider" },
        { id: "fi4", text: "Caregiving has impacted my financial stability.", type: "slider" },
        { id: "fi5", text: "I am able to plan for future financial needs.", type: "slider" },
      ],
    },

    // 🔥 BIG TOPIC (10 QUESTIONS)
    {
      id: "caregiving",
      title: "Caregiving Experience",
      questions: [
        { id: "cg1", text: "I feel confident in my caregiving abilities.", type: "slider" },
        { id: "cg2", text: "I understand the needs of the person I care for.", type: "slider" },
        { id: "cg3", text: "I feel overwhelmed by caregiving responsibilities.", type: "slider" },
        { id: "cg4", text: "I receive adequate support in my caregiving role.", type: "slider" },
        { id: "cg5", text: "I can balance caregiving with my personal life.", type: "slider" },
        { id: "cg6", text: "I feel appreciated for the care I provide.", type: "slider" },
        { id: "cg7", text: "I have access to resources that help me caregive effectively.", type: "slider" },
        { id: "cg8", text: "I feel तनाव (stress) related to caregiving duties.", type: "slider" },
        { id: "cg9", text: "I can take breaks when needed from caregiving.", type: "slider" },
        { id: "cg10", text: "I feel in control of my caregiving responsibilities.", type: "slider" },
      ],
    },
  ],
};


function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
