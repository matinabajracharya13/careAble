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
  // 3. certificate join
  const certificates = db('certificates as c').select('c.attempt_id', 'c.certificate_code').as('cert');

  // 4. final query
  return db('assessments as a')
    .leftJoin(latestAttempts, 'a.assessment_id', 'latest_attempt.assessment_id')
    .leftJoin(attemptScores, 'latest_attempt.attempt_id', 'attempt_scores.attempt_id')
    .leftJoin(certificates, 'latest_attempt.attempt_id', 'cert.attempt_id')
    .where(function () {
      this.where('a.is_active', 1).orWhereNotNull('cert.certificate_code');
    })
    .select(
      'a.assessment_id as id',
      'a.title',
      'latest_attempt.attempt_id as attemptId',

      db.raw('COALESCE(attempt_scores.total_score, NULL) as score'),
      'latest_attempt.submitted_at as completedAt',
      'cert.certificate_code as certificateCode',

      db.raw(`
      CASE
        WHEN latest_attempt.attempt_id IS NULL THEN 'available'
        WHEN latest_attempt.attempt_status = 'in_progress' THEN 'in_progress'
        WHEN cert.certificate_code IS NOT NULL THEN 'completed'
        ELSE 'completed'
      END as status
    `)
    );
};

// ─────────────────────────────────────────────
// 1. Latest Attempt
// ─────────────────────────────────────────────
export const getLatestAttempt = async (userId: number, assessmentId: number) => {
  const result = await db('assessment_attempts')
    .where({
      user_id: userId,
      assessment_id: assessmentId
    })
    .orderBy('started_at', 'desc')
    .first();
  return result;
};

export const getAttemptDomainScores = async (attemptId: number) => {
  const result = await db('domain_scores as ds')
    // topic → competency mapping
    .join('assessment_topic_competency_domains as atcd', 'atcd.assessment_topic_id', 'ds.assessment_topic_id')
    // competency details
    .join('competency_domains as dc', 'dc.domain_id', 'atcd.domain_id')
    .where('ds.attempt_id', attemptId)
    .select('ds.attempt_id', 'atcd.domain_id', 'dc.full_name as competency_title', db.raw('AVG(ds.score) as average_score'))
    .groupBy('ds.attempt_id', 'atcd.domain_id', 'dc.domain_id');

  return result;
};
// ─────────────────────────────────────────────
// 3. Certificate
// ─────────────────────────────────────────────
export const getCertificateByAttempt = async (attemptId: number) => {
  return db('certificates').where({ attempt_id: attemptId }).first();
};

// ─────────────────────────────────────────────
// 4. Attempt Stats
// ─────────────────────────────────────────────
export const getAttemptStats = async (attemptId: number) => {
  return db('assessment_attempts').where({ attempt_id: attemptId }).select('attempt_id', 'status', 'started_at', 'submitted_at').first();
};
