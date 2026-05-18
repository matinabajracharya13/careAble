import db from '@/db';

const baseQuery = () => {
  return db('certificates as c')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'c.attempt_id')
    .join('assessments as a', 'a.assessment_id', 'aa.assessment_id')
    .join('users as u', 'u.user_id', 'aa.user_id')
    .leftJoin('domain_scores as ds', 'ds.attempt_id', 'c.attempt_id')
    .groupBy('c.certificate_id', 'a.assessment_id', 'u.user_id')
    .select(
      'c.certificate_id',
      'c.certificate_code',
      'c.attempt_id',
      'c.issued_at',
      'c.pdf_url',
      'c.validity_status',
      'c.validity_date',

      'a.title as assessment_title',
      'a.description as assessment_description',

      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.email',

      db.raw("u.first_name || ' ' || u.last_name as full_name"),

      // 👇 overall mean score
      db.raw('ROUND(AVG(ds.score), 2) as overall_mean_score')
    );
};

export const findCertificatesByUserId = async (userId: number) => {
  return baseQuery().where('c.user_id', userId);
};

export const findCertificateByCode = async (code: string, userId: number) => {
  return baseQuery()
    .where({
      'c.certificate_code': code,
      'c.user_id': userId
    })
    .first();
};

export const generateCertificate = async (attemptId: number, assessmentId: number, userId: number) => {
  const code = `CERT-${Date.now()}-${attemptId}`;

  const [certificate] = await db('certificates')
    .insert({
      certificate_code: code,
      attempt_id: attemptId,
      issued_at: new Date(),
      validity_status: 'valid',
      validity_date: null,
      pdf_url: null,
      user_id: userId
    })
    .returning('*');

  return certificate;
};

export const getCertificateByAttemptId = async (attemptId: number) => {
  return baseQuery().where('c.attempt_id', attemptId).first();
};
