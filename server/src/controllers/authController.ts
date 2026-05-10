import { Request, Response, NextFunction } from 'express';

import {
  createUser,
  findUserByEmail,
  createVerificationToken,
  findVerificationToken,
  verifyUserEmail,
  deleteVerificationToken
} from '../repositories/authRepository';

import { hashPassword, comparePassword } from '../utils/hash';

import { generateRandomToken } from '../utils/token';

import { generateJwtToken } from '../utils/jwt';

import { ApiResponse } from '../types';

import { AppError } from '../middleware/errorHandler';
import { findRoleByName } from '../repositories/roleRepository';
import { assignUserRole } from '../repositories/userRoleRepository';

// SIGNUP
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role, name } = req.body;
    console.log(req.body);

    if (!email || !password || !role) {
      return next(new AppError('Email and password required', 400));
    }

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
      full_name: name
    });

    await assignUserRole(userId, selectedRole.role_id);

    const verificationToken = generateRandomToken();

    await createVerificationToken({
      user_id: userId,
      token: verificationToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
    });

    // TODO: send email here
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
          name: name,
          email,
          role: selectedRole.role_name,
          onboarding_completed: false,
          email_verified: false
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

    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!user.email_verified) {
      return next(new AppError('Please verify your email first', 403));
    }

    const token = generateJwtToken({
      user_id: user.user_id
    });

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
