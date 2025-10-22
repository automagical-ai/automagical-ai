// import createMiddleware from "next-intl/middleware"
// import { routing } from "./i18n/routing"

// export default createMiddleware(routing)

// export const config = {
//     // Match all pathnames except for
//     // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//     // - … the ones containing a dot (e.g. `favicon.ico`)
//     matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
// }

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    console.log("accept-language", request.headers.get("accept-language"))
    console.log("NEXT_LOCALE", request.cookies.get("NEXT_LOCALE")?.value)
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
}
