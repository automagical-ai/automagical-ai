import { type ParsedLocation, redirect } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import {
    getRequestHeader,
    setResponseHeader
} from "@tanstack/react-start/server"
import { hasLocale, type Locale } from "use-intl"

import type { LocalePrefixMode, Pathnames, RoutingConfig } from "../routing"
import type { Locales } from "../routing/types"

export function createMiddleware<
    const AppLocales extends Locales,
    const AppLocalePrefixMode extends LocalePrefixMode = "always",
    const AppPathnames extends Pathnames<AppLocales> = never
>(routing: RoutingConfig<AppLocales, AppLocalePrefixMode, AppPathnames>) {
    const detectLocale = createIsomorphicFn()
        .server(() =>
            routing.locales.find((locale) =>
                getRequestHeader("accept-language")?.startsWith(locale)
            )
        )
        .client(() =>
            routing.locales.find((locale) =>
                navigator.language.startsWith(locale)
            )
        )

    const setLocaleCookie = createIsomorphicFn()
        .server(async (locale: Locale) => {
            setResponseHeader("Set-Cookie", `INTL_LOCALE=${locale}`)
        })
        .client(async (locale: Locale) => {
            await cookieStore.set("INTL_LOCALE", locale)
        })

    type BeforeLoadContextType = {
        params: { locale?: string }
        location: ParsedLocation
    }

    async function localeMiddleware({
        params: { locale },
        location
    }: BeforeLoadContextType) {
        const { defaultLocale, locales, localePrefix } = routing

        if (!hasLocale(locales, locale || defaultLocale)) {
            return
        }

        // Always set a cookie if locale is in the URL
        if (locale && routing.localeCookie !== false) {
            await setLocaleCookie(locale as Locale)
        }

        // Remove locale from URL if it's the default and we're using "as-needed" prefix
        if (locale === defaultLocale && localePrefix === "as-needed") {
            const redirectTo = location.href.replace(
                new RegExp(`^/${defaultLocale}`),
                ""
            )
            throw redirect({ to: redirectTo, params: { locale: "" } })
        }

        // Locale detection
        if (!locale && routing.localeDetection !== false) {
            const detectedLocale = detectLocale()

            console.log("detectedLocale", detectedLocale)
            // Only redirect if we detected a locale and it should be shown in the URL
            if (
                detectedLocale &&
                (detectedLocale !== defaultLocale ||
                    localePrefix !== "as-needed")
            ) {
                const redirectTo = `/${detectedLocale}${location.href}`
                throw redirect({ to: redirectTo })
            }
        }
    }

    return {
        localeMiddleware,
        setLocaleCookie,
        detectLocale
    }
}
