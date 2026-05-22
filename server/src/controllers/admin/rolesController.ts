import { AppError } from '@/middleware/errorHandler';
import { createRole, findRoles } from '@/repositories/roleRepository';
import { ApiResponse } from '@/types';
import { NextFunction, Request, Response } from 'express';

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await findRoles();
    if (!messages) {
      return next(new AppError('Messages not found', 404));
    }
    const response: ApiResponse = {
      success: true,
      message: 'Messages retrieved successfully',
      data: messages
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const addRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role_name, icon_key, description, is_public_signup } = req.body;
    await createRole(role_name, description, role_name, icon_key, is_public_signup);

    res.status(201).json({ success: true, message: 'Role added successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation for updating a role
    res.status(200).json({ success: true, message: 'Role updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Implementation for deleting a role
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
};
