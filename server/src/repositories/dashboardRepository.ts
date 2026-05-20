import db from '@/db';

/**
 * Get total unique assessments attempted by user
 */
export const getAssessmentsTakenCount = async (userId: number): Promise<number> => {
  const result = await db('assessment_attempts').where({ user_id: userId }).countDistinct('assessment_id as count').first();

  return Number(result?.count || 0);
};

/**
 * Get total unique certificates earned by user
 */
export const getCertificatesEarnedCount = async (userId: number): Promise<number> => {
  const result = await db('certificates as c')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'c.attempt_id')
    .where('aa.user_id', userId)
    .countDistinct('aa.assessment_id as count')
    .first();

  return Number(result?.count || 0);
};

/**
 * Get latest attempt IDs per assessment for user
 */
export const getLatestAttemptIds = async (userId: number): Promise<number[]> => {
  const latestAttempts = await db('assessment_attempts as aa')
    .where('aa.user_id', userId)
    .whereRaw(
      `
      aa.submitted_at = (
        SELECT MAX(sub.submitted_at)
        FROM assessment_attempts sub
        WHERE sub.user_id = aa.user_id
        AND sub.assessment_id = aa.assessment_id
      )
    `
    )
    .select('aa.attempt_id');

  return latestAttempts.map((a) => a.attempt_id);
};

/**
 * Get average score percentage from latest attempts
 */
export const getAverageScore = async (userId: number): Promise<number> => {
  const attemptIds = await getLatestAttemptIds(userId);

  if (!attemptIds.length) {
    return 0;
  }

  const result = await db('domain_scores').whereIn('attempt_id', attemptIds).avg('score as avg_score').first();

  const mean = Number(result?.avg_score || 0);

  // convert 0–5 scale to percentage
  return Number(((mean / 5) * 100).toFixed(0));
};

/**
 * Dashboard stats
 */
export const getDashboardStats = async (userId: number) => {
  const [assessmentsTaken, certificatesEarned, averageScore, heatMapData] = await Promise.all([
    getAssessmentsTakenCount(userId),
    getCertificatesEarnedCount(userId),
    getAverageScore(userId),
    getHeatmapData(userId) // Preload heatmap data for dashboard (optional optimization)
  ]);

  return {
    assessmentsTaken,
    certificatesEarned,
    averageScore,
    heatMapData
  };
};

export const getLatestAttempts = async (userId: number) => {
  return db('assessment_attempts as aa')
    .where('aa.user_id', userId)
    .whereRaw(
      `
      aa.attempt_id = (
        SELECT sub.attempt_id
        FROM assessment_attempts sub
        WHERE sub.user_id = aa.user_id
        AND sub.assessment_id = aa.assessment_id
        ORDER BY sub.started_at DESC
        LIMIT 1
      )
    `
    )
    .select('aa.attempt_id');
};

export const getHeatmapData = async (userId: number) => {
  const latestAttempts = await getLatestAttempts(userId);

  const attemptIds = latestAttempts.map((a) => a.attempt_id);

  if (!attemptIds.length) return [];

  const rows = await db('domain_scores as ds')
    .join('assessment_topics as t', 't.assessment_topic_id', 'ds.assessment_topic_id')
    .whereIn('ds.attempt_id', attemptIds)
    .select('ds.assessment_topic_id', 'ds.score', 't.title');

  return rows.map((row) => ({
    id: `d${row.assessment_topic_id}`,
    title: row.title,
    score: Number(row.score)
  }));
};
