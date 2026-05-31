import { Request, Response, NextFunction } from 'express';

import {
  createUser,
  findUserByEmail,
  createVerificationToken,
  findVerificationToken,
  verifyUserEmail,
  deleteVerificationToken,
  findAuthUserByEmail,
  findAuthUserById,
  createPasswordResetToken,
  findPasswordResetToken,
  markResetTokenUsed,
  updateUserPassword
} from '@/repositories/authRepository';
import { sendPasswordResetEmail } from '@/services/email';

import { hashPassword, comparePassword } from '@/utils/hash';

import { generateRandomToken } from '@/utils/token';

import { generateJwtToken } from '@/utils/jwt';

import { ApiResponse } from '@/types';

import { AppError } from '@/middleware/errorHandler';
import { findRoleByName } from '@/repositories/roleRepository';
import { assignUserRole } from '@/repositories/userRoleRepository';
import { baseLogin } from '@/services/auth';
import { loginRules } from '@/utils/authRules';
import userResponse from '@/services/response';
import { logActivity } from '@/repositories/activitiesRepository';
import { activityService } from '@/services/activities';

// SIGNUP
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role, first_name, last_name, phone, date_of_birth, postcode, research_consent, accepted_terms } = req.body;

    const selectedRole = await findRoleByName(role);

    if (!selectedRole) {
      return next(new AppError('Invalid role', 400));
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError('Email already exists', 409));
    }

    const passwordHash = await hashPassword(password);

    const userId = await createUser({
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      phone,
      date_of_birth: date_of_birth,
      postcode,
      accepted_terms,
      research_consent,
      onboarding_completed: false,
      email_verified: true
    });

    await assignUserRole(userId, selectedRole.role_id);
    await activityService.user.registered({ userId, email, role: selectedRole, source: 'web' });
    const verificationToken = generateRandomToken();

    await createVerificationToken({
      user_id: userId,
      token: verificationToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });

    const token = generateJwtToken({
      user_id: userId,
      email,
      role: selectedRole.role_name
    });

    const response: ApiResponse = {
      success: true,
      message: 'Signup successful',
      data: {
        token,
        user: {
          user_id: userId,
          first_name,
          last_name,
          name: `${first_name} ${last_name}`,
          email,
          phone,
          date_of_birth,
          postcode,
          role: selectedRole.role_name,
          onboarding_completed: false,
          // For testing purposes, we set email_verified to true. In production, this should be false until the user verifies their email.
          email_verified: true
        }
      }
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    const verification = await findVerificationToken(token);

    if (!verification) {
      return next(new AppError('Invalid verification token', 400));
    }

    if (new Date(verification.expires_at) < new Date()) {
      return next(new AppError('Verification token expired', 400));
    }

    await verifyUserEmail(verification.user_id);

    await deleteVerificationToken(token);

    const jwtToken = generateJwtToken({
      user_id: verification.user_id
    });

    const response: ApiResponse = {
      success: true,
      message: 'Email verified successfully',
      data: {
        token: jwtToken
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await baseLogin(email, password, loginRules.user);
    console.log(user);
    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse(user)
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findAuthUserById((req as any).user?.user_id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'Current user retrieved successfully',
      data: {
        user: userResponse(user)
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) return next(new AppError('Email is required', 400));

    const user = await findUserByEmail(email);

    if (user) {
      const token = generateRandomToken();
      await createPasswordResetToken(user.user_id, token);
      await sendPasswordResetEmail(email, token);
    }

    res.status(200).json({
      success: true,
      message: 'If that email exists, a reset link has been sent.'
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) return next(new AppError('Token and password are required', 400));

    const record = await findPasswordResetToken(token);

    if (!record) return next(new AppError('Invalid or expired reset link', 400));

    if (new Date(record.expires_at) < new Date()) {
      return next(new AppError('Reset link has expired', 400));
    }

    const passwordHash = await hashPassword(password);
    await updateUserPassword(record.user_id, passwordHash);
    await markResetTokenUsed(token);

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};
