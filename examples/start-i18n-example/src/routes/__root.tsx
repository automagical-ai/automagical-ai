import { TanStackDevtools } from "@tanstack/react-devtools"
import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
    useParams
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
    const { locale } = useParams({ strict: false })

    return (
        <html lang={locale || routing.defaultLocale}>
            <head>
                <HeadContent />
            </head>

            <body>
                <Outlet />

                <TanStackDevtools
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
