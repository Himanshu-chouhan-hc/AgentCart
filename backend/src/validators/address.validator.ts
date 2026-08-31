import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),

  addressLine1: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(255),

  addressLine2: z
    .string()
    .max(255)
    .optional()
    .nullable(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100),

  postalCode: z
    .string()
    .regex(/^[0-9]{6}$/, "Postal code must be exactly 6 digits"),

  country: z
    .string()
    .default("India"),

  isDefault: z
    .boolean()
    .default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;