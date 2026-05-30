import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // ─────────────────────────────────────────────
  // CLEAN (FK SAFE ORDER)
  // ─────────────────────────────────────────────
  await knex('assessment_topic_competency_domains').del();
  await knex('assessment_question_options').del();
  await knex('assessment_questions').del();
  await knex('assessment_topics').del();
  await knex('assessments').del();

  // ─────────────────────────────────────────────
  // CREATE ASSESSMENT
  // ─────────────────────────────────────────────
  const assessmentInsert = await knex('assessments')
    .insert({
      title: 'Caregiver Competency Assessment',
      domain: 'Caregiving',
      description: 'Measures caregiver competencies across 12 domains.',
      version: '1.0'
    })
    .returning('assessment_id');

  const assessmentId = typeof assessmentInsert[0] === 'object' ? (assessmentInsert[0] as any).assessment_id : assessmentInsert[0];

  // ─────────────────────────────────────────────
  // TOPICS
  // ─────────────────────────────────────────────
  const topics = [
    {
      code: 'social',
      title: 'Social & Communication Foundations',
      domains: ['d5', 'd6', 'd1'],
      questions: [
        'I maintain meaningful communication with others.',
        'I can express my needs clearly.',
        'I feel connected to my support network.',
        'I manage group communication effectively.',
        'I avoid misunderstandings in conversations.'
      ]
    },
    {
      code: 'emotional',
      title: 'Emotional Strength & Resilience',
      domains: ['d3', 'd4'],
      questions: [
        'I manage stress effectively.',
        'I recover quickly from emotional setbacks.',
        'I feel emotionally balanced most days.',
        'I take time to care for my emotional health.',
        'I can regulate my emotions under pressure.'
      ]
    },
    {
      code: 'care',
      title: 'Practical Care & Safety',
      domains: ['d7', 'd11'],
      questions: [
        'I provide safe care consistently.',
        'I can plan caregiving tasks efficiently.',
        'I manage risks effectively.',
        'I organize daily care routines well.',
        'I anticipate care needs ahead of time.'
      ]
    },
    {
      code: 'growth',
      title: 'Learning & Adaptability',
      domains: ['d9', 'd10'],
      questions: [
        'I learn new caregiving skills easily.',
        'I adapt to changing situations.',
        'I use digital tools effectively.',
        'I find and evaluate online information.',
        'I stay open to feedback and improvement.'
      ]
    },
    {
      code: 'leadership',
      title: 'Advocacy & Leadership',
      domains: ['d2', 'd8', 'd12'],
      questions: [
        'I advocate for the person I care for.',
        'I make ethical decisions in caregiving.',
        'I coordinate support when needed.',
        'I take initiative in challenging situations.',
        'I respect cultural and personal values.'
      ]
    }
  ];

  // ─────────────────────────────────────────────
  // LIKERT OPTIONS
  // ─────────────────────────────────────────────
  const likertOptions = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Neutral', value: 3 },
    { label: 'Agree', value: 4 },
    { label: 'Strongly Agree', value: 5 }
  ];

  // ─────────────────────────────────────────────
  // INSERT DATA
  // ─────────────────────────────────────────────
  for (const topic of topics) {
    const topicInsert = await knex('assessment_topics')
      .insert({
        assessment_id: assessmentId,
        code: topic.code,
        title: topic.title
      })
      .returning('assessment_topic_id');

    const topicId = typeof topicInsert[0] === 'object' ? (topicInsert[0] as any).assessment_topic_id : topicInsert[0];

    // ✅ FIXED: competency mapping table
    await knex('assessment_topic_competency_domains').insert(
      topic.domains.map((domainCode) => ({
        assessment_topic_id: topicId,
        domain_id: domainCode
      }))
    );

    for (const questionText of topic.questions) {
      const questionInsert = await knex('assessment_questions')
        .insert({
          assessment_id: assessmentId,
          assessment_topic_id: topicId,
          question_text: questionText,
          question_type: 'likert'
        })
        .returning('assessment_question_id');

      const questionId = typeof questionInsert[0] === 'object' ? (questionInsert[0] as any).assessment_question_id : questionInsert[0];

      await knex('assessment_question_options').insert(
        likertOptions.map((opt) => ({
          assessment_question_id: questionId,
          option_label: opt.label,
          option_value: opt.value
        }))
      );
    }
  }
}
