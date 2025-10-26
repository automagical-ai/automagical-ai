import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { hasLocale, IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { getMessages } from "@/i18n/messages"
import { localeMiddleware } from "@/i18n/middleware"
import { routing } from "@/i18n/routing"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (context) => {
        await localeMiddleware(context)

        const locale = context.params.locale || routing.defaultLocale

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
