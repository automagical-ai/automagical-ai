import { cloudflare } from "@cloudflare/vite-plugin"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { tanstackRouterHMR } from "./tanstack-router-hmr"

const config = defineConfig({
    // root: "examples/start-paraglide-example",
    server: {
        host: "0.0.0.0",
        port: 3000
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
        devtoolsJson(),
        tanstackRouterHMR()
    ]
})

export default config
