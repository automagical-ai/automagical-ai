import type { Locale, Messages } from "use-intl"

export const getMessages = async (locale: Locale) =>
    (await import(`../../messages/${locale}.json`)).default as Messages
