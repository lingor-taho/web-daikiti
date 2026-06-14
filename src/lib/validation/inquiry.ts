import { InquiryStatus } from "@prisma/client";
import { z } from "zod";

const optionalTrimmedText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed.length > 0 ? trimmed : null;
  });

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(180, "Email is too long."),
  phone: optionalTrimmedText,
  inquiryType: optionalTrimmedText,
  message: z.string().trim().min(1, "Message is required.").max(4000, "Message is too long."),
});

export const inquiryMemoSchema = z.object({
  status: z.enum(InquiryStatus),
  adminMemo: optionalTrimmedText,
});

export function parseInquiryInput(input: unknown) {
  return inquirySchema.safeParse(input);
}

export function parseInquiryRequestFormData(formData: FormData) {
  return parseInquiryInput(Object.fromEntries(formData.entries()));
}

export function parseInquiryMemoFormData(formData: FormData) {
  return inquiryMemoSchema.safeParse(Object.fromEntries(formData.entries()));
}

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryMemoInput = z.infer<typeof inquiryMemoSchema>;
