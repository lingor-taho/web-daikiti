"use server";

import { InquiryStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseInquiryMemoFormData } from "@/lib/validation/inquiry";

function revalidateInquiryPaths(id: number) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}

function inquiryNotFoundMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return "Inquiry was not found.";
  }

  return "Unable to update inquiry.";
}

export async function setInquiryRead(id: number, isRead: boolean): Promise<void> {
  try {
    await db.inquiry.update({
      where: { id },
      data: {
        status: isRead ? InquiryStatus.READ : InquiryStatus.UNREAD,
      },
    });
  } catch (error) {
    throw new Error(inquiryNotFoundMessage(error));
  }

  revalidateInquiryPaths(id);
}

export async function updateInquiryMemo(id: number, formData: FormData): Promise<void> {
  const parsed = parseInquiryMemoFormData(formData);

  if (!parsed.success) {
    throw new Error("Unable to save inquiry memo.");
  }

  try {
    await db.inquiry.update({
      where: { id },
      data: {
        adminMemo: parsed.data.adminMemo,
        status: parsed.data.status,
      },
    });
  } catch (error) {
    throw new Error(inquiryNotFoundMessage(error));
  }

  revalidateInquiryPaths(id);
}
