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
