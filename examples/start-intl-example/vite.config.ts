import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { tanstackRouterHMR } from "./tanstack-router-hmr"

const config = defineConfig({
    // root: "examples/start-intl-example",
    server: {
        port: 3000
    },
    plugins: [
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: false
            }
        }),
        viteReact(),
        devtoolsJson(),
        tanstackRouterHMR()
    ]
})

export default config
