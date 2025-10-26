import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import type { Locale } from "use-intl"
import type { Locales } from "../routing/types"

export function getAcceptLanguageLocale<AppLocales extends Locales>(
    acceptLanguage: string,
    locales: AppLocales,
    defaultLocale: Locale
) {
    let locale = defaultLocale

    const languages = new Negotiator({
        headers: {
            "accept-language": acceptLanguage
        }
    }).languages()
    try {
        const orderedLocales = orderLocales(locales)
        locale = match(languages, orderedLocales, defaultLocale)
    } catch (error) {
        // Invalid language
        console.error(error)
    }

    return locale
}

function orderLocales<AppLocales extends Locales>(locales: AppLocales) {
    // Workaround for https://github.com/formatjs/formatjs/issues/4469
    return locales.slice().sort((a, b) => b.length - a.length)
}
