import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { hasLocale, IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { localeDetection, useLocaleDetection } from "@/i18n/detection"
import { getMessages } from "@/i18n/messages"
import { routing } from "@/i18n/routing"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (ctx) => {
        const locale = localeDetection(ctx)

        // Type-safe locale validation
        if (!hasLocale(routing.locales, locale)) {
            throw notFound()
        }

        const messages = await getMessages(locale, "root")

        return {
            locale,
            messages
        }
    },
    component: LocaleLayoutComponent
})

function LocaleLayoutComponent() {
    useLocaleDetection()
    const { locale, messages } = Route.useRouteContext()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return (
        <IntlProvider messages={messages} locale={locale} timeZone={timeZone}>
            <Header />

            <Outlet />
        </IntlProvider>
    )
}
