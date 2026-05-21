import db from '@/db';
import { UserRole } from '@/enums/user-role';
import { mapCandidate } from '@/utils/mapCandidate';

export const findAllCandidates = async () => {
  const latestAttemptsSubQuery = db('assessment_attempts as aa')
    .select('aa.*')
    .whereRaw(
      `
    aa.attempt_id = (
      SELECT aa2.attempt_id
      FROM assessment_attempts aa2
      WHERE aa2.user_id = aa.user_id
      AND aa2.submitted_at IS NOT NULL
      ORDER BY aa2.submitted_at DESC
      LIMIT 1
    )
  `
    )
    .as('aa');

  const rows = await db('users as u')
    // roles
    .join('user_roles as ur', 'ur.user_id', 'u.user_id')
    .join('roles as r', 'r.role_id', 'ur.role_id')

    // latest attempt
    .join(latestAttemptsSubQuery, 'aa.user_id', 'u.user_id')

    // certificate + assessment (same pattern as working query)
    .leftJoin('certificates as c', 'c.attempt_id', 'aa.attempt_id')
    .leftJoin('assessments as a', 'a.assessment_id', 'aa.assessment_id')

    // IMPORTANT FIX: use certificate-based join for score
    .leftJoin('domain_scores as ds', 'ds.attempt_id', 'c.attempt_id')

    .where('r.role_name', UserRole.CARER)

    .select(
      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.postcode',
      'u.created_at',
      'u.is_active',

      'r.role_name as role',

      'aa.attempt_id',
      'aa.assessment_id',
      'aa.submitted_at',

      'c.certificate_code',

      // FIXED SCORE
      db.raw(`
  COALESCE(
    (
      SELECT ROUND(AVG(ds.score), 2)
      FROM domain_scores ds
      WHERE ds.attempt_id = aa.attempt_id
    ),
    0
  ) as score
`)
    )

    .groupBy(
      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.postcode',
      'u.created_at',
      'u.is_active',
      'r.role_name',
      'aa.attempt_id',
      'aa.assessment_id',
      'aa.submitted_at',
      'c.certificate_code'
    );

  return rows.map(mapCandidate);
};
