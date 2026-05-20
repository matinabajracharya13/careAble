import db from '@/db';

const baseAuthUserQuery = () => {
  return db('users as u')
    .leftJoin('user_roles as ur', 'u.user_id', 'ur.user_id')
    .leftJoin('roles as r', 'ur.role_id', 'r.role_id')
    .select(
      'u.user_id',
      'u.first_name',
      'u.last_name',
      'u.phone',
      'u.email',
      'u.date_of_birth',
      'u.postcode',
      'u.onboarding_completed',
      'u.email_verified',
      'u.password_hash',
      'r.role_name as role',
      'r.is_public_signup',
      'u.created_at'
    );
};

export const findUserByEmail = async (email: string) => {
  return db('users').where({ email }).first();
};

export const findAuthUserByEmail = async (email: string) => {
  return baseAuthUserQuery().where('u.email', email).first();
};

export const findAuthUserById = async (userId: number) => {
  return baseAuthUserQuery().where('u.user_id', userId).first();
};

export const createUser = async (data: any) => {
  const [userId] = await db('users').insert(data);

  return userId;
};

export const createVerificationToken = async (data: any) => {
  return db('email_verification_tokens').insert(data);
};

export const findVerificationToken = async (token: string) => {
  return db('email_verification_tokens').where({ token }).first();
};

export const verifyUserEmail = async (userId: number) => {
  return db('users').where({ user_id: userId }).update({
    email_verified: true,
    email_verified_at: db.fn.now()
  });
};

export const deleteVerificationToken = async (token: string) => {
  return db('email_verification_tokens').where({ token }).del();
};

export const markOnboardingCompleted = async (userId: number) => {
  return db('users').where({ user_id: userId }).update({
    onboarding_completed: true,
    updated_at: db.fn.now()
  });
};
