import db from '@/db';
import { OnboardingAnswer } from '@/types';

export const getOnboardingRoles = async () => {
  return db('onboarding_category_roles as orc')
    .join('roles as r', 'r.role_id', 'orc.role_id')
    .join('onboarding_categories as oc', 'oc.category_id', 'orc.category_id')
    .leftJoin('onboarding_questions as oq', 'oq.category_id', 'oc.category_id')
    .groupBy('r.role_id', 'r.role_name')
    .select(
      'r.role_id',
      'r.role_name',
      db.raw('COUNT(DISTINCT oc.category_id) as category_count'),
      db.raw('COUNT(DISTINCT oq.question_id) as question_count')
    );
};

export const getAllOnboardingQuestions = async (role: string) => {
  return (
    db('onboarding_categories as c')
      // ✅ role filter via mapping table
      .join('onboarding_category_roles as cr', 'cr.category_id', 'c.category_id')
      .join('roles as r', 'r.role_id', 'cr.role_id') // ✅ NEW JOIN

      .leftJoin('onboarding_questions as q', 'c.category_id', 'q.category_id')
      .leftJoin('question_options as o', 'q.question_id', 'o.question_id')

      .where('r.role_name', role)

      .select(
        'c.category_id',
        'c.title',
        'c.description',
        'c.icon',
        'c.display_order',

        'q.question_id',
        'q.question_text',
        'q.input_type',
        'q.is_required',

        'o.option_text',
        'o.option_value'
      )

      .orderBy('c.display_order', 'asc')
      .orderBy('q.question_id', 'asc')
      .orderBy('o.option_value', 'asc')
  );
};

export const insertOnboardingAnswers = async (userId: number, answers: OnboardingAnswer[]) => {
  const rows = answers.map((item) => {
    return {
      user_id: userId,
      question_id: item.question_id,
      answer_text: item.answer
    };
  });
  return db('onboarding_answers').insert(rows);
};

export const updateOnboardingCompletionStatus = async (userId: number, status: boolean) => {
  return db('users').where({ user_id: userId }).update({
    onboarding_completed: status,
    updated_at: db.fn.now()
  });
};
export const findCategories = async (roleId?: number) => {
  try {
    if (!roleId) return []; // ✅ prevents knex crash

    const categories = await db('onboarding_categories as oc')
      .join('onboarding_category_roles as orc', 'orc.category_id', 'oc.category_id')
      .where('orc.role_id', roleId)
      .select('oc.category_id', 'oc.title', 'oc.description', 'oc.display_order')
      .orderBy('oc.display_order', 'asc');
    return categories;
  } catch (error) {
    console.error('Error fetching categories by role:', error);
    return []; // ✅ always return empty list instead of throwing
  }
};

export const findAllOnboardingQuestions = async (category_id: number) => {
  const questions = await db('onboarding_questions as q')
    .leftJoin('question_options as o', 'o.question_id', 'q.question_id')
    .where('q.category_id', category_id)
    .groupBy('q.question_id')
    .select(
      'q.*',
      db.raw(`
        COALESCE(
          json_group_array(
            CASE
              WHEN o.question_option_id IS NOT NULL THEN
                json_object(
                  'option_id', o.question_option_id,
                  'option_text', o.option_text,
                  'option_value', o.option_value
                )
            END
          ),
          '[]'
        ) as options
      `)
    );

  return questions.map((question) => ({
    ...question,
    options: JSON.parse(question.options || '[]').filter(Boolean)
  }));
};
