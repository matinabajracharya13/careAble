import { Request } from 'express';
import { UserRole } from '@/enums/user-role';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  };
}
