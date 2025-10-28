import { createRouter, redirect } from "@tanstack/react-router"
import { createIsomorphicFn, getRouterInstance } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"

import { routing } from "./i18n/routing"
import { routeTree } from "./routeTree.gen"

const getAcceptLanguage = createIsomorphicFn()
    .server(() => {
        return getRequestHeader("accept-language")
    })
    .client(() => navigator.language)

const ismorphicRedirect = createIsomorphicFn()
    .server((href: string) => {
        if (process.env.TSS_PRERENDERING === "true") return
        throw redirect({ href })
    })
    .client((href: string) => {
        setTimeout(async () => {
            const router = await getRouterInstance()
            router.navigate({ href, replace: true })
        })
    })

export const getRouter = () => {
    return createRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreloadStaleTime: 0,
        rewrite: {
            input: ({ url }) => {
                console.log("rewrite", url.pathname)

                console.log(
                    "process.env.VITE_TEST_VAR",
                    process.env.VITE_TEST_VAR
                )
                console.log(
                    "import.meta.env.VITE_TEST_VAR",
                    import.meta.env.VITE_TEST_VAR
                )

                console.log("process.env.PRIVATE_VAR", process.env.PRIVATE_VAR)
                console.log(
                    "import.meta.env.PRIVATE_VAR",
                    import.meta.env.PRIVATE_VAR
                )

                console.log(
                    "process.env.SECRET_SAUCE",
                    process.env.SECRET_SAUCE
                )
                console.log(
                    "import.meta.env.SECRET_SAUCE",
                    import.meta.env.SECRET_SAUCE
                )
                const acceptLanguage = getAcceptLanguage()
                const locale =
                    acceptLanguage?.split("-")[0] || routing.defaultLocale

                if (url.pathname === "/de") {
                    ismorphicRedirect(`/ja`)
                }

                return url
            }
        },
        hydrate: (dehydrated) => {
            console.log("hydrate", dehydrated)
        }
    })
}
