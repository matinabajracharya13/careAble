import { UserRole } from '@/config/role';

const routeAccess: Record<string, UserRole[]> = {
  '/assessment': [UserRole.CARER],
  '/assessment/[id]': [UserRole.CARER],
  '/certificate': [UserRole.CARER],
  '/dashboard': [UserRole.CARER],
  '/employer': [UserRole.EMPLOYER],
  '/verify-certificate': [UserRole.EMPLOYER],
  '/profile': [UserRole.CARER, UserRole.EMPLOYER]
};
