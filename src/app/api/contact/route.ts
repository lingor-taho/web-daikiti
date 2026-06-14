import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseInquiryInput } from "@/lib/validation/inquiry";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  const parsed = parseInquiryInput(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please check the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const inquiry = await db.inquiry.create({
    data: parsed.data,
    select: {
      id: true,
    },
  });

  return NextResponse.json({
    ok: true,
    inquiryId: inquiry.id,
  });
}
