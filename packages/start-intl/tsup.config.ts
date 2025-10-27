import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: [
        "react",
        "react-dom",
        "use-intl",
        "@tanstack/react-router",
        "@tanstack/react-start",
        "@tanstack/react-start/server",
        "#tanstack-router-entry",
        "@tanstack/router"
    ],
    treeshake: true,
    splitting: false
})
