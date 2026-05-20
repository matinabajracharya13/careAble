import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // ─────────────────────────────────────────────
  // 1. ASSESSMENT
  // ─────────────────────────────────────────────
  const [assessmentId] = await knex('assessments').insert({
    title: 'Digital Productivity & Focus Assessment',
    domain: 'Productivity',
    description: 'Evaluate your focus, digital habits, and productivity patterns in daily work and study.',
    version: '1.0'
  });

  // ─────────────────────────────────────────────
  // 2. TOPIC STRUCTURE
  // ─────────────────────────────────────────────
  const mockTopics = [
    {
      code: 'focus',
      title: 'Focus & Attention Control',
      questions: [
        'I can focus on a task without getting distracted.',
        'I frequently switch between tasks without completing them.',
        'I maintain deep focus for extended periods.',
        'Notifications often interrupt my workflow.',
        'I can quickly regain focus after interruptions.'
      ]
    },
    {
      code: 'time_management',
      title: 'Time Management',
      questions: [
        'I plan my day before starting work or study.',
        'I often miss deadlines due to poor planning.',
        'I prioritize tasks effectively.',
        'I estimate time accurately for completing tasks.',
        'I leave tasks until the last minute.'
      ]
    },
    {
      code: 'digital_habits',
      title: 'Digital Habits & Screen Usage',
      questions: [
        'I spend more time on social media than intended.',
        'I use digital tools to improve my productivity.',
        'I take frequent unnecessary phone breaks.',
        'I control my screen time effectively.',
        'I get distracted by apps during work or study.'
      ]
    },
    {
      code: 'work_efficiency',
      title: 'Work Efficiency',
      questions: [
        'I complete tasks efficiently without unnecessary delays.',
        'I often feel overwhelmed by workload.',
        'I break tasks into manageable steps.',
        'I struggle to maintain consistent productivity.',
        'I deliver quality work within deadlines.'
      ]
    },
    {
      code: 'mental_clarity',
      title: 'Mental Clarity & Stress Management',
      questions: [
        'I feel mentally clear when working or studying.',
        'Stress affects my productivity significantly.',
        'I take breaks to reset my mind effectively.',
        'I often feel mentally exhausted during tasks.',
        'I can manage pressure without losing focus.'
      ]
    }
  ];

  // ─────────────────────────────────────────────
  // 3. LIKERT SCALE OPTIONS
  // ─────────────────────────────────────────────
  const likertOptions = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Neutral', value: 3 },
    { label: 'Agree', value: 4 },
    { label: 'Strongly Agree', value: 5 }
  ];

  // ─────────────────────────────────────────────
  // 4. INSERT DATA
  // ─────────────────────────────────────────────
  for (const topic of mockTopics) {
    const [topicId] = await knex('assessment_topics').insert({
      assessment_id: assessmentId,
      code: topic.code,
      title: topic.title
    });

    for (const questionText of topic.questions) {
      const [questionId] = await knex('assessment_questions').insert({
        assessment_id: assessmentId,
        assessment_topic_id: topicId,
        question_text: questionText,
        question_type: 'likert'
      });

      await knex('assessment_question_options').insert(
        likertOptions.map((opt) => ({
          assessment_question_id: questionId,
          option_label: opt.label,
          numeric_value: opt.value
        }))
      );
    }
  }
}
