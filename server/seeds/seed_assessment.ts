import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // ─────────────────────────────────────────────
  // CLEAN EXISTING DATA (order matters)
  // ─────────────────────────────────────────────
  await knex("assessment_question_options").del();
  await knex("assessment_questions").del();
  await knex("assessment_topics").del();
  await knex("assessments").del();

  // ─────────────────────────────────────────────
  // 1. ASSESSMENT
  // ─────────────────────────────────────────────
  const [assessmentId] = await knex("assessments").insert({
    title: "Caregiver Wellbeing Assessment",
    domain: "Wellbeing",
    description: "Understand your wellbeing across key life areas.",
    version: "1.0",
  });

  // ─────────────────────────────────────────────
  // 2. MOCK STRUCTURE
  // ─────────────────────────────────────────────
  const mockTopics = [
    {
      code: "social",
      title: "Social Connection & Belonging",
      questions: [
        "I maintain social connections outside my caregiving role.",
        "I feel connected to peers, family, or community.",
        "I seek support when feeling isolated.",
        "I maintain interests or identity beyond caregiving.",
        "I experience a sense of belonging rather than isolation.",
      ],
    },
    {
      code: "emotional",
      title: "Emotional Wellbeing",
      questions: [
        "I feel emotionally supported in my daily life.",
        "I am able to manage stress effectively.",
        "I feel overwhelmed by responsibilities.",
        "I feel emotionally drained at the end of the day.",
        "I can find time to relax and recharge.",
      ],
    },
    {
      code: "physical",
      title: "Physical Health",
      questions: [
        "I get enough sleep regularly.",
        "I maintain a balanced and healthy diet.",
        "I engage in regular physical activity.",
        "I feel physically exhausted most of the time.",
        "I take time to rest when needed.",
        "I experience physical strain from caregiving tasks.",
      ],
    },
    {
      code: "financial",
      title: "Financial Stability",
      questions: [
        "I feel financially secure in my current situation.",
        "I can comfortably manage my daily expenses.",
        "I have access to financial support if needed.",
        "Caregiving has impacted my financial stability.",
        "I am able to plan for future financial needs.",
      ],
    },
    {
      code: "caregiving",
      title: "Caregiving Experience",
      questions: [
        "I feel confident in my caregiving abilities.",
        "I understand the needs of the person I care for.",
        "I feel overwhelmed by caregiving responsibilities.",
        "I receive adequate support in my caregiving role.",
        "I can balance caregiving with my personal life.",
        "I feel appreciated for the care I provide.",
        "I have access to resources that help me caregive effectively.",
        "I feel stress related to caregiving duties.",
        "I can take breaks when needed from caregiving.",
        "I feel in control of my caregiving responsibilities.",
      ],
    },
  ];

  // Likert scale options
  const likertOptions = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Agree", value: 4 },
    { label: "Strongly Agree", value: 5 },
  ];

  // ─────────────────────────────────────────────
  // 3. INSERT TOPICS + QUESTIONS + OPTIONS
  // ─────────────────────────────────────────────
  for (const topic of mockTopics) {
    const [topicId] = await knex("assessment_topics").insert({
      assessment_id: assessmentId,
      code: topic.code,
      title: topic.title,
    });

    for (const questionText of topic.questions) {
      const [questionId] = await knex("assessment_questions").insert({
        assessment_id: assessmentId,
        assessment_topic_id: topicId,
        question_text: questionText,
        question_type: "likert",
      });

      await knex("assessment_question_options").insert(
        likertOptions.map((opt) => ({
          assessment_question_id: questionId,
          option_label: opt.label,
          numeric_value: opt.value,
        }))
      );
    }
  }
}