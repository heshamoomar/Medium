import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { syncUser } from "../app/lib/syncUser";

export async function middleware(req: NextRequest) {
  try {
    const { isAuthenticated } = getKindeServerSession();

    if (await isAuthenticated()) {
      await syncUser();
    }
  } catch (err) {
    console.error("❌ Middleware user sync error:", err);
  }

  return NextResponse.next();
}

// Run on all routes except Next internals & static files
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
