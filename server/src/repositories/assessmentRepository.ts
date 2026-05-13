import db from '@/db';
import { generateCertificate } from './certificateRepository';

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

export const findProgress = (userId: number, assessmentId: number, attemptId: number) => {
  return db('assessment_progress')
    .where({
      user_id: userId,
      assessment_id: assessmentId,
      attempt_id: attemptId
    })
    .first();
};

export const saveProgress = async (
  userId: number,
  assessmentId: number,
  attemptId: number,
  data: {
    answers: Record<string, string>;
    currentTopicIndex: number;
    currentPage: number;
  }
) => {
  const existing = await findProgress(userId, assessmentId, attemptId);

  if (existing) {
    return db('assessment_progress')
      .where({
        user_id: userId,
        assessment_id: assessmentId,
        attempt_id: attemptId
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
    current_page: data.currentPage,
    attempt_id: attemptId
  });
};

export const getAllAttempt = (userId: number) => {
  return db('assessment_attempts')
    .where({
      user_id: userId
    })
    .select('assessment_id', 'attempt_id', 'status');
};

export const getProgressByID = (userId: number, assessmentId: number, attemptId: number) => {
  return db('assessment_progress')
    .where({
      user_id: userId,
      assessment_id: assessmentId,
      attempt_id: attemptId
    })
    .first();
};

export const saveAssessmentResponses = async (
  attemptId: number,
  userId: number,
  assessmentId: number,
  responses: { question_id: number; selected_option_id: number; numeric_value: number }[]
) => {
  const trx = await db.transaction();
  try {
    const rows = responses.map((item) => ({
      attempt_id: attemptId,
      assessment_question_id: item.question_id,
      selected_option_id: item.selected_option_id,
      numeric_value: item.numeric_value
    }));

    await trx('assessment_responses').insert(rows);
    await trx('assessment_attempts')
      .where({
        attempt_id: attemptId,
        user_id: userId,
        assessment_id: assessmentId
      })
      .update({
        status: 'completed',
        submitted_at: trx.fn.now()
      });
    await trx.commit();
  } catch (err) {
    await trx.rollback();

    throw err;
  }
};

export const createAssessmentAttempt = async (assessmentID: number, userID: number) => {
  const rows = {
    assessment_id: assessmentID,
    user_id: userID,
    started_at: db.fn.now(),
    status: 'in_progress'
  };

  const [attempt] = await db('assessment_attempts')
    .insert(rows)
    .returning(['attempt_id', 'assessment_id', 'user_id', 'started_at', 'status']);

  return attempt;
};

export const processAssessmentResult = async (attemptId: number, assessmentId: number) => {
  // 1. fetch responses
  const responses = await db('assessment_responses').where({ attempt_id: attemptId });

  // 2. fetch questions (with domain mapping)
  const questions = await db('assessment_questions').where({ assessment_id: assessmentId });

  // 3. build lookup map (IMPORTANT optimization)
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // 4. domain accumulator
  const domainMap = new Map<string, { score: number; max: number }>();

  // 5. compute domain scores
  for (const r of responses) {
    const q = questionMap.get(r.assessment_question_id);
    if (!q) continue;

    const domain = q.domain || 'default';

    if (!domainMap.has(domain)) {
      domainMap.set(domain, { score: 0, max: 0 });
    }

    const d = domainMap.get(domain)!;

    d.score += Number(r.numeric_value);
    d.max += 5; // Likert max scale
  }

  // 7. prepare domain score rows
  const domainRows = Array.from(domainMap.entries()).map(([domain, val]) => {
    const ratio = val.score / val.max;

    return {
      attempt_id: attemptId,
      assessment_id: assessmentId,
      domain,
      score: Number(val.score.toFixed(2)),
      full_score: Number(val.max.toFixed(2)),
      capability_level: calculateCapability(ratio)
    };
  });

  // 8. insert domain scores
  if (domainRows.length > 0) {
    await db('domain_scores').insert(domainRows);
  }

  // 9. determine pass/fail
  const passed = domainRows.every((d) => d.capability_level !== 'Support');

  // 10. generate certificate if passed
  if (passed) {
    await generateCertificate(attemptId, assessmentId);
  }

  return {
    success: true,
    domains: domainRows,
    passed
  };
};
