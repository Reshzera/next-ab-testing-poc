import { NextResponse, NextRequest } from "next/server";
import { Variant, experiments } from "./ab-testing/experiments";

const DAYS_TO_SECONDS = (days: number) => 60 * 60 * 24 * days;
const UID_COOKIE = "user_id";

function pickVariant({ A }: { A: number }): Variant {
  const r = Math.random();
  return r < A ? "variant" : "controller";
}

export function middleware(req: NextRequest) {
  const urlPath = req.nextUrl.pathname;
  const res = NextResponse.next();
  // in real usage, should be fetched from some backend service
  // or derived from some user/session attribute
  const mockUserId = crypto.randomUUID();

  res.cookies.set(UID_COOKIE, mockUserId, {
    sameSite: "lax",
    path: "/",
  });

  for (const exp of experiments) {
    if (!exp.enabled) continue;
    if (!exp.matcher.test(urlPath)) continue;

    const cookieName = `ab_${exp.key}_${mockUserId}`;
    let variant = req.cookies.get(cookieName)?.value as Variant | undefined;

    if (!variant) {
      variant = pickVariant(exp.allocation ?? { A: 0.3 });
      res.cookies.set(cookieName, variant, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: DAYS_TO_SECONDS(exp.cookieMaxAgeDays ?? 30),
      });
    }
  }

  res.headers.set(
    "Vary",
    ["Cookie", req.headers.get("Vary")].filter(Boolean).join(", ")
  );

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
