import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

import { routing } from "./src/i18n/routing"

const locales = routing.locales
const defaultLocale = routing.defaultLocale

// Create regex pattern to match paths that DON'T start with any locale or Next.js routes
// Similar to middleware matcher: /((?!api|trpc|_next|_vercel|.*\\..*).*)
// But with :path capture for rewrites/redirects
const skipPattern = `/:path((?!(?:${locales.join("|")}|api|trpc|_next|_vercel)(?:/|$)|.*\\..*).*)`

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                // Match any path that doesn't start with a locale prefix
                // e.g., /about, /contact, / but NOT /en/about or /de/contact
                source: skipPattern,
                destination: `/${defaultLocale}/:path*`
            }
        ]
    },
    redirects: async () => {
        return [
            {
                source: `/${defaultLocale}`,
                destination: `/`,
                permanent: true
            },
            {
                source: `/${defaultLocale}/:path*`,
                destination: `/:path*`,
                permanent: true
            },
            ...locales
                .filter((locale) => locale !== defaultLocale)
                .map((locale) => ({
                    source: skipPattern,
                    destination: `/${locale}/:path*`,
                    permanent: false,
                    has: [
                        {
                            type: "cookie" as const,
                            key: "NEXT_LOCALE",
                            value: locale
                        }
                    ]
                })),
            ...locales
                .filter((locale) => locale !== defaultLocale)
                .map((locale) => ({
                    source: skipPattern,
                    destination: `/${locale}/:path*`,
                    permanent: false,
                    has: [
                        {
                            type: "header" as const,
                            key: "accept-language",
                            // regex to match the locale with optional region code
                            value: `${locale}(-[A-Z]{2})?\\b`
                        }
                    ],
                    missing: [
                        {
                            type: "cookie" as const,
                            key: "NEXT_LOCALE"
                        }
                    ]
                }))
        ]
    }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
