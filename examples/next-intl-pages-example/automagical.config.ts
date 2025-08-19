import type { AutomagicalConfig } from "@automagical-ai/core"

const automagicalConfig = {
    autoTranslate: {
        enabled: true,
        defaultLocale: "en",
        locales: ["en", "de"]
    },
    autoText: {
        enabled: true
    },
    autoImage: {
        enabled: true
    },
    updatedAt: new Date(1755594649167)
} as const satisfies AutomagicalConfig

export default automagicalConfig
