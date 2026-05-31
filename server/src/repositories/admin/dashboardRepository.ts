import db from '@/db';
import { UserRole } from '@/enums/user-role';

export const getDashboardStats = async () => {
  const [carers] = await db('user_roles as ur')
    .join('roles as r', 'r.role_id', 'ur.role_id')
    .count('* as total')
    .where('r.role_name', UserRole.CARER);

  const [employers] = await db('user_roles as ur')
    .join('roles as r', 'r.role_id', 'ur.role_id')
    .count('* as total')
    .where('r.role_name', UserRole.EMPLOYER);

  const [assessments] = await db('assessment_attempts').whereNotNull('submitted_at').count('* as total');

  const [certificates] = await db('certificates').count('* as total');

  return {
    total_carers: Number(carers.total),
    total_employers: Number(employers.total),
    total_assessments: Number(assessments.total),
    total_certificates: Number(certificates.total)
  };
};

export const getDomainAnalytics = async () => {
  return db('competency_scores as cs')
    .join('competency_domains as cd', 'cd.domain_id', 'cs.domain_code')
    .groupBy('cs.domain_code', 'cd.name')
    .select('cs.domain_code', 'cd.name as domain_title')
    .avg('cs.score as avg_score')
    .select(
      db.raw(`
        ROUND(
          AVG(
            CASE WHEN cs.score >= 4 THEN 100 ELSE 0 END
          ), 2
        ) as percent_above_4
      `)
    )
    .orderBy('avg_score', 'desc');
};

export const getAssessmentTrends = async () => {
  return db('assessment_attempts')
    .whereNotNull('submitted_at')
    .select(db.raw("strftime('%Y-%m', submitted_at) as month"))
    .count('* as total')
    .groupBy('month')
    .orderBy('month');
};

export const getTopCarers = async () => {
  return db('competency_scores as cs')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'cs.attempt_id')
    .join('users as u', 'u.user_id', 'aa.user_id')
    .groupBy('u.user_id')
    .select('u.user_id', db.raw(`u.first_name || ' ' || u.last_name as name`))
    .avg('cs.score as average_score')
    .orderBy('average_score', 'desc')
    .limit(10);
};

export const getAtRiskCarers = async () => {
  return db('competency_scores as cs')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'cs.attempt_id')
    .join('users as u', 'u.user_id', 'aa.user_id')
    .groupBy('u.user_id')
    .havingRaw('AVG(cs.score) < 3')
    .select('u.user_id', db.raw(`u.first_name || ' ' || u.last_name as name`))
    .avg('cs.score as average_score')
    .orderBy('average_score');
};

export const getRecentCertificates = async () => {
  return db('certificates as c')
    .join('users as u', 'u.user_id', 'c.user_id')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'c.attempt_id')
    .join('assessments as a', 'a.assessment_id', 'aa.assessment_id')
    .select('c.certificate_code', 'c.issued_at', 'a.title as assessment_title', db.raw(`u.first_name || ' ' || u.last_name as user_name`))
    .orderBy('c.issued_at', 'desc')
    .limit(10);
};

export const getRecentActivity = async () => {
  const rows = await db('activities as a')
    .leftJoin('users as u', 'u.user_id', 'a.user_id')
    .orderBy('a.created_at', 'desc')
    .limit(10)
    .select(
      'a.activity_id',
      'a.type',
      'a.title',
      'a.description',
      'a.created_at',
      db.raw("COALESCE(u.first_name || ' ' || u.last_name, 'System') as user_name")
    );

  return rows.map((r) => ({
    id: r.activity_id,
    type: r.type,
    title: r.title,
    description: r.description,
    created_at: r.created_at,
    user: r.user_name
  }));
};
