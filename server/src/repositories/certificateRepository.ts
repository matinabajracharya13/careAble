import db from '../db';

const generateCertificateCode = () => {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CA-${part()}-${part()}`;
};

export const createCertificate = async (attemptId: number) => {
  const code = generateCertificateCode();
  const [id] = await db('certificates').insert({
    attempt_id: attemptId,
    certificate_code: code,
    issued_at: db.fn.now(),
    validity_status: 'valid'
  });
  return { certificate_id: id as number, certificate_code: code };
};

export const findCertificateById = async (certificateId: number) => {
  const cert = await db('certificates as c')
    .join('assessment_attempts as a', 'c.attempt_id', 'a.attempt_id')
    .join('users as u', 'a.user_id', 'u.user_id')
    .join('assessments as as', 'a.assessment_id', 'as.assessment_id')
    .where('c.certificate_id', certificateId)
    .select(
      'c.certificate_id',
      'c.certificate_code',
      'c.issued_at',
      'u.full_name',
      'u.email',
      'as.title as assessment_title',
      'as.domain',
      'a.attempt_id'
    )
    .first();

  if (!cert) return null;

  const domainScores = await db('domain_scores as ds')
    .join('assessment_topics as t', 'ds.topic_id', 't.assessment_topic_id')
    .where('ds.attempt_id', cert.attempt_id)
    .select('t.title as domain_name', 'ds.score', 'ds.capability_level');

  return { ...cert, domainScores };
};
