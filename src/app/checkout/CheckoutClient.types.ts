import * as z from "zod";

export const checkoutSchema = z.object({
  city: z.string().min(2, "City is required"),
  details: z.string().min(5, "Please enter your detailed street address"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type PaymentMethod = "cash" | "online";
