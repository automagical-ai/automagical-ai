import { TanStackDevtools } from "@tanstack/react-devtools"
import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
    useRouteContext
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import { routing } from "../i18n/routing"
import appStyles from "../styles/app.css?url"

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                title: "TanStack Start Starter"
            }
        ],
        links: [{ rel: "stylesheet", href: appStyles }]
    }),

    shellComponent: RootDocument
})

function RootDocument() {
    const { locale } = useRouteContext({ strict: false })

    return (
        <html lang={locale || routing.defaultLocale} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>

            <body className="bg-black text-white">
                <Outlet />

                <TanStackDevtools
                    config={{
                        position: "bottom-left"
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />
                        }
                    ]}
                />

                <Scripts />
            </body>
        </html>
    )
}
