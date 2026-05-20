import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  // export async function seed(knex: Knex): Promise<void> {
  // Clean in reverse FK order
  await knex('onboarding_answers').del();
  await knex('question_options').del();
  await knex('onboarding_questions').del();
  await knex('user_roles').del();
  await knex('users').del();
  await knex('roles').del();

  // ─── Roles ────────────────────────────────────────────────────────────────
  await knex('roles')
    .insert([
      {
        role_name: 'carer',
        label: 'Career Seeker',
        description: 'I want to validate my skills and grow my career',
        icon_key: 'graduation_cap',
        is_public_signup: true
      },
      {
        role_name: 'employer',
        label: 'Employer',
        description: 'I want to hire verified talent for my team',
        icon_key: 'briefcase',
        is_public_signup: true
      },
      {
        role_name: 'admin',
        label: 'Admin',
        description: 'Platform administrator',
        icon_key: 'shield',
        is_public_signup: false
      }
    ])
    .onConflict('role_name')
    .merge();

  // ─── Fake User ────────────────────────────────────────────────────────────
  const [userId] = await knex('users')
    .insert({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      password_hash: '$2b$10$fakehashedpasswordforseeding123456',
      phone: '0412 345 678',
      date_of_birth: '1985-06-15',
      postcode: '3000',
      accepted_terms: true,
      research_consent: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .returning('user_id');

  // console.log(userId)
  const carerRole = await knex('roles').where({ role_name: 'carer' }).first();

  await knex('user_roles').insert({
    user_id: userId.user_id ?? 1,
    role_id: carerRole.role_id,
    assigned_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // ─── Onboarding Questions ────────────────────────────────────────────────

  await knex('question_options').del();
  await knex('onboarding_questions').del();
  await knex('onboarding_categories').del();

  const now = new Date().toISOString();

  const insertedCategories = await knex('onboarding_categories')
    .insert([
      {
        title: 'Hidden Worker Status',
        description: 'Help us understand your current work situation',
        icon: 'Briefcase',
        display_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        title: 'CALD Status',
        description: 'Tell us about your language and cultural background',
        icon: 'Languages',
        display_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Caregiving Information',
        description: 'Tell us about your caregiving journey',
        icon: 'HeartHandshake',
        display_order: 3,
        created_at: now,
        updated_at: now
      }
    ])
    .returning(['category_id', 'title']);

  const categories = insertedCategories.map((row) => (typeof row === 'object' ? row : null));

  const categoryMap = {
    employment: categories.find((c) => c?.title === 'Hidden Worker Status')?.category_id,
    cald: categories.find((c) => c?.title === 'CALD Status')?.category_id,
    caregiving: categories.find((c) => c?.title === 'Caregiving Information')?.category_id
  };

  const questions = [
    {
      question_text: 'Are you working at the moment?',
      question_type: 'single_select',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true
    },
    {
      question_text: 'Are you looking for work?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true
    },
    {
      question_text: 'Have you applied for any job within the last 4 weeks?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true
    },
    {
      question_text: 'Which industry interests you?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.employment,
      is_required: false
    },

    {
      question_text: 'Do you speak a language other than English?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.cald,
      is_required: true
    },
    {
      question_text: 'Which language do you speak?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.cald,
      is_required: false
    },

    {
      question_text: 'How did you hear about this app?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: false
    },
    {
      question_text: 'What brings you here?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: false
    },
    {
      question_text: 'Who do you care for?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true
    },
    {
      question_text: 'What is the age of the person you are caring for?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true
    },
    {
      question_text: 'Which of the following apply to the person you care for?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.caregiving,
      is_required: false
    },
    {
      question_text: 'How long have you cared for this person?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true
    }
  ];

  const insertedQuestions = await knex('onboarding_questions')
    .insert(
      questions.map((q) => ({
        ...q,
        default_answer: null,
        created_at: now,
        updated_at: now
      }))
    )
    .returning(['question_id', 'question_text']);

  const questionMap = insertedQuestions.reduce((acc, row) => {
    acc[row.question_text] = row.question_id;
    return acc;
  }, {});

  const options = [
    {
      question: 'Are you working at the moment?',
      values: ['Yes, full-time', 'Yes, part-time', 'Casual', 'No']
    },
    {
      question: 'Are you looking for work?',
      values: ['Yes', 'No']
    },
    {
      question: 'Have you applied for any job within the last 4 weeks?',
      values: ['Yes', 'No']
    },
    {
      question: 'Which industry interests you?',
      values: [
        'Healthcare & Social Assistance',
        'Education & Training',
        'Retail Trade',
        'Hospitality & Tourism',
        'Construction',
        'Information Technology',
        'Finance & Insurance',
        'Other'
      ]
    },
    {
      question: 'Do you speak a language other than English?',
      values: ['Yes', 'No']
    },
    {
      question: 'Which language do you speak?',
      values: ['Mandarin', 'Arabic', 'Vietnamese', 'Cantonese', 'German', 'Italian', 'Hindi', 'Greek', 'Spanish', 'Nepali']
    },
    {
      question: 'How did you hear about this app?',
      values: [
        'CarersVIC',
        'CarersNSW',
        'Brotherhood of St. Laurence',
        'Other carer organisation',
        'WhatsApp group',
        'WeChat group',
        'Partner organisation',
        'Other'
      ]
    },
    {
      question: 'What brings you here?',
      values: [
        'Looking for employment support',
        'Seeking community connection',
        'Accessing training or education',
        'Finding carer resources',
        'General information',
        'Other'
      ]
    },
    {
      question: 'Who do you care for?',
      values: ['Parent(s)', 'Child / Children', 'Relative', 'Friend', 'Partner / Spouse', 'Other']
    },
    {
      question: 'What is the age of the person you are caring for?',
      values: ['Under 18', '18–29', '30–39', '40–49', '50–59', '60–69', '70+']
    },
    {
      question: 'Which of the following apply to the person you care for?',
      values: [
        'Dementia',
        'Palliative care',
        'Disability',
        'Mental health condition',
        'Chronic illness',
        'Acquired brain injury',
        'Autism spectrum',
        'Other'
      ]
    },
    {
      question: 'How long have you cared for this person?',
      values: ['Less than 1 year', '1–3 years', '3–5 years', '5–7 years', '7–10 years', 'Over 10 years']
    }
  ];

  const optionRows = options.flatMap((item) =>
    item.values.map((value, index) => ({
      question_id: questionMap[item.question],
      option_text: value,
      option_value: index + 1
    }))
  );

  await knex('question_options').insert(optionRows);
};
