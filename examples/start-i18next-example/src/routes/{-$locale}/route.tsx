import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { I18nextProvider, useSSR } from "react-i18next"
import { Header } from "@/components/header"
import { localeDetection, useLocaleDetection } from "@/i18n/detection"
import { i18n } from "@/i18n/i18n"
import { loadMessages } from "@/i18n/messages"
import { type Locale, routing } from "@/i18n/routing"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (ctx) => {
        const locale = localeDetection(ctx)

        if (!routing.locales.includes(locale as Locale)) {
            throw notFound()
        }

        await i18n.changeLanguage(locale)

        const messages = await loadMessages(locale, "root")
        i18n.addResources(locale, "root", messages)

        return {
            i18nStore: i18n.store.data,
            locale
        }
    },
    component: LocaleLayoutComponent
})

function LocaleLayoutComponent() {
    const { i18nStore, locale } = Route.useRouteContext()
    useSSR(i18nStore, locale)
    useLocaleDetection()

    return (
        <I18nextProvider key={locale} i18n={i18n}>
            <Header />
            <Outlet />
        </I18nextProvider>
    )
}
