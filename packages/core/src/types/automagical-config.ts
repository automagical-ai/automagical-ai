import type { AutoTranslateConfig } from "./auto-translate-config"

export type AutomagicalConfig = {
    apiKey?: string
    apiUrl?: string
    appId?: string
    baseUrl?: string
    autoTranslate?: AutoTranslateConfig
}
