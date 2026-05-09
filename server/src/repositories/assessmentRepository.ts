import db from '../db';

// ─────────────────────────────────────────────
// BASIC CRUD
// ─────────────────────────────────────────────
export const findAllAssessments = () => {
  return db('assessments as a')
    .leftJoin('assessment_topics as t', 'a.assessment_id', 't.assessment_id')
    .leftJoin('assessment_questions as q', 't.assessment_topic_id', 'q.assessment_topic_id')
    .groupBy('a.assessment_id')
    .select(
      'a.assessment_id',
      'a.title',
      'a.domain',
      'a.description' // keep only what you need
    )
    .count('q.assessment_topic_id as totalQuestions');
};

export const findAssessmentById = (id: number) => {
  return db('assessments').where('assessment_id', id).first();
};

export const insertAssessment = (data: any) => {
  return db('assessments').insert(data);
};

export const updateAssessmentById = (id: number, data: any) => {
  return db('assessments').where('assessment_id', id).update(data);
};

export const deleteAssessmentById = (id: number) => {
  return db('assessments').where('assessment_id', id).del();
};

// ─────────────────────────────────────────────
// NESTED DATA HELPERS
// ─────────────────────────────────────────────
export const findTopicsByAssessment = (assessmentId: number) => {
  return db('assessment_topics').where('assessment_id', assessmentId).orderBy('display_order');
};

export const findQuestionsByTopicIds = (topicIds: number[]) => {
  if (!topicIds.length) return [];
  return db('assessment_questions').whereIn('assessment_topic_id', topicIds).orderBy('display_order');
};

export const findOptionsByQuestionIds = (questionIds: number[]) => {
  if (!questionIds.length) return [];
  return db('assessment_question_options').whereIn('assessment_question_id', questionIds);
};
