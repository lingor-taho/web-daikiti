import type { NextRequest } from "next/server";

import { middleware } from "../middleware";

export function proxy(request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
