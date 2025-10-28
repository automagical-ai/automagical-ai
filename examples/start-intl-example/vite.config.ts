import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"

const isPrerender = process.env.PRERENDER === "true"

const config = defineConfig({
    build: {
        assetsDir: "dist/client",
        outDir: isPrerender ? "dist/client/dist" : "dist"
    },
    server: {
        port: 3001
    },
    plugins: [
        !isPrerender
            ? cloudflare({ viteEnvironment: { name: "ssr" } })
            : undefined,
        // netlify(),
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: isPrerender
            }
        }),
        viteReact(),
        devtoolsJson()
    ]
})

export default config
