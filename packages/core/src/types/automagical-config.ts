export type AutomagicalConfig = Partial<{
    autoTranslate?: {
        enabled?: boolean | null
        defaultLocale?: string | null
        locales?: string[] | null
    } | null
    autoText?: {
        enabled?: boolean | null
    } | null
    autoImage?: {
        enabled?: boolean | null
    } | null
    autoSound?: {
        enabled?: boolean | null
    } | null
    updatedAt: Date
}>
