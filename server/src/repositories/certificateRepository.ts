import db from '@/db';

const baseQuery = () => {
  return db('certificates as c')
    .join('assessment_attempts as aa', 'aa.attempt_id', 'c.attempt_id')
    .join('assessments as a', 'a.assessment_id', 'aa.assessment_id')
    .select(
      'c.certificate_id',
      'c.certificate_code',
      'c.attempt_id',
      'c.issued_at',
      'c.pdf_url',
      'c.validity_status',
      'c.validity_date',
      'a.title as assessment_title',
      'a.description as assessment_description'
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

export const generateCertificate = async (attemptId: number, assessmentId: number) => {
  const code = `CERT-${Date.now()}-${attemptId}`;

  await db('certificates').insert({
    certificate_code: code,
    attempt_id: attemptId,
    issued_at: new Date(),
    validity_status: 'valid',
    validity_date: null,
    pdf_url: null
  });
};

export const getCertificateByAttemptId = async (attemptId: number) => {
  return baseQuery().where('c.attempt_id', attemptId).first();
};
