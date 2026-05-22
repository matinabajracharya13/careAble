import db from '@/db';

export const findUserAssessments = async (userId: number) => {
  // 1. aggregate domain scores per attempt
  const attemptScores = db('domain_scores as ds')
    .select('ds.attempt_id', db.raw('AVG(ds.score) as total_score'))
    .groupBy('ds.attempt_id')
    .as('attempt_scores');

  const latestAttempts = db('assessment_attempts as aa')
    .select('aa.attempt_id', 'aa.assessment_id', 'aa.status as attempt_status', 'aa.submitted_at', 'aa.started_at')
    .where('aa.user_id', userId)
    .whereRaw(
      `
    aa.attempt_id = (
      SELECT aa2.attempt_id
      FROM assessment_attempts aa2
      WHERE aa2.assessment_id = aa.assessment_id
        AND aa2.user_id = ?
      ORDER BY 
        CASE 
          WHEN aa2.status = 'in_progress' THEN 1
          ELSE 2
        END,
        aa2.started_at DESC
      LIMIT 1
    )
  `,
      [userId]
    )
    .as('latest_attempt');
  console.log('latestAttempts', latestAttempts.toQuery());
  // 3. certificate join
  const certificates = db('certificates as c').select('c.attempt_id', 'c.certificate_code').as('cert');

  // 4. final query
  return db('assessments as a')
    .leftJoin(latestAttempts, 'a.assessment_id', 'latest_attempt.assessment_id')
    .leftJoin(attemptScores, 'latest_attempt.attempt_id', 'attempt_scores.attempt_id')
    .leftJoin(certificates, 'latest_attempt.attempt_id', 'cert.attempt_id')
    .select(
      'a.assessment_id as id',
      'a.title',
      'latest_attempt.attempt_id as attemptId', // ✅ IMPORTANT

      db.raw('COALESCE(attempt_scores.total_score, NULL) as score'),
      'latest_attempt.submitted_at as completedAt',
      'cert.certificate_code as certificateCode',
      db.raw(`
        CASE
          WHEN latest_attempt.attempt_id IS NULL THEN 'available'
          WHEN latest_attempt.attempt_status = 'in_progress' THEN 'in_progress'
          ELSE 'completed'
        END as status
      `)
    );
};
