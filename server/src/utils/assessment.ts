export const normalizeQuestions = (rows: any[]) => {
  return rows.map((q) => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
  }));
};

export const formatTopicsWithDomains = (rows: any[]) => {
  const map = new Map<number, any>();

  for (const row of rows) {
    const topicId = row.assessment_topic_id;

    if (!map.has(topicId)) {
      map.set(topicId, {
        assessment_topic_id: topicId,
        title: row.title,
        code: row.code,
        display_order: row.display_order,
        domains: []
      });
    }

    const topic = map.get(topicId);

    // ONLY push if domain exists
    if (row.domain_id && row.domain_name) {
      topic.domains.push({
        domain_id: row.domain_id,
        name: row.domain_name
      });
    }
  }

  return Array.from(map.values());
};
