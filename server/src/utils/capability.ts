export const getCapabilityLevel = (score: number): string => {
  if (score >= 4.0) {
    return 'Strength area';
  }

  if (score >= 3.0) {
    return 'Growth area';
  }

  return 'Support area';
};

export const calculateOverallMean = (domainScores: any[]) => {
  if (!domainScores.length) return 0;

  const total = domainScores.reduce((sum, d) => sum + d.score, 0);
  return Number((total / domainScores.length).toFixed(2));
};
