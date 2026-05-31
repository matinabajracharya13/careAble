import db from '@/db';

type ActivityType =
  | 'assessment_completed'
  | 'certificate_issued'
  | 'onboarding_completed'
  | 'role_changed'
  | 'user_registered'
  | 'system_alert';

export const logActivity = async (params: {
  user_id?: number;
  actor_id?: number;
  type: ActivityType;
  title: string;
  description?: string;
  related_id?: number;
  related_type?: string;
  meta?: any;
}) => {
  return db('activities').insert({
    user_id: params.user_id ?? null,
    actor_id: params.actor_id ?? null,
    type: params.type,
    title: params.title,
    description: params.description ?? null,
    related_id: params.related_id ?? null,
    related_type: params.related_type ?? null,
    meta: params.meta ? JSON.stringify(params.meta) : null,
    created_at: new Date()
  });
};
