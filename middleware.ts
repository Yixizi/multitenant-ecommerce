

// import { getPayload } from "payload";
// import payloadConfig from "@payload-config";
// import { headers as getHeaders } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith("/library")) {
//     // const payload = await getPayload({ config: payloadConfig });
//     const headers = await getHeaders();
//     // const session = await payload.auth({ headers });
//     if (!session.user) {
//       return NextResponse.redirect(new URL("/sign-in", request.nextUrl.origin));
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt (metadata files)
//      */
//     "/library/:path*",
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };
