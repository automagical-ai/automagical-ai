import { createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"

export const getRouter = () => {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
        rewrite: {
            input: ({ url }) => {
                return url
            }
        },
        hydrate: (dehydrated) => {
            console.log("hydrate", dehydrated)
        }
    })
}
