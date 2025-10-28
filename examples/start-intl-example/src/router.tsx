import { createRouter } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

import { routeTree } from "./routeTree.gen"

const getAcceptLanguage = createIsomorphicFn()
    .server(() => {
        return getRequestHeader("accept-language")
    })
    .client(() => navigator.language)

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
