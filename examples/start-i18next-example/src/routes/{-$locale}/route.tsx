import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useSSR } from "react-i18next"
import { Header } from "@/components/header"
import { localeDetection, useLocaleDetection } from "@/i18n/detection"
import { i18n } from "@/i18n/i18n"
import { loadMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (context) => {
        const locale = localeDetection(context)
        await i18n.changeLanguage(locale)

        await loadMessages(locale, "root")

        return {
            initialI18nStore: i18n.store.data,
            initialLanguage: locale
        }
    },
    component: LocaleLayoutComponent
})

function LocaleLayoutComponent() {
    const { initialI18nStore, initialLanguage } = Route.useRouteContext()
    useSSR(initialI18nStore, initialLanguage)
    useLocaleDetection()

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
