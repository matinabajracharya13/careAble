import { logActivity } from '@/repositories/activitiesRepository';

export const activityService = {
  assessment: {
    completed: async (params: { userId: number; assessmentId: number; attemptId: number; score: number }) => {
      return await logActivity({
        user_id: params.userId,
        actor_id: params.userId,
        type: 'assessment_completed',
        title: 'Assessment completed',
        description: `Score: ${params.score.toFixed(2)}`,
        related_id: params.assessmentId,
        related_type: 'assessment',
        meta: {
          attemptId: params.attemptId,
          score: params.score
        }
      });
    }
  },

  certificate: {
    issued: async (params: { userId: number; certificateId: number; assessmentTitle: string }) => {
      return await logActivity({
        user_id: params.userId,
        type: 'certificate_issued',
        title: 'Certificate issued',
        description: params.assessmentTitle,
        related_id: params.certificateId,
        related_type: 'certificate'
      });
    }
  },

  user: {
    roleChanged: async (params: { userId: number; actorId: number; oldRole: string; newRole: string }) => {
      return await logActivity({
        user_id: params.userId,
        actor_id: params.actorId,
        type: 'role_changed',
        title: 'User role updated',
        description: `${params.oldRole} → ${params.newRole}`,
        meta: params
      });
    },
    registered: async (params: { userId: number; email: string; role?: string; source?: 'web' | 'admin' | 'invite' }) => {
      return await logActivity({
        user_id: params.userId,
        type: 'user_registered',
        title: 'New user registered',
        description: `${params.email} joined the platform`,
        meta: {
          role: params.role,
          source: params.source || 'web'
        }
      });
    }
  },

  onboardingCompleted: async (params: { userId: number; actorId?: number; sectionsCompleted?: string[]; completionPercent?: number }) => {
    return await logActivity({
      user_id: params.userId,
      actor_id: params.actorId,
      type: 'onboarding_completed',
      title: 'Onboarding completed',
      description: `User completed onboarding (${params.completionPercent ?? 100}%)`,
      related_type: 'onboarding',
      meta: {
        sectionsCompleted: params.sectionsCompleted || [],
        completionPercent: params.completionPercent ?? 100
      }
    });
  },
  system: {
    alert: async (params: { title: string; description?: string; meta?: any }) => {
      return await logActivity({
        type: 'system_alert',
        title: params.title,
        description: params.description,
        meta: params.meta
      });
    }
  }
};
