import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { defaultLocale, type Locale, locales } from "@/i18n/locales"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async ({ params }) => {
        const locale = (params.locale as Locale) || defaultLocale

        // Type-safe locale validation
        if (!locales.includes(locale)) {
            throw redirect({
                to: "/{-$locale}",
                params: { locale: "" }
            })
        }

        const messages = (await import(`../../../messages/${locale}.json`))
            .default

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
