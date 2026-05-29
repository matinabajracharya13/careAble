export const normalizeQuestions = (rows: any[]) => {
  return rows.map((q) => ({
    ...q,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
  }));
};
