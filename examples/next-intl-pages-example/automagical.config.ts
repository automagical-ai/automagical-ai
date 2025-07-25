import type { AutomagicalConfig } from "@automagical-ai/core"
import nextConfig from "./next.config"

const automagicalConfig: AutomagicalConfig = {
    apiUrl: "http://localhost:3000",
    autoTranslate: {
        defaultLocale: nextConfig.i18n?.defaultLocale!,
        locales: nextConfig.i18n?.locales!
    }
}

export default automagicalConfig
