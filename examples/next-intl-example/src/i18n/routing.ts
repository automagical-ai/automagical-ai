import { defineRouting } from "next-intl/routing"
import automagicalConfig from "../../automagical.config"

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: automagicalConfig.autoTranslate.locales,

    // Used when no locale matches
    defaultLocale: automagicalConfig.autoTranslate.defaultLocale,

    localePrefix: "as-needed"
})
