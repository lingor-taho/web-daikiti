import { NextResponse, type NextRequest } from "next/server";

import { isValidAdminAuth } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  if (isValidAdminAuth(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="DKT Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
