import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    rePassword: z.string(),
    phone: z
      .string()
      .regex(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number (e.g. 01012345678)"
      ),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export type PasswordStrength = "Weak" | "Moderate" | "Strong";
