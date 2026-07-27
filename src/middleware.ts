import { NextResponse, type NextRequest } from "next/server";

// Exposes the current pathname to Server Components (via a request header) so
// the root layout can render the frontend's <SanityLive /> everywhere EXCEPT
// the embedded Studio at /admin. SanityLive's live-content revalidation calls
// router.refresh() on every mutation, which — inside the Studio — flickers the
// UI, loses scroll position, and closes open modals on upload/edit.
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // Skip static assets; run for page routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
