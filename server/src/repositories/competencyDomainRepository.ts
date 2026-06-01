import db from '@/db';

export const findAllCompetencyDomain = async () => {
  return await db('competency_domains');
};
