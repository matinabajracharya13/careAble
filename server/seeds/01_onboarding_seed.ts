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

  const rolesFromDb = await knex('roles').whereIn('role_name', ['carer', 'employer']).select('role_id', 'role_name');
  const mappings = insertedCategories.flatMap((cat: any) =>
    rolesFromDb
      .filter((role) => ['carer', 'employer'].includes(role.role_name)) // optional filter
      .map((role) => ({
        category_id: cat.category_id,
        role_id: role.role_id
      }))
  );

  await knex('onboarding_category_roles').insert(mappings).onConflict(['category_id', 'role_id']).ignore();

  const categories = insertedCategories.map((row) => (typeof row === 'object' ? row : null));

  const categoryMap = {
    employment: categories.find((c) => c?.title === 'Hidden Worker Status')?.category_id,
    cald: categories.find((c) => c?.title === 'CALD Status')?.category_id,
    caregiving: categories.find((c) => c?.title === 'Caregiving Information')?.category_id
  };

  const questions = [
    // ─────────────────────────────────────────────
    // Employment
    // ─────────────────────────────────────────────
    {
      question_text: 'Are you working at the moment?',
      question_type: 'single_select',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true,
      profile_section: 'employment',
      profile_key: 'employment_status',
      profile_label: 'Employment Status'
    },
    {
      question_text: 'Are you looking for work?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true,
      profile_section: 'employment',
      profile_key: 'actively_looking',
      profile_label: 'Open to Work'
    },
    {
      question_text: 'Have you applied for any job within the last 4 weeks?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.employment,
      is_required: true,
      profile_section: 'employment',
      profile_key: 'recent_job_search',
      profile_label: 'Recent Job Search Activity'
    },
    {
      question_text: 'Which industry interests you?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.employment,
      is_required: false,
      profile_section: 'employment',
      profile_key: 'industries_of_interest',
      profile_label: 'Industries of Interest'
    },

    // ─────────────────────────────────────────────
    // Background / CALD
    // ─────────────────────────────────────────────
    {
      question_text: 'Do you speak a language other than English?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.cald,
      is_required: true,
      profile_section: 'background',
      profile_key: 'multilingual',
      profile_label: 'Speaks Other Languages'
    },
    {
      question_text: 'Which language do you speak?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.cald,
      is_required: false,
      profile_section: 'background',
      profile_key: 'languages_spoken',
      profile_label: 'Languages Spoken'
    },

    // ─────────────────────────────────────────────
    // Caregiving
    // ─────────────────────────────────────────────
    {
      question_text: 'How did you hear about this app?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: false,
      profile_section: 'about',
      profile_key: 'referral_source',
      profile_label: 'How They Found Us'
    },
    {
      question_text: 'What brings you here?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: false,
      profile_section: 'about',
      profile_key: 'platform_goal',
      profile_label: 'Goals & Interests'
    },
    {
      question_text: 'Who do you care for?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true,
      profile_section: 'caregiving',
      profile_key: 'care_recipient',
      profile_label: 'Cares For'
    },
    {
      question_text: 'What is the age of the person you are caring for?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true,
      profile_section: 'caregiving',
      profile_key: 'care_recipient_age',
      profile_label: 'Care Recipient Age'
    },
    {
      question_text: 'Which of the following apply to the person you care for?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.caregiving,
      is_required: false,
      profile_section: 'caregiving',
      profile_key: 'care_support_types',
      profile_label: 'Support Experience'
    },
    {
      question_text: 'How long have you cared for this person?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.caregiving,
      is_required: true,
      profile_section: 'caregiving',
      profile_key: 'caregiving_experience',
      profile_label: 'Caregiving Experience'
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
