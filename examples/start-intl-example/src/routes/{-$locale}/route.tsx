import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { hasLocale, IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { getMessages } from "@/i18n/messages"
import { routing } from "@/i18n/routing"

const localeMiddleware = createMiddleware().server(
    async ({ next, context }) => {
        console.log("context", context)

        // if (context.params.locale === routing.defaultLocale) {
        //     cookieStore.set("INTL_LOCALE", routing.defaultLocale)
        //     const redirectTo = context.location.href.replace(/^\/en/, "")
        //     throw redirect({ to: redirectTo, params: { locale: "" } })
        // }

        // if (typeof cookieStore !== "undefined") {
        //     cookieStore.set("INTL_LOCALE", locale)
        // } else {
        //     console.error("cookieStore is not available")
        // }

        return next()
    }
)

export const Route = createFileRoute("/{-$locale}")({
    server: {
        middleware: [localeMiddleware]
    },
    beforeLoad: async ({ params: { locale = routing.defaultLocale } }) => {
        // Type-safe locale validation
        if (!hasLocale(routing.locales, locale)) {
            throw notFound()
        }

        const messages = await getMessages(locale)

        return {
            locale,
            messages
        }
    },
    component: LocaleLayoutComponent
})

function LocaleLayoutComponent() {
    const { locale, messages } = Route.useRouteContext()

    return (
        <IntlProvider
            messages={messages}
            locale={locale}
            timeZone="America/Los_Angeles"
        >
            <Header />

            <div className="p-2">
                <Outlet />
            </div>
        </IntlProvider>
    )
}
