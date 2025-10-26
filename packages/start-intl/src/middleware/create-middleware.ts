import { type ParsedLocation, redirect } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import {
    getRequestHeader,
    getRequestProtocol,
    setResponseHeader
} from "@tanstack/react-start/server"
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
        .server(async (locale: Locale) => {
            if (!resolvedRouting.localeCookie) return

            const { name, sameSite, domain, partitioned, maxAge } =
                resolvedRouting.localeCookie

            const hasLocaleCookie =
                getRequestHeader("cookie")
                    ?.split("; ")
                    .find((cookie) => cookie.startsWith(`${name}=`))
                    ?.split("=")[1] === locale

            console.log("hasLocaleCookie", hasLocaleCookie)

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
        .client(async (locale: Locale) => {
            if (!resolvedRouting.localeCookie) return

            const { name, sameSite, domain, partitioned, maxAge } =
                resolvedRouting.localeCookie

            // Build the cookie string for document.cookie
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
        .server(async () => {
            if (!resolvedRouting.localeCookie) return

            const { name } = resolvedRouting.localeCookie

            const hasLocaleCookie = getRequestHeader("cookie")
                ?.split("; ")
                .find((cookie) => cookie.startsWith(`${name}=`))

            console.log("hasLocaleCookie", hasLocaleCookie)
            const cookieLocale = getRequestHeader("cookie")
                ?.split("; ")
                .find((cookie) => cookie.startsWith(`${name}=`))
                ?.split("=")[1]

            console.log("locale from cookie", cookieLocale)
            return cookieLocale
        })
        .client(async () => {
            if (!resolvedRouting.localeCookie) return
            const { name } = resolvedRouting.localeCookie

            // Read cookie from document.cookie
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith(`${name}=`))
                ?.split("=")[1]

            return cookieValue
        })

    type BeforeLoadContextType = {
        params: { locale?: string }
        location: ParsedLocation
    }

    async function localeMiddleware({
        params: { locale },
        location
    }: BeforeLoadContextType) {
        const { defaultLocale, locales, localePrefix } = resolvedRouting

        if (!hasLocale(locales, locale || defaultLocale)) {
            return
        }

        // Always set a cookie if locale is in the URL
        if (locale && routing.localeCookie !== false) {
            await setLocaleCookie(locale as Locale)

            const cookieLocale = await getLocaleFromCookie()

            console.log("cookie locale", cookieLocale)
        }

        let unsafeExternalPathname: string
        try {
            // Resolve potential foreign symbols (e.g. /ja/%E7%B4%84 → /ja/約))
            unsafeExternalPathname = decodeURI(location.pathname)
        } catch (error) {
            // In case an invalid pathname is encountered, forward
            console.log(error)
            return
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
        if (locale) return

        if (routing.localeDetection === false) return

        if (routing.localeCookie !== false) {
            const cookieLocale = await getLocaleFromCookie()

            // Only redirect if we have a cookie locale and it should be shown in the URL
            if (cookieLocale) {
                if (
                    cookieLocale === defaultLocale &&
                    localePrefix.mode === "as-needed"
                )
                    return

                const redirectTo = formatPathname(
                    unprefixedExternalPathname,
                    getLocalePrefix(cookieLocale, resolvedRouting.localePrefix),
                    location.searchStr + location.hash
                )

                throw redirect({ to: redirectTo })
            }
        }

        // Locale detection
        const detectedLocale = detectLocale()

        // Only redirect if we detected a locale and it should be shown in the URL
        if (
            detectedLocale &&
            (detectedLocale !== defaultLocale ||
                localePrefix.mode !== "as-needed")
        ) {
            const redirectTo = formatPathname(
                unprefixedExternalPathname,
                getLocalePrefix(detectedLocale, resolvedRouting.localePrefix),
                location.searchStr + location.hash
            )

            throw redirect({ to: redirectTo })
        }
    }

    return {
        localeMiddleware,
        setLocaleCookie,
        detectLocale
    }
}
