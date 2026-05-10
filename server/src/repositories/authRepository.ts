import db from '../db';

export const findUserByEmail = async (email: string) => {
  return db('users').where({ email }).first();
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
