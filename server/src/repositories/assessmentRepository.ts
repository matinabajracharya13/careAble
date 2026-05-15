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

export const findProgress = (userId: number, assessmentId: number) => {
  return db('assessment_progress')
    .where({
      user_id: userId,
      assessment_id: assessmentId
    })
    .first();
};

export const saveProgress = async (
  userId: number,
  assessmentId: number,
  data: {
    answers: Record<string, string>;
    currentTopicIndex: number;
    currentPage: number;
  }
) => {
  const existing = await findProgress(userId, assessmentId);

  if (existing) {
    return db('assessment_progress')
      .where({
        user_id: userId,
        assessment_id: assessmentId
      })
      .update({
        answers: JSON.stringify(data.answers),
        current_topic_index: data.currentTopicIndex,
        current_page: data.currentPage,
        updated_at: db.fn.now()
      });
  }

  return db('assessment_progress').insert({
    user_id: userId,
    assessment_id: assessmentId,
    answers: JSON.stringify(data.answers),
    current_topic_index: data.currentTopicIndex,
    current_page: data.currentPage
  });
};

export const getAllProgress = (userId: number) => {
  return db('assessment_progress').where({
    user_id: userId
  });
};

export const getProgressByID = (userId: number, progressId: number) => {
  return db('assessment_progress')
    .where({
      user_id: userId,
      progress_id: progressId
    })
    .first();
};

// ─────────────────────────────────────────────
// SUBMISSION
// ─────────────────────────────────────────────

export const createAttempt = async (userId: number, assessmentId: number) => {
  const [id] = await db('assessment_attempts')
    .insert({ user_id: userId, assessment_id: assessmentId, status: 'in_progress', started_at: db.fn.now() });
  return id as number;
};

export const saveResponses = async (
  attemptId: number,
  answers: { questionId: number; numericValue: number }[]
) => {
  const rows = await Promise.all(
    answers.map(async ({ questionId, numericValue }) => {
      const option = await db('assessment_question_options')
        .where({ assessment_question_id: questionId, numeric_value: numericValue })
        .first();
      return {
        attempt_id: attemptId,
        assessment_question_id: questionId,
        selected_option_id: option.assessment_question_options_id,
        numeric_value: numericValue
      };
    })
  );
  return db('assessment_responses').insert(rows);
};

export const saveDomainScores = (
  scores: { attemptId: number; assessmentId: number; topicId: number; score: number; capabilityLevel: string }[]
) => {
  return db('domain_scores').insert(
    scores.map((s) => ({
      attempt_id: s.attemptId,
      assessment_id: s.assessmentId,
      topic_id: s.topicId,
      score: s.score,
      capability_level: s.capabilityLevel
    }))
  );
};

export const completeAttempt = (attemptId: number) => {
  return db('assessment_attempts')
    .where({ attempt_id: attemptId })
    .update({ status: 'completed', submitted_at: db.fn.now() });
};
