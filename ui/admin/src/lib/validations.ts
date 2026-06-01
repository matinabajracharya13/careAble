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

/* =========================================================
   ONBOARDING CATEGORY
========================================================= */

export const createCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Icon is required'),
  display_order: z.coerce.number().min(0)
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

/* =========================================================
   ONBOARDING QUESTION
========================================================= */

export const createQuestionSchema = z.object({
  question_text: z.string().min(1, 'Question is required'),

  question_type: z.enum(['single_select', 'multi_select', 'boolean']),

  input_type: z.enum(['radio', 'select', 'multiselect']),

  category_id: z.coerce.number().min(1, 'Category is required'),

  is_required: z.boolean().optional().default(false),

  profile_section: z.string().optional(),

  profile_key: z.string().min(1, 'Profile key is required'),

  profile_label: z.string().optional(),

  // optional future support (role mapping)
  role_ids: z.array(z.number()).optional()
});

export type CreateQuestionFormValues = z.infer<typeof createQuestionSchema>;

export const createAssessmentSchema = z.object({
  title: z.string().min(2, 'Title is required').max(255),

  domain: z.string().min(2, 'Domain is required').max(100),

  description: z.string(),

  version: z.string().optional(),

  is_active: z.boolean().default(true)
});

// ======================================================
// TYPES
// ======================================================

export type CreateAssessmentFormValues = z.infer<typeof createAssessmentSchema>;

export const createOnboardingSchema = z.object({
  role_id: z.coerce.number().min(1, 'Role is required')
});

export type CreateOnboardingFormValues = z.infer<typeof createOnboardingSchema>;
