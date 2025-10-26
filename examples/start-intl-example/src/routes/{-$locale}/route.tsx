import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"
import { hasLocale, IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { beforeLoadIntl } from "@/i18n/loader"
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
    beforeLoad: async (context) => {
        const locale = beforeLoadIntl(context)

        // Type-safe locale validation
        if (!hasLocale(routing.locales, locale || routing.defaultLocale)) {
            throw notFound()
        }

        const newLocale = hasLocale(routing.locales, locale)
            ? locale
            : routing.defaultLocale

        const messages = await getMessages(newLocale)

        return {
            locale: newLocale,
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
