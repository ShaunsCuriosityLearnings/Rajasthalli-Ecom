import { z } from "zod";

export interface CustomJwtSessionClaims {
  metadata?: {
    role?: "user" | "admin";
  };
}

export const userFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters!" })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10).max(15),
  address: z.string().min(2),
  city: z.string().min(2),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
