import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"
import viteTsConfigPaths from "vite-tsconfig-paths"

const config = defineConfig({
    // root: "examples/start-intl-example",
    server: {
        host: "0.0.0.0",
        port: 3000
    },
    plugins: [
        viteTsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: true
            }
        }),
        viteReact(),
        devtoolsJson()
    ]
})

export default config
