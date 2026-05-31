import db from '@/db';

export const getDomainAnalytics = async () => {
  return db('domain_scores as ds')
    .join('competency_domains as cd', 'cd.domain_id', 'ds.domain_id')
    .select(
      'ds.domain_id',
      'cd.title as domain_title',
      db.raw('AVG(ds.score) as avg_score'),
      db.raw(`
        SUM(CASE WHEN ds.score >= 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) 
        as percent_above_4
      `)
    )
    .groupBy('ds.domain_id', 'cd.title');
};
