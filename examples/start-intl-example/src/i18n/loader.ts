import { notFound, type ParsedLocation, redirect } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { hasLocale, type Locale } from "use-intl"
import { routing } from "./routing"

const detectLocale = createIsomorphicFn()
    .server(() =>
        routing.locales.find((locale) =>
            getRequestHeader("accept-language")?.startsWith(locale)
        )
    )
    .client(() =>
        routing.locales.find((locale) => navigator.language.startsWith(locale))
    )

type BeforeLoadContextType = {
    params: { locale?: string }
    location: ParsedLocation
}

export function beforeLoadIntl({
    params: { locale },
    location
}: BeforeLoadContextType) {
    const { defaultLocale, locales, localePrefix } = routing

    if (locale === defaultLocale && localePrefix === "as-needed") {
        const redirectTo = location.href.replace(
            new RegExp(`^/${defaultLocale}`),
            ""
        )
        throw redirect({ to: redirectTo, params: { locale: "" } })
    }

    if (!hasLocale(locales, locale || defaultLocale)) {
        throw notFound()
    }

    if (!locale && routing.localeDetection !== false) {
        if (locale !== defaultLocale || localePrefix !== "as-needed") {
            const detectedLocale = detectLocale()
            console.log("detectedLocale", detectedLocale)
        }
    }

    const resolvedLocale = locale || routing.defaultLocale

    return resolvedLocale as Locale
}
