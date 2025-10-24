import { TanStackDevtools } from "@tanstack/react-devtools"
import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts,
    useParams
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { defaultLocale } from "@/i18n/locales"
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
    const { locale } = useParams({ from: "/{-$locale}" })

    return (
        <html lang={locale || defaultLocale} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>

            <body className={`bg-black text-white ${locale}`}>
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
