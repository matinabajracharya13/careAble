import { Knex } from 'knex';

export const seed = async (knex: Knex): Promise<void> => {
  const now = new Date().toISOString();

  // --------------------------------------------------
  // Employer Role
  // --------------------------------------------------
  const employerRole = await knex('roles').where('role_name', 'employer').first();

  if (!employerRole) {
    throw new Error('Employer role not found');
  }

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------
  await knex('onboarding_categories').whereIn('title', ['Company Profile', 'Recruitment Needs', 'Diversity & Inclusion']).del();

  const insertedCategories = await knex('onboarding_categories')
    .insert([
      {
        title: 'Company Profile',
        description: 'Tell us about your organisation',
        icon: 'Building2',
        display_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Recruitment Needs',
        description: 'Help us understand your hiring goals',
        icon: 'Users',
        display_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        title: 'Diversity & Inclusion',
        description: 'Build a more inclusive workforce',
        icon: 'Handshake',
        display_order: 3,
        created_at: now,
        updated_at: now
      }
    ])
    .returning(['category_id', 'title']);

  // --------------------------------------------------
  // Category → Employer Mapping
  // --------------------------------------------------
  await knex('onboarding_category_roles')
    .insert(
      insertedCategories.map((category: any) => ({
        category_id: category.category_id,
        role_id: employerRole.role_id
      }))
    )
    .onConflict(['category_id', 'role_id'])
    .ignore();

  const categoryMap = {
    company: insertedCategories.find((c: any) => c.title === 'Company Profile')?.category_id,
    recruitment: insertedCategories.find((c: any) => c.title === 'Recruitment Needs')?.category_id,
    diversity: insertedCategories.find((c: any) => c.title === 'Diversity & Inclusion')?.category_id
  };

  // --------------------------------------------------
  // Questions
  // --------------------------------------------------
  const questions = [
    // ======================================
    // COMPANY PROFILE
    // ======================================
    {
      question_text: 'Which industry does your organisation operate in?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.company,
      is_required: true,
      profile_section: 'company',
      profile_key: 'industry',
      profile_label: 'Industry'
    },
    {
      question_text: 'How many employees does your organisation have?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.company,
      is_required: true,
      profile_section: 'company',
      profile_key: 'company_size',
      profile_label: 'Company Size'
    },
    {
      question_text: 'Do you currently have open positions?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.company,
      is_required: true,
      profile_section: 'company',
      profile_key: 'currently_hiring',
      profile_label: 'Currently Hiring'
    },

    // ======================================
    // RECRUITMENT NEEDS
    // ======================================
    {
      question_text: 'Which types of roles are you hiring for?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.recruitment,
      is_required: true,
      profile_section: 'recruitment',
      profile_key: 'roles_hiring_for',
      profile_label: 'Hiring Roles'
    },
    {
      question_text: 'How many positions do you expect to fill in the next 12 months?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.recruitment,
      is_required: true,
      profile_section: 'recruitment',
      profile_key: 'annual_hiring_volume',
      profile_label: 'Annual Hiring Volume'
    },
    {
      question_text: 'What is your biggest recruitment challenge?',
      question_type: 'single_select',
      input_type: 'select',
      category_id: categoryMap.recruitment,
      is_required: true,
      profile_section: 'recruitment',
      profile_key: 'recruitment_challenge',
      profile_label: 'Recruitment Challenge'
    },

    // ======================================
    // DIVERSITY & INCLUSION
    // ======================================
    {
      question_text: 'Does your organisation have diversity and inclusion hiring goals?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.diversity,
      is_required: true,
      profile_section: 'diversity',
      profile_key: 'dei_program',
      profile_label: 'Diversity Hiring Program'
    },
    {
      question_text: 'Which candidate groups would you consider hiring?',
      question_type: 'multi_select',
      input_type: 'multiselect',
      category_id: categoryMap.diversity,
      is_required: false,
      profile_section: 'diversity',
      profile_key: 'candidate_groups',
      profile_label: 'Candidate Groups'
    },
    {
      question_text: 'Are you interested in verified skill-based hiring?',
      question_type: 'boolean',
      input_type: 'radio',
      category_id: categoryMap.diversity,
      is_required: true,
      profile_section: 'diversity',
      profile_key: 'verified_hiring',
      profile_label: 'Verified Hiring'
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

  const questionMap = insertedQuestions.reduce((acc: any, row: any) => {
    acc[row.question_text] = row.question_id;
    return acc;
  }, {});

  // --------------------------------------------------
  // Options
  // --------------------------------------------------
  const options = [
    {
      question: 'Which industry does your organisation operate in?',
      values: [
        'Healthcare',
        'Education',
        'Retail',
        'Hospitality',
        'Construction',
        'Technology',
        'Finance',
        'Manufacturing',
        'Government',
        'Other'
      ]
    },
    {
      question: 'How many employees does your organisation have?',
      values: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    {
      question: 'Do you currently have open positions?',
      values: ['Yes', 'No']
    },
    {
      question: 'Which types of roles are you hiring for?',
      values: [
        'Administration',
        'Customer Service',
        'Sales',
        'Technology',
        'Healthcare',
        'Operations',
        'Management',
        'Trades',
        'Marketing',
        'Finance'
      ]
    },
    {
      question: 'How many positions do you expect to fill in the next 12 months?',
      values: ['1-5', '6-20', '21-50', '51-100', '100+']
    },
    {
      question: 'What is your biggest recruitment challenge?',
      values: [
        'Finding qualified candidates',
        'Skills shortages',
        'Candidate retention',
        'Time to hire',
        'Budget constraints',
        'Employer branding'
      ]
    },
    {
      question: 'Does your organisation have diversity and inclusion hiring goals?',
      values: ['Yes', 'No']
    },
    {
      question: 'Which candidate groups would you consider hiring?',
      values: [
        'Carers',
        'People returning to work',
        'Migrants',
        'International students',
        'People with disabilities',
        'Older workers',
        'Young job seekers'
      ]
    },
    {
      question: 'Are you interested in verified skill-based hiring?',
      values: ['Yes', 'No']
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
