import { Knex } from "knex";

export const seed = async (knex: Knex): Promise<void> => {
// export async function seed(knex: Knex): Promise<void> {
  // Clean in reverse FK order
  await knex("onboarding_answers").del();
  await knex("question_options").del();
  await knex("onboarding_questions").del();
  await knex("user_roles").del();
  await knex("users").del();
  await knex("roles").del();

  // ─── Roles ────────────────────────────────────────────────────────────────
  await knex("roles").insert([
    { role_name: "carer", description: "A person providing care" },
    { role_name: "admin", description: "Platform administrator" },
    { role_name: "employer", description: "An employer partner" },
  ]);

  // ─── Fake User ────────────────────────────────────────────────────────────
  const [userId] = await knex("users")
    .insert({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      password_hash: "$2b$10$fakehashedpasswordforseeding123456",
      phone: "0412 345 678",
      date_of_birth: "1985-06-15",
      postcode: "3000",
      accepted_terms: true,
      research_consent: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .returning("user_id");

    // console.log(userId)
  const carerRole = await knex("roles").where({ role_name: "carer" }).first();

  await knex("user_roles").insert({
    user_id: userId.user_id ?? 1,
    role_id: carerRole.role_id,
    assigned_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // ─── Onboarding Questions ─────────────────────────────────────────────────
  const questions = [
    // Employment
    {
      question_text: "Are you working at the moment?",
      question_type: "single_select",
      user_category: "employment",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "Are you looking for work?",
      question_type: "boolean",
      user_category: "employment",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "Have you applied for any job within the last 4 weeks?",
      question_type: "boolean",
      user_category: "employment",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "Which industry interests you?",
      question_type: "multi_select",
      user_category: "employment",
      is_required: false,
      default_answer: null,
    },
    // CALD
    {
      question_text: "Do you speak a language other than English?",
      question_type: "boolean",
      user_category: "cald",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "Which language do you speak?",
      question_type: "single_select",
      user_category: "cald",
      is_required: false,
      default_answer: null,
    },
    // Caregiving
    {
      question_text: "How did you hear about this app?",
      question_type: "single_select",
      user_category: "caregiving",
      is_required: false,
      default_answer: null,
    },
    {
      question_text: "What brings you here?",
      question_type: "single_select",
      user_category: "caregiving",
      is_required: false,
      default_answer: null,
    },
    {
      question_text: "Who do you care for?",
      question_type: "single_select",
      user_category: "caregiving",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "What is the age of the person you are caring for?",
      question_type: "single_select",
      user_category: "caregiving",
      is_required: true,
      default_answer: null,
    },
    {
      question_text: "Which of the following apply to the person you care for?",
      question_type: "multi_select",
      user_category: "caregiving",
      is_required: false,
      default_answer: null,
    },
    {
      question_text: "How long have you cared for this person?",
      question_type: "single_select",
      user_category: "caregiving",
      is_required: true,
      default_answer: null,
    },
  ];

  const now = new Date().toISOString();
  const insertedIds = await knex("onboarding_questions")
    .insert(questions.map((q) => ({ ...q, created_at: now, updated_at: now })))
    .returning("question_id");

  // Knex SQLite returns row objects; normalise to plain IDs
  const ids: number[] = insertedIds.map((row: any) =>
    typeof row === "object" ? row.question_id : row
  );

  const [
    workingNowId,
    lookingForWorkId,
    appliedJobId,
    industryId,
    speaksOtherLangId,
    whichLanguageId,
    howDidYouHearId,
    whatBringsYouId,
    whoDoYouCareForId,
    carePersonAgeId,
    whichApplyId,
    howLongCaredId,
  ] = ids;

  // ─── Question Options ─────────────────────────────────────────────────────
  const options: { question_id: number; option_text: string; option_value: number }[] = [
    // Are you working at the moment?
    { question_id: workingNowId, option_text: "Yes, full-time", option_value: 1 },
    { question_id: workingNowId, option_text: "Yes, part-time", option_value: 2 },
    { question_id: workingNowId, option_text: "Casual", option_value: 3 },
    { question_id: workingNowId, option_text: "No", option_value: 4 },

    // Are you looking for work? (boolean)
    { question_id: lookingForWorkId, option_text: "Yes", option_value: 1 },
    { question_id: lookingForWorkId, option_text: "No", option_value: 0 },

    // Have you applied for any job within the last 4 weeks? (boolean)
    { question_id: appliedJobId, option_text: "Yes", option_value: 1 },
    { question_id: appliedJobId, option_text: "No", option_value: 0 },

    // Which industry interests you?
    { question_id: industryId, option_text: "Healthcare & Social Assistance", option_value: 1 },
    { question_id: industryId, option_text: "Education & Training", option_value: 2 },
    { question_id: industryId, option_text: "Retail Trade", option_value: 3 },
    { question_id: industryId, option_text: "Hospitality & Tourism", option_value: 4 },
    { question_id: industryId, option_text: "Construction", option_value: 5 },
    { question_id: industryId, option_text: "Information Technology", option_value: 6 },
    { question_id: industryId, option_text: "Finance & Insurance", option_value: 7 },
    { question_id: industryId, option_text: "Other", option_value: 8 },

    // Do you speak a language other than English? (boolean)
    { question_id: speaksOtherLangId, option_text: "Yes", option_value: 1 },
    { question_id: speaksOtherLangId, option_text: "No", option_value: 0 },

    // Which language do you speak?
    { question_id: whichLanguageId, option_text: "Mandarin", option_value: 1 },
    { question_id: whichLanguageId, option_text: "Arabic", option_value: 2 },
    { question_id: whichLanguageId, option_text: "Vietnamese", option_value: 3 },
    { question_id: whichLanguageId, option_text: "Cantonese", option_value: 4 },
    { question_id: whichLanguageId, option_text: "German", option_value: 5 },
    { question_id: whichLanguageId, option_text: "Italian", option_value: 6 },
    { question_id: whichLanguageId, option_text: "Hindi", option_value: 7 },
    { question_id: whichLanguageId, option_text: "Greek", option_value: 8 },
    { question_id: whichLanguageId, option_text: "Spanish", option_value: 9 },
    { question_id: whichLanguageId, option_text: "Nepali", option_value: 10 },

    // How did you hear about this app?
    { question_id: howDidYouHearId, option_text: "CarersVIC", option_value: 1 },
    { question_id: howDidYouHearId, option_text: "CarersNSW", option_value: 2 },
    { question_id: howDidYouHearId, option_text: "Brotherhood of St. Laurence", option_value: 3 },
    { question_id: howDidYouHearId, option_text: "Other carer organisation", option_value: 4 },
    { question_id: howDidYouHearId, option_text: "WhatsApp group", option_value: 5 },
    { question_id: howDidYouHearId, option_text: "WeChat group", option_value: 6 },
    { question_id: howDidYouHearId, option_text: "Partner organisation", option_value: 7 },
    { question_id: howDidYouHearId, option_text: "Other", option_value: 8 },

    // What brings you here?
    { question_id: whatBringsYouId, option_text: "Looking for employment support", option_value: 1 },
    { question_id: whatBringsYouId, option_text: "Seeking community connection", option_value: 2 },
    { question_id: whatBringsYouId, option_text: "Accessing training or education", option_value: 3 },
    { question_id: whatBringsYouId, option_text: "Finding carer resources", option_value: 4 },
    { question_id: whatBringsYouId, option_text: "General information", option_value: 5 },
    { question_id: whatBringsYouId, option_text: "Other", option_value: 6 },

    // Who do you care for?
    { question_id: whoDoYouCareForId, option_text: "Parent(s)", option_value: 1 },
    { question_id: whoDoYouCareForId, option_text: "Child / Children", option_value: 2 },
    { question_id: whoDoYouCareForId, option_text: "Relative", option_value: 3 },
    { question_id: whoDoYouCareForId, option_text: "Friend", option_value: 4 },
    { question_id: whoDoYouCareForId, option_text: "Partner / Spouse", option_value: 5 },
    { question_id: whoDoYouCareForId, option_text: "Other", option_value: 6 },

    // What is the age of the person you are caring for?
    { question_id: carePersonAgeId, option_text: "Under 18", option_value: 1 },
    { question_id: carePersonAgeId, option_text: "18–29", option_value: 2 },
    { question_id: carePersonAgeId, option_text: "30–39", option_value: 3 },
    { question_id: carePersonAgeId, option_text: "40–49", option_value: 4 },
    { question_id: carePersonAgeId, option_text: "50–59", option_value: 5 },
    { question_id: carePersonAgeId, option_text: "60–69", option_value: 6 },
    { question_id: carePersonAgeId, option_text: "70+", option_value: 7 },

    // Which of the following apply to the person you care for?
    { question_id: whichApplyId, option_text: "Dementia", option_value: 1 },
    { question_id: whichApplyId, option_text: "Palliative care", option_value: 2 },
    { question_id: whichApplyId, option_text: "Disability", option_value: 3 },
    { question_id: whichApplyId, option_text: "Mental health condition", option_value: 4 },
    { question_id: whichApplyId, option_text: "Chronic illness", option_value: 5 },
    { question_id: whichApplyId, option_text: "Acquired brain injury", option_value: 6 },
    { question_id: whichApplyId, option_text: "Autism spectrum", option_value: 7 },
    { question_id: whichApplyId, option_text: "Other", option_value: 8 },

    // How long have you cared for this person?
    { question_id: howLongCaredId, option_text: "Less than 1 year", option_value: 1 },
    { question_id: howLongCaredId, option_text: "1–3 years", option_value: 2 },
    { question_id: howLongCaredId, option_text: "3–5 years", option_value: 3 },
    { question_id: howLongCaredId, option_text: "5–7 years", option_value: 4 },
    { question_id: howLongCaredId, option_text: "7–10 years", option_value: 5 },
    { question_id: howLongCaredId, option_text: "Over 10 years", option_value: 6 },
  ];

  await knex("question_options").insert(options);
}