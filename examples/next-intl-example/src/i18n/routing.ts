import { defineRouting } from "next-intl/routing"
import { autoTranslate } from "@/../automagical.json"

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: autoTranslate.locales,

    // Used when no locale matches
    defaultLocale: autoTranslate.defaultLocale,

    localePrefix: "as-needed"
})
