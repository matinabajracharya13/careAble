import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters')
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Users ────────────────────────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    required_error: 'Role is required'
  }),
  department: z.string().optional()
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'pending']).optional()
});
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// ─── Settings / Profile ───────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address')
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// ─── Users ────────────────────────────────────────────────────────────────
export const createRoleSchema = z.object({
  role_name: z.string().min(2, 'Role name must be at least 2 characters').max(50),
  description: z.string().min(1, 'Description is required'),
  icon_key: z.string().min(1, 'Icon key is required'),
  label: z.string(),
  is_public_signup: z.boolean().default(false)
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
