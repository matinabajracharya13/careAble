export const queryKeys = {
  // =========================
  // USERS / CANDIDATES
  // =========================
  users: {
    all: ['users'] as const,
    list: (params?: any) => ['users', params] as const
  },

  candidate: {
    all: ['candidates'] as const,
    list: () => ['candidates'] as const,
    detail: (id: string | number) => ['candidate', id] as const
  },

  // =========================
  // ASSESSMENTS
  // =========================
  assessments: {
    all: ['assessments'] as const,
    detail: (id: string | number) => ['assessment', id] as const,
    attemptDetail: (assessmentId: string | number) => ['attempt-detail', assessmentId] as const,

    progress: {
      all: ['assessment-progress'] as const,
      user: () => ['assessment-progress'] as const,
      attempt: (attemptId: string | number) => ['assessment-progress', attemptId] as const
    }
  },

  // =========================
  // CERTIFICATES
  // =========================
  certificates: {
    all: ['all-certificates'] as const,
    detail: (code: string) => ['certificate', code] as const
  },

  // =========================
  // DASHBOARD / STATS
  // =========================
  dashboard: {
    stats: ['stats'] as const,
    root: ['dashboard'] as const
  },

  // =========================
  // ONBOARDING
  // =========================
  onboarding: {
    categories: ['onboarding-categories'] as const,
    categoriesByRole: (roleId: number) => ['onboarding-categories', roleId] as const
  },

  // =========================
  // USER ASSESSMENTS
  // =========================
  userAssessments: {
    list: (userId: number) => ['user-assessments', userId] as const
  }
};
