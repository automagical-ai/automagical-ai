export type AutomagicalConfig = {
    apiKey?: string
    apiUrl?: string
    appId?: string
    autoTranslate?: {
        defaultLocale: string
        locales: readonly string[]
        translateEndpoint?: string
    }
}
