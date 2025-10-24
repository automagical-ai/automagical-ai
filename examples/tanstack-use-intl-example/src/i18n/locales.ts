export const defaultLocale = "en"
export const locales = ["en", "de", "ja"] as const

export type Locale = (typeof locales)[number]
