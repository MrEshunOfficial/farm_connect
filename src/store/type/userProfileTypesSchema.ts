
import { z } from 'zod';
import { Gender, UserRole } from '@/models/profileI-interfaces';

// Identity Card Types
export const IdentityCardType = z.enum(['Passport', 'Driver License', 'National ID', 'Other']);

export const ImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  fileName: z.string().min(1, "File name is required").refine(
    (name) => {
      const ext = name.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'gif'].includes(ext || '');
    },
    {
      message: 'Invalid file type. Only JPG, PNG, and GIF are allowed',
    }
  )
});

const socialMediaLinksSchema = z.object({
  twitter: z.string().url("Invalid Twitter URL").nullable().optional(),
  facebook: z.string().url("Invalid Facebook URL").nullable().optional(),
  instagram: z.string().url("Invalid Instagram URL").nullable().optional(),
  linkedIn: z.string().url("Invalid LinkedIn URL").nullable().optional()
}).optional();

// Main User Profile Form Schema
export const userProfileFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30, 'Username cannot exceed 30 characters'),
  profilePicture: ImageSchema,
  bio: z.string()
    .trim()
    .max(500, 'Bio cannot exceed 500 characters')
    .optional(),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Please select a valid gender' })
  }),
  phoneNumber: z.string().min(10).max(15),
  country: z.string()
    .trim()
    .min(1, 'Country is required'),
  socialMediaLinks: socialMediaLinksSchema,
  identityCardType: IdentityCardType.optional(),
  identityCardNumber: z.string()
    .trim()
    .min(6, 'ID number must be at least 6 characters')
    .max(20, 'ID number cannot exceed 20 characters')
    .optional(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
});

// Export type for form data
export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;