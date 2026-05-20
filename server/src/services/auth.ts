import { AppError } from '@/middleware/errorHandler';
import { findAuthUserByEmail } from '@/repositories/authRepository';
import { comparePassword } from '@/utils/hash';
import { generateJwtToken } from '@/utils/jwt';

export const baseLogin = async (email: string, password: string, rules: any) => {
  const user = await findAuthUserByEmail(email);
  console.log('Found user:', user); // Debugging log
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.email_verified) {
    throw new AppError('Please verify your email first', 403);
  }

  const token = generateJwtToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role
  });

  return { user, token };
};
