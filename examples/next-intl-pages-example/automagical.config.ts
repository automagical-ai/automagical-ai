import type { AutomagicalConfig } from "@automagical-ai/core"

const automagicalConfig = {
    autoTranslate: {
        enabled: false,
        defaultLocale: "en",
        locales: ["en", "de"]
    },
    autoText: {
        enabled: true
    },
    autoImage: {
        enabled: true
    },
    updatedAt: new Date(1755683759029)
} as const satisfies AutomagicalConfig

export default automagicalConfig
