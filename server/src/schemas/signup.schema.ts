import { z } from 'zod';

export const signupSchema = z
  .object({
    body: z.object({
      phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\d+$/, 'Phone number must contain only numbers'),

      first_name: z
        .string()
        .min(1, 'First name is required')
        .trim(),

      last_name: z
        .string()
        .min(1, 'Last name is required')
        .trim(),

      date_of_birth: z
        .string()
        .min(1, 'Date of birth is required')
        .refine((date) => !isNaN(Date.parse(date)), {
          message: 'Invalid date of birth'
        }),

      postcode: z
        .string()
        .min(1, 'Postcode is required')
        .regex(/^\d+$/, 'Postcode must contain only numbers'),

      email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

      accepted_terms: z
        .boolean()
        .refine((val) => val === true, {
          message: 'You must accept terms of service and privacy policy'
        }),

      research_consent: z
        .boolean()
        .refine((val) => val === true, {
          message: 'Research consent is required'
        })
    })
  })
  .strict();