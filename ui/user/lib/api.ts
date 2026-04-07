import type {
  User,
  OnboardingCategory,
  Assessment,
  AssessmentResult,
  Certificate,
  ContactFormData,
} from "@/types";

// ── Base API (swap this URL for your real backend) ────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.skillbridge.dev";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("skillbridge_token")
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
  getAssessments: async (): Promise<Assessment[]> => {
    await delay(500);
    return MOCK_ASSESSMENTS;
  },

  getAssessment: async (id: string): Promise<Assessment> => {
    await delay(400);
    const a = MOCK_ASSESSMENTS.find((a) => a.id === id);
    if (!a) throw new Error("Assessment not found");
    return a;
  },

  submitAssessment: async (
    assessmentId: string,
    answers: Record<string, string>
  ): Promise<AssessmentResult> => {
    await delay(1200);
    const assessment = MOCK_ASSESSMENTS.find((a) => a.id === assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    // Calculate score
    let correct = 0;
    const answerDetails: AssessmentResult["answers"] = assessment.questions.map((q) => {
      const selected = answers[q.id] ?? "";
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correct++;
      return { questionId: q.id, selectedAnswer: selected, correct: isCorrect };
    });

    const score = Math.round((correct / assessment.questions.length) * 100);
    const passed = score >= assessment.passingScore;

    const result: AssessmentResult = {
      assessmentId,
      userId: "current-user",
      score,
      passed,
      answers: answerDetails,
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
      issuerName: "SkillBridge Academy",
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

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "assess1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of core JavaScript concepts including closures, promises, and modern ES6+ features.",
    category: "Technology",
    level: "intermediate",
    duration: 30,
    passingScore: 70,
    totalQuestions: 5,
    questions: [
      {
        id: "aq1", text: "What is a closure in JavaScript?",
        type: "multiple_choice",
        options: [
          { label: "A function that closes the browser", value: "a" },
          { label: "A function with access to its outer scope's variables", value: "b" },
          { label: "A method to close event listeners", value: "c" },
          { label: "A way to end a loop", value: "d" },
        ],
        correctAnswer: "b",
        explanation: "A closure is a function that retains access to its outer (enclosing) scope's variables, even after the outer function has returned.",
        points: 20,
      },
      {
        id: "aq2", text: "Which of the following is NOT a JavaScript data type?",
        type: "multiple_choice",
        options: [
          { label: "Symbol", value: "a" },
          { label: "BigInt", value: "b" },
          { label: "Float", value: "c" },
          { label: "Undefined", value: "d" },
        ],
        correctAnswer: "c",
        explanation: "JavaScript has: string, number, bigint, boolean, undefined, symbol, null, and object. 'Float' is not a distinct type.",
        points: 20,
      },
      {
        id: "aq3", text: "What does `Array.prototype.reduce()` do?",
        type: "multiple_choice",
        options: [
          { label: "Removes duplicate values from an array", value: "a" },
          { label: "Reduces the array length by one", value: "b" },
          { label: "Applies a function to accumulate array values into a single result", value: "c" },
          { label: "Filters elements based on a condition", value: "d" },
        ],
        correctAnswer: "c",
        explanation: "reduce() executes a reducer function on each element of the array, resulting in a single output value.",
        points: 20,
      },
      {
        id: "aq4", text: "Which statement about Promises is TRUE?",
        type: "multiple_choice",
        options: [
          { label: "Promises can be in three states: pending, fulfilled, or rejected", value: "a" },
          { label: "A resolved promise can be rejected later", value: "b" },
          { label: "Promises are synchronous operations", value: "c" },
          { label: "You can only chain one .then() to a Promise", value: "d" },
        ],
        correctAnswer: "a",
        explanation: "A Promise is always in one of three states: pending (initial), fulfilled (completed), or rejected (failed). Once settled it cannot change.",
        points: 20,
      },
      {
        id: "aq5", text: "What is the output of: `typeof null`?",
        type: "multiple_choice",
        options: [
          { label: '"null"', value: "a" },
          { label: '"undefined"', value: "b" },
          { label: '"object"', value: "c" },
          { label: '"boolean"', value: "d" },
        ],
        correctAnswer: "c",
        explanation: "This is a known bug in JavaScript. typeof null returns 'object' for historical reasons.",
        points: 20,
      },
    ],
  },
  {
    id: "assess2",
    title: "Project Management Essentials",
    description: "Validate your understanding of agile methodologies, risk management, and stakeholder communication.",
    category: "Management",
    level: "beginner",
    duration: 25,
    passingScore: 65,
    totalQuestions: 5,
    questions: [
      {
        id: "pm1", text: "In Scrum, what is the purpose of a Sprint Retrospective?",
        type: "multiple_choice",
        options: [
          { label: "To plan the next sprint's goals", value: "a" },
          { label: "To review the product increment with stakeholders", value: "b" },
          { label: "To reflect on the team process and identify improvements", value: "c" },
          { label: "To assign tasks to team members", value: "d" },
        ],
        correctAnswer: "c",
        explanation: "The Sprint Retrospective is a meeting where the Scrum team inspects itself and creates a plan for improvements to be enacted during the next Sprint.",
        points: 20,
      },
      {
        id: "pm2", text: "What does 'scope creep' mean in project management?",
        type: "multiple_choice",
        options: [
          { label: "Reducing the project scope to meet deadlines", value: "a" },
          { label: "Uncontrolled changes or continuous growth in a project's scope", value: "b" },
          { label: "Documenting the project scope in detail", value: "c" },
          { label: "Creeping deadlines due to team delays", value: "d" },
        ],
        correctAnswer: "b",
        explanation: "Scope creep refers to uncontrolled changes or continuous growth in project scope, often without adjustments to time, cost, or resources.",
        points: 20,
      },
      {
        id: "pm3", text: "A critical path in project management refers to:",
        type: "multiple_choice",
        options: [
          { label: "The most expensive series of tasks", value: "a" },
          { label: "The longest sequence of dependent tasks that determines project duration", value: "b" },
          { label: "Tasks that can be completed in parallel", value: "c" },
          { label: "The path to executive approval", value: "d" },
        ],
        correctAnswer: "b",
        explanation: "The critical path is the longest sequence of tasks that must be completed for the project to finish, determining the minimum project duration.",
        points: 20,
      },
      {
        id: "pm4", text: "What is a RACI matrix used for?",
        type: "multiple_choice",
        options: [
          { label: "Tracking project budgets", value: "a" },
          { label: "Scheduling sprint ceremonies", value: "b" },
          { label: "Clarifying roles and responsibilities for project activities", value: "c" },
          { label: "Assessing project risks", value: "d" },
        ],
        correctAnswer: "c",
        explanation: "RACI stands for Responsible, Accountable, Consulted, and Informed. It's a matrix used to clarify roles and responsibilities.",
        points: 20,
      },
      {
        id: "pm5", text: "Which is a key principle of Agile development?",
        type: "multiple_choice",
        options: [
          { label: "Following a plan is the highest priority", value: "a" },
          { label: "Comprehensive documentation over working software", value: "b" },
          { label: "Responding to change over following a plan", value: "c" },
          { label: "Contract negotiation over customer collaboration", value: "d" },
        ],
        correctAnswer: "c",
        explanation: "The Agile Manifesto values 'Responding to change over following a plan' as one of its four core values.",
        points: 20,
      },
    ],
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
