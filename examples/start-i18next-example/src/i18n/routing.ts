import { defineRouting } from "@automagical-ai/start-i18n"

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "de", "ja"],

    // Used when no locale matches
    defaultLocale: "en",

    localePrefix: "as-needed"
})

export type Locales = typeof routing.locales
export type Locale = Locales[number]

export function hasLocale(candidate: string): candidate is Locale {
    return routing.locales.includes(candidate as Locale)
}
