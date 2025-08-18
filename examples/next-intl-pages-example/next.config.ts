import type { NextConfig } from "next"

import automagicalConfig from "./automagical.json"

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    i18n: {
        locales: automagicalConfig.autoTranslate.locales,
        defaultLocale: automagicalConfig.autoTranslate.defaultLocale
    }
}

export default nextConfig
