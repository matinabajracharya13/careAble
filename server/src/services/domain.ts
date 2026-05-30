import { getCapabilityLevel } from '@/utils/capability';

export const generateDomainScores = (answers: Record<string, any>, questionTopicMap: Record<number, number>) => {
  const domainMap: Record<
    number,
    {
      totalScore: number;
      totalQuestions: number;
    }
  > = {};

  for (const [questionId, answer] of Object.entries(answers)) {
    const qId = Number(questionId);

    const topicId = questionTopicMap[qId];

    if (!topicId) continue;

    if (!domainMap[topicId]) {
      domainMap[topicId] = {
        totalScore: 0,
        totalQuestions: 0
      };
    }

    // add user score
    domainMap[topicId].totalScore += Number(answer.value || 0);

    // count question
    domainMap[topicId].totalQuestions += 1;
  }

  return Object.entries(domainMap).map(([topicId, data]) => {
    const meanScore = data.totalQuestions > 0 ? Number((data.totalScore / data.totalQuestions).toFixed(2)) : 0;

    return {
      topic_id: Number(topicId),

      // mean score
      score: meanScore,

      // number of questions
      full_score: data.totalQuestions,

      // capability level
      capability: getCapabilityLevel(meanScore)
    };
  });
};

export const generateCompetencyScoresFromTopics = async (
  topicScores: {
    assessment_topic_id: number;
    score: number;
  }[]
) => {
  const topicIds = topicScores.map((t) => t.assessment_topic_id);

  const mappings = await db('assessment_topic_competency_domains')
    .whereIn('assessment_topic_id', topicIds)
    .select('assessment_topic_id', 'domain_code');

  const competencyMap: Record<string, number[]> = {};

  for (const topic of topicScores) {
    const domains = mappings.filter((m) => m.assessment_topic_id === topic.assessment_topic_id);

    for (const domain of domains) {
      if (!competencyMap[domain.domain_code]) {
        competencyMap[domain.domain_code] = [];
      }

      competencyMap[domain.domain_code].push(topic.score);
    }
  }

  return Object.entries(competencyMap).map(([domain_code, scores]) => ({
    domain_code,
    score: scores.reduce((a, b) => a + b, 0) / scores.length
  }));
};
