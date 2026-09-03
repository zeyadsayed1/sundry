import * as z from "zod";

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const codeSchema = z.object({
  resetCode: z.string().min(4, "Please enter the verification code"),
});

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type EmailFormData = z.infer<typeof emailSchema>;
export type CodeFormData = z.infer<typeof codeSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

export type ForgotPasswordStep = "email" | "code" | "password";
