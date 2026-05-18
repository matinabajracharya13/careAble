import db from '@/db';

export const addDomainScore = async (attemptId: number, domainScores: any[]) => {
  const rows = domainScores.map((d) => ({
    attempt_id: attemptId,
    assessment_topic_id: d.topic_id,
    score: d.score,
    full_score: d.full_score,
    capability_level: d.capability
  }));

  return db('domain_scores').insert(rows);
};
