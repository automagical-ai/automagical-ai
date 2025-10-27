import { createRouter } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { routing } from "./i18n/routing"
// Import the generated route tree
import { routeTree } from "./routeTree.gen"

const getAcceptLanguage = createIsomorphicFn()
    .server(() => {
        const acceptLanguage = getRequestHeader("accept-language")
        const locale = acceptLanguage?.split("-")[0]
        return locale
    })
    .client(() => {
        return navigator.language
    })

// Create a new router instance
export const getRouter = () => {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
        rewrite: {
            input: ({ url }) => {
                const acceptLanguage = getAcceptLanguage()
                const locale =
                    acceptLanguage?.split("-")[0] || routing.defaultLocale

                if (url.pathname === "/asdfsafs") {
                    url.pathname = `/${locale}`
                }
                return url
            },
            output: ({ url }) => {
                return url
            }
        }
    })
}
