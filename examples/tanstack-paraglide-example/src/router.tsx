import { createRouter } from "@tanstack/react-router"
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Create a new router instance
export const getRouter = () => {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
        rewrite: {
            input: ({ url }) => deLocalizeUrl(url),
            output: ({ url }) => localizeUrl(url)
        }
    })
}
