import { PublishStatus } from "@prisma/client";
import { z } from "zod";

const optionalImagePath = z.string().trim().optional().or(z.literal(""));

export const customCaseSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください。"),
  slug: z
    .string()
    .trim()
    .min(1, "スラッグを入力してください。")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "半角英数字とハイフンで入力してください。"),
  brandId: z.coerce.number().int().positive("ブランドを選択してください。"),
  modelName: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().min(1, "概要を入力してください。"),
  coverImage: z.string().trim().min(1, "カバー画像を入力してください。"),
  beforeImage: optionalImagePath,
  afterImage: optionalImagePath,
  content: z.string().trim().min(1, "本文を入力してください。"),
  galleryJson: z.string().trim().default("[]"),
  status: z.enum(PublishStatus),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  categoryIds: z.array(z.coerce.number().int().positive()).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type CustomCaseInput = z.infer<typeof customCaseSchema>;
