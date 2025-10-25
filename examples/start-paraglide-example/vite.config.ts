import { cloudflare } from "@cloudflare/vite-plugin"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
    server: {
        port: 3001
    },
    plugins: [
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/paraglide",
            outputStructure: "message-modules",
            cookieName: "PARAGLIDE_LOCALE",
            strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
            urlPatterns: [
                {
                    pattern: "/",
                    localized: [
                        ["en", "/en"],
                        ["de", "/de"]
                    ]
                },
                {
                    pattern: "/:path(.*)?",
                    localized: [
                        ["en", "/en/:path(.*)?"],
                        ["de", "/de/:path(.*)?"]
                    ]
                }
            ]
        }),
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        devtoolsJson()
    ]
})

export default config
