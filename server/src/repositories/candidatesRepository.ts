import db from '@/db';
import { UserRole } from '@/enums/user-role';
import { mapCandidate } from '@/utils/mapCandidate';
import { getHeatmapData } from '@/repositories/dashboardRepository';

export const findAllCandidates = async () => {
  const latestAttemptsSubQuery = db('assessment_attempts as aa')
    .select('aa.*')
    .whereRaw(
      `
    aa.attempt_id = (
      SELECT aa2.attempt_id
      FROM assessment_attempts aa2
      WHERE aa2.user_id = aa.user_id
      AND aa2.submitted_at IS NOT NULL
      ORDER BY aa2.submitted_at DESC
      LIMIT 1
    )
  `
    )
    .as('aa');

  const rows = await db('users as u')
    // roles
    .join('user_roles as ur', 'ur.user_id', 'u.user_id')
    .join('roles as r', 'r.role_id', 'ur.role_id')

    // latest attempt
    .join(latestAttemptsSubQuery, 'aa.user_id', 'u.user_id')

    // certificate + assessment (same pattern as working query)
    .leftJoin('certificates as c', 'c.attempt_id', 'aa.attempt_id')
    .leftJoin('assessments as a', 'a.assessment_id', 'aa.assessment_id')

    // IMPORTANT FIX: use certificate-based join for score
    .leftJoin('domain_scores as ds', 'ds.attempt_id', 'c.attempt_id')

    .where('r.role_name', UserRole.CARER)

    .select(
      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.postcode',
      'u.created_at',
      'u.is_active',

      'r.role_name as role',

      'aa.attempt_id',
      'aa.assessment_id',
      'aa.submitted_at',

      'c.certificate_code',

      // FIXED SCORE
      db.raw(`
  COALESCE(
    (
      SELECT ROUND(AVG(ds.score), 2)
      FROM domain_scores ds
      WHERE ds.attempt_id = aa.attempt_id
    ),
    0
  ) as score
`)
    )

    .groupBy(
      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.postcode',
      'u.created_at',
      'u.is_active',
      'r.role_name',
      'aa.attempt_id',
      'aa.assessment_id',
      'aa.submitted_at',
      'c.certificate_code'
    );

  return rows.map(mapCandidate);
};

export const getUserDetail = async (userId: number) => {
  const profile = await db('users as u')
    .join('user_roles as ur', 'ur.user_id', 'u.user_id')
    .join('roles as r', 'r.role_id', 'ur.role_id')
    .where('u.user_id', userId)
    .select(
      'u.user_id',
      db.raw("u.first_name || ' ' || u.last_name as name"),
      'u.email',
      'u.postcode',
      'u.created_at',
      'u.is_active',
      'r.role_name as role'
    )
    .first();

  if (!profile) {
    return null;
  }
  return profile;
};

export const getCandidateProfile = async (userId: number, profile: any) => {
  const latestAttempts = db('assessment_attempts as aa')
    .select('aa.assessment_id', 'aa.attempt_id', 'aa.submitted_at')
    .where('aa.user_id', userId)
    .whereNotNull('aa.submitted_at')
    .whereRaw(
      `
      aa.attempt_id = (
        SELECT MAX(aa2.attempt_id)
        FROM assessment_attempts aa2
        WHERE aa2.user_id = aa.user_id
        AND aa2.assessment_id = aa.assessment_id
        AND aa2.submitted_at IS NOT NULL
      )
    `
    )
    .as('latest');

  const assessments = await db(latestAttempts)
    .join('assessments as a', 'a.assessment_id', 'latest.assessment_id')
    .leftJoin('domain_scores as ds', 'ds.attempt_id', 'latest.attempt_id')
    .select(
      'latest.assessment_id',
      'latest.attempt_id',
      'latest.submitted_at',

      'a.title as assessment_title',
      'a.description as assessment_description',

      db.raw('ROUND(COALESCE(AVG(ds.score), 0), 2) as average_score')
    )
    .groupBy('latest.assessment_id', 'latest.attempt_id', 'latest.submitted_at', 'a.title', 'a.description')
    .orderBy('latest.submitted_at', 'desc');

  // ─────────────────────────────────────────────
  // 3. Certificates
  // ─────────────────────────────────────────────
  const certificates = await db('certificates as c')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'c.attempt_id')
    .join('assessments as a', 'a.assessment_id', 'aa.assessment_id')
    .whereRaw(
      `
      aa.attempt_id = (
        SELECT MAX(aa2.attempt_id)
        FROM assessment_attempts aa2
        WHERE aa2.user_id = aa.user_id
        AND aa2.assessment_id = aa.assessment_id
        AND aa2.submitted_at IS NOT NULL
      )
    `
    )
    .where('aa.user_id', userId)
    .select('c.certificate_code', 'c.issued_at', 'a.title as assessment_title')
    .orderBy('c.issued_at', 'desc');

  // ─────────────────────────────────────────────
  // 4. Candidate Insights (NEW)
  // ─────────────────────────────────────────────
  const onboardingAnswers = await db('onboarding_answers as oa')
    .join('onboarding_questions as oq', 'oq.question_id', 'oa.question_id')
    .where('oa.user_id', userId)
    .select('oq.profile_section', 'oq.profile_key', 'oq.profile_label', 'oq.question_id', 'oa.answer_text');

  const options = await db('question_options').select('question_option_id', 'question_id', 'option_text', 'option_value');

  // Group options by question_id
  const optionMap = new Map<number, any[]>();

  for (const option of options) {
    if (!optionMap.has(option.question_id)) {
      optionMap.set(option.question_id, []);
    }

    optionMap.get(option.question_id)!.push(option);
  }

  const formatted = onboardingAnswers.map((row) => {
    const selectedValues = String(row.answer_text || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const questionOptions = optionMap.get(row.question_id) || [];

    const selectedOptions = questionOptions
      .filter((option) => selectedValues.includes(String(option.option_value)))
      .map((option) => ({
        id: option.question_option_id,
        value: option.option_value,
        label: option.option_text
      }));

    return {
      profile_section: row.profile_section,
      profile_key: row.profile_key,
      profile_label: row.profile_label,
      value: selectedOptions.length > 0 ? selectedOptions.map((o) => o.label).join(', ') : row.answer_text,
      selected_options: selectedOptions
    };
  });
  // ─────────────────────────────────────────────
  // 5. Dashboard stats
  // ─────────────────────────────────────────────
  const dashboardStats = await getHeatmapData(userId);

  return {
    ...profile,

    candidate_insights: formatted,

    total_assessments_taken: assessments,

    total_certificates: certificates.length,

    certificates,

    dashboard_stats: dashboardStats
  };
};
