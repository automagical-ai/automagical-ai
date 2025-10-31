import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { useSSR } from "react-i18next"

import { Header } from "@/components/header"
import { localeDetection, useLocaleDetection } from "@/i18n/detection"
import { i18n } from "@/i18n/i18n"
import { addMessages } from "@/i18n/messages"
import { hasLocale } from "@/i18n/routing"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (ctx) => {
        const locale = localeDetection(ctx)

        if (!hasLocale(locale)) {
            throw notFound()
        }

        await i18n.changeLanguage(locale)
        await addMessages(locale, "root")

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
        <>
            <Header />
            <Outlet />
        </>
    )
}
