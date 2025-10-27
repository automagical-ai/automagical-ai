import {
    createRouter,
    type RegisteredRouter,
    redirect
} from "@tanstack/react-router"
import { createIsomorphicFn, getRouterInstance } from "@tanstack/react-start"
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

let timeout: NodeJS.Timeout | null = null

const isomorphicNavigate = createIsomorphicFn()
    .server((locale: string) => {
        if (process.env.TSS_PRERENDERING === "true") return
        throw redirect({ href: `/${locale}` })
    })
    .client((locale: string) => {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            const router = getRouterInstance() as RegisteredRouter
            router?.navigate({ href: `/${locale}` })
        })
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

                if (url.pathname === "/") {
                    // url.pathname = `/${locale}`

                    isomorphicNavigate(locale)

                    //const redirectTo = url.pathname
                    // redirect({ to: redirectTo })
                }

                return url
            },
            output: ({ url }) => {
                return url
            }
        }
    })
}
