import type { NextConfig } from "next"

import { autoTranslate } from "./automagical.json"

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    i18n: {
        locales: autoTranslate.locales,
        defaultLocale: autoTranslate.defaultLocale
    }
}

export default nextConfig
