import {
    type ParsedLocation,
    type Redirect,
    redirect,
    useLocation,
    useParams,
    useRouter
} from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import {
    getRequestHeader,
    getRequestProtocol,
    setResponseHeader
} from "@tanstack/react-start/server"
import { useEffect } from "react"
import { hasLocale, type Locale } from "use-intl"
import type { LocalePrefixMode, Pathnames, RoutingConfig } from "../routing"
import { receiveRoutingConfig } from "../routing/config"
import type { Locales } from "../routing/types"
import { getLocalePrefix } from "../shared/utils"
import { getAcceptLanguageLocale } from "./resolve-locale"
import {
    formatPathname,
    getNormalizedPathname,
    sanitizePathname
} from "./utils"

export function createMiddleware<
    const AppLocales extends Locales,
    const AppLocalePrefixMode extends LocalePrefixMode = "always",
    const AppPathnames extends Pathnames<AppLocales> = never
>(routing: RoutingConfig<AppLocales, AppLocalePrefixMode, AppPathnames>) {
    const resolvedRouting = receiveRoutingConfig(routing)

    const detectLocale = createIsomorphicFn()
        .server(() =>
            getAcceptLanguageLocale(
                getRequestHeader("accept-language") ?? "",
                routing.locales,
                routing.defaultLocale
            )
        )
        .client(() =>
            getAcceptLanguageLocale(
                navigator.language,
                routing.locales,
                routing.defaultLocale
            )
        )

    const setLocaleCookie = createIsomorphicFn()
        .server((locale: Locale) => {
            if (!resolvedRouting.localeCookie) return

            const { name, sameSite, domain, partitioned, maxAge } =
                resolvedRouting.localeCookie

            const hasLocaleCookie =
                getRequestHeader("cookie")
                    ?.split("; ")
                    .find((cookie) => cookie.startsWith(`${name}=`))
                    ?.split("=")[1] === locale

            if (hasLocaleCookie) return

            let cookieString = `${name}=${locale}`
            cookieString += `; Path=/`
            cookieString += `; SameSite=${sameSite}` // sameSite is required
            if (domain) cookieString += `; Domain=${domain}`
            if (partitioned) cookieString += `; Partitioned` // Boolean flag, no value
            if (maxAge) cookieString += `; Max-Age=${maxAge};`

            if (getRequestProtocol() === "https") {
                cookieString += `; Secure`
            }

            setResponseHeader("Set-Cookie", cookieString)
        })
        .client((locale: Locale) => {
            if (!resolvedRouting.localeCookie) return

            const { name, sameSite, domain, partitioned, maxAge } =
                resolvedRouting.localeCookie

            let cookieString = `${name}=${locale}`
            cookieString += `; Path=/`
            if (sameSite) cookieString += `; SameSite=${sameSite}`
            if (domain) cookieString += `; Domain=${domain}`
            if (partitioned) cookieString += `; Partitioned`
            if (maxAge) {
                cookieString += `; Max-Age=${maxAge}`
            }

            // In production, add Secure flag
            if (window.location.protocol === "https:") {
                cookieString += `; Secure`
            }

            // biome-ignore lint/suspicious/noDocumentCookie: Safari
            document.cookie = cookieString
        })

    const getLocaleFromCookie = createIsomorphicFn()
        .server(() => {
            if (!resolvedRouting.localeCookie) return

            const { name } = resolvedRouting.localeCookie

            const cookieLocale = getRequestHeader("cookie")
                ?.split("; ")
                .find((cookie) => cookie.startsWith(`${name}=`))
                ?.split("=")[1]

            return cookieLocale
        })
        .client(() => {
            if (!resolvedRouting.localeCookie) return
            const { name } = resolvedRouting.localeCookie

            // Read cookie from document.cookie
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith(`${name}=`))
                ?.split("=")[1]

            return cookieValue
        })

    type LocaleMiddlewareContextType = {
        params: { locale?: string }
        location: ParsedLocation
    }

    function localeMiddleware<TContext extends LocaleMiddlewareContextType>({
        params: { locale },
        location
    }: TContext): string {
        const { defaultLocale, locales, localePrefix } = resolvedRouting

        // Skip middleware if the locale is invalid
        if (!hasLocale(locales, locale || defaultLocale)) {
            return locale || defaultLocale
        }

        // Always set a cookie if locale is in the URL
        if (locale && routing.localeCookie !== false) {
            setLocaleCookie(locale as Locale)
        }

        // Parse the current pathname
        let unsafeExternalPathname: string
        try {
            // Resolve potential foreign symbols (e.g. /ja/%E7%B4%84 → /ja/約))
            unsafeExternalPathname = decodeURI(location.pathname)
        } catch (error) {
            console.log(error)
            return locale || defaultLocale
        }

        // Sanitize malicious URIs to prevent open redirect attacks due to
        // decodeURI doesn't escape encoded backslashes ('%5C' & '%5c')
        const externalPathname = sanitizePathname(unsafeExternalPathname)

        const unprefixedExternalPathname = getNormalizedPathname(
            externalPathname,
            resolvedRouting.locales,
            resolvedRouting.localePrefix
        )

        // Remove locale from URL if it's the default and we're using "as-needed" prefix
        if (locale === defaultLocale && localePrefix.mode === "as-needed") {
            const redirectTo =
                unprefixedExternalPathname + location.searchStr + location.hash

            throw redirect({ to: redirectTo })
        }

        // Locale is in the URL, so we don't need to do anything
        if (locale) return locale

        // Return default locale if locale detection is disabled
        if (routing.localeDetection === false) {
            return defaultLocale
        }

        // Prefer the locale from the cookie if enabled, otherwise detect it
        const nextLocale =
            (routing.localeCookie !== false && getLocaleFromCookie()) ||
            detectLocale()

        // Return default locale if the locale is invalid
        if (!hasLocale(locales, nextLocale)) {
            return defaultLocale
        }

        // Skip redirect if the locale is the default and we're using "as-needed" prefix
        if (nextLocale === defaultLocale && localePrefix.mode === "as-needed")
            return nextLocale

        if (localePrefix.mode === "never") return nextLocale

        const redirectTo = formatPathname(
            unprefixedExternalPathname,
            getLocalePrefix(nextLocale, resolvedRouting.localePrefix),
            location.searchStr + location.hash
        )

        throw redirect({ to: redirectTo })
    }

    const useLocaleMiddleware = () => {
        const router = useRouter()
        const { locale: localeParam } = useParams({ strict: false })
        const location = useLocation()

        // biome-ignore lint/correctness/useExhaustiveDependencies: Ignore dis
        useEffect(() => {
            try {
                localeMiddleware({ params: { locale: localeParam }, location })
            } catch (redirect) {
                router.navigate({
                    to: (redirect as Redirect).options.to,
                    replace: true
                })
            }
        }, [])
    }

    return {
        localeMiddleware,
        useLocaleMiddleware,
        setLocaleCookie,
        detectLocale
    }
}
