import db from '@/db';

export const generateCompetencyScoresFromTopics = async (
  topicScores: {
    topic_id: number;
    score: number;
  }[]
) => {
  const topicIds = topicScores.map((t) => t.topic_id);

  const mappings = await db('assessment_topic_competency_domains')
    .whereIn('assessment_topic_id', topicIds)
    .select('assessment_topic_id', 'domain_id');

  const competencyMap: Record<string, number[]> = {};

  for (const topic of topicScores) {
    const domains = mappings.filter((m) => m.assessment_topic_id === topic.topic_id);

    for (const domain of domains) {
      if (!competencyMap[domain.domain_id]) {
        competencyMap[domain.domain_id] = [];
      }

      competencyMap[domain.domain_id].push(topic.score);
    }
  }

  return Object.entries(competencyMap).map(([domain_code, scores]) => ({
    domain_code,
    score: scores.reduce((a, b) => a + b, 0) / scores.length
  }));
};

export const saveCompetencyScores = async (
  attemptId: number,
  competencyScores: {
    domain_code: string;
    score: number;
  }[]
) => {
  if (!competencyScores.length) return;

  await db('competency_scores').insert(
    competencyScores.map((item) => ({
      attempt_id: attemptId,
      domain_code: item.domain_code,
      score: item.score,
      created_at: new Date()
    }))
  );
};
