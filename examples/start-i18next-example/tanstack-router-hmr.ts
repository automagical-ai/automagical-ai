import type { Plugin } from "vite"

export function tanstackRouterHMR(): Plugin {
    return {
        name: "tanstack-router-hmr",
        enforce: "post",
        handleHotUpdate(ctx) {
            for (const mod of ctx.server.moduleGraph.idToModuleMap.values()) {
                if (mod.id?.includes("/router.ts")) {
                    return [mod]
                }
            }
        }
    }
}
