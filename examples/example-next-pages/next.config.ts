import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    i18n: {
        locales: ["en", "de"],
        defaultLocale: "en"
    }
} as const

export default nextConfig
