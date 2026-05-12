import db from '@/db';
import { OnboardingAnswer } from '@/types';



export const getAllOnboardingQuestions = async () => {
  return db('onboarding_categories as c')
    .leftJoin('onboarding_questions as q', 'c.category_id', 'q.category_id')
    .leftJoin('question_options as o', 'q.question_id', 'o.question_id')
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
    .orderBy('o.option_value', 'asc');
};

export const insertOnboardingAnswers = async (
  userId: number,
  answers: OnboardingAnswer[]
) => {
 const rows = answers.map((item) => {

  return {
    user_id: userId,
    question_id: item.question_id,
    answer_text: item.answer,
  };
});
  return db('onboarding_answers').insert(rows);
};

export const updateOnboardingCompletionStatus = async (
  userId: number,
  status: boolean
) => {
  return db('users')
    .where({ user_id: userId })
    .update({
      onboarding_completed: status,
      updated_at: db.fn.now()
    });
};