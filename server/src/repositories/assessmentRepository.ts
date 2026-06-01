import db from '@/db';

// ─────────────────────────────────────────────
// BASIC CRUD
// ─────────────────────────────────────────────

const baseAssessmentQuery = () => {
  return db('assessments as a')
    .leftJoin('assessment_topics as t', 'a.assessment_id', 't.assessment_id')
    .leftJoin('assessment_questions as q', 't.assessment_topic_id', 'q.assessment_topic_id');
};
const selectAssessmentFields = (query: any) => {
  return query
    .groupBy('a.assessment_id')
    .select('a.assessment_id', 'a.title', 'a.domain', 'a.is_active', 'a.version', 'a.description')
    .count('q.assessment_topic_id as totalQuestions');
};
export const findAllAssessments = (options?: { isAdmin?: boolean }) => {
  let query = baseAssessmentQuery();

  // ======================================================
  // ROLE FILTER
  // ======================================================
  if (!options?.isAdmin) {
    query = query.where('a.is_active', 1);
  }

  return selectAssessmentFields(query);
};

export const findAssessmentById = async (id: number) => {
  return await db('assessments').where('assessment_id', id).first();
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

export const findTopicsWithDomainByAssessment = (assessmentId: number) => {
  return db('assessment_topics as at')
    .leftJoin('assessment_topic_competency_domains as atcd', 'atcd.assessment_topic_id', 'at.assessment_topic_id')
    .leftJoin('competency_domains as cd', 'cd.domain_id', 'atcd.domain_id')
    .where('at.assessment_id', assessmentId)
    .select('at.assessment_topic_id', 'at.title', 'at.code', 'at.display_order', 'cd.domain_id', 'cd.name as domain_name')
    .orderBy('at.display_order', 'asc');
};

export const findQuestionsByTopicIds = (topicIds: number[]) => {
  if (!topicIds.length) return [];
  return db('assessment_questions').whereIn('assessment_topic_id', topicIds).orderBy('display_order');
};

export const findQuestionsByTopicId = (topicId: number) => {
  return db('assessment_questions as q')
    .leftJoin('assessment_question_options as o', 'o.assessment_question_id', 'q.assessment_question_id')
    .where('q.assessment_topic_id', topicId)
    .groupBy('q.assessment_question_id')
    .select(
      'q.*',
      db.raw(`
        COALESCE(
          json_group_array(
            json_object(
              'assessment_question_options_id', o.assessment_question_options_id,
              'option_label', o.option_label,
              'option_value', o.option_value
            )
          ),
          '[]'
        ) as options
      `)
    )
    .orderBy('q.display_order', 'asc');
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
  console.log('Fetching progress for user:', userId, 'assessment:', assessmentId, 'attempt:', attemptId);
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

export const getQuestionTopicMap = async (assessmentId: number) => {
  try {
    const rows = await db('assessment_questions')
      .select('assessment_question_id', 'assessment_topic_id')
      .where({ assessment_id: assessmentId });

    return rows.reduce(
      (acc, row) => {
        acc[row.assessment_question_id] = row.assessment_topic_id;
        return acc;
      },
      {} as Record<number, number>
    );
  } catch (error) {
    console.error('Error fetching question-topic map:', error);
    throw error;
  }
};

export const deleteAssessmentProgress = async (userId: number, assessmentId: number, attemptId: number) => {
  return db('assessment_progress')
    .where({
      user_id: userId,
      assessment_id: assessmentId,
      attempt_id: attemptId
    })
    .del();
};

export const inserAssessmentTopic = async (data: any) => {
  return await db.transaction(async (trx) => {
    const { domain_ids, ...topicData } = data;

    // ======================================================
    // 1. INSERT TOPIC
    // ======================================================
    const [topicId] = await trx('assessment_topics').insert(topicData);

    // ======================================================
    // 2. INSERT DOMAIN MAPPINGS (if any)
    // ======================================================
    if (Array.isArray(domain_ids) && domain_ids.length) {
      const mappings = domain_ids.map((domainId: number) => ({
        assessment_topic_id: topicId,
        domain_id: domainId
      }));

      await trx('assessment_topic_competency_domains').insert(mappings);
    }

    return topicId;
  });
};

// ======================================================
// SAVE QUESTIONS WITH OPTIONS
// ======================================================

export const saveAssessmentQuestions = async (assessment_topic_id: number, questions: any[], assessment_id: number) => {
  return await db.transaction(async (trx) => {
    for (const question of questions) {
      let questionId = question.assessment_question_id;

      // ======================================================
      // CREATE QUESTION
      // ======================================================

      if (!questionId) {
        const [createdQuestionId] = await trx('assessment_questions').insert({
          assessment_topic_id,
          assessment_id,

          question_text: question.question_text,

          question_type: question.question_type,

          created_at: trx.fn.now(),

          updated_at: trx.fn.now()
        });

        questionId = createdQuestionId;
      }

      // ======================================================
      // UPDATE QUESTION
      // ======================================================
      else {
        await trx('assessment_questions').where('assessment_question_id', questionId).update({
          question_text: question.question_text,

          question_type: question.question_type,

          updated_at: trx.fn.now()
        });

        // remove existing options
        await trx('assessment_question_options').where('assessment_question_id', questionId).del();
      }

      // ======================================================
      // INSERT OPTIONS
      // ======================================================

      if (question.options?.length) {
        const optionPayload = question.options.map((option: any) => ({
          assessment_question_id: questionId,

          option_label: option.option_label,

          option_value: option.option_value
        }));

        await trx('assessment_question_options').insert(optionPayload);
      }
    }

    return true;
  });
};
