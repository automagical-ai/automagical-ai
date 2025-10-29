import { defineRouting } from "@automagical-ai/start-intl"

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "de", "ja"],

    // Used when no locale matches
    defaultLocale: "en",

    localePrefix: "as-needed"
})
