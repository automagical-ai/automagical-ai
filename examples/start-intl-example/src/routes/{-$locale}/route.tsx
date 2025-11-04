import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { hasLocale, IntlProvider } from "use-intl"
import { Header } from "@/components/header"
import { localeDetection, useLocaleDetection } from "@/i18n/detection"
import { addMessages, messages } from "@/i18n/messages"
import { routing } from "@/i18n/routing"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (ctx) => {
        const locale = localeDetection(ctx)

        // Type-safe locale validation
        if (!hasLocale(routing.locales, locale)) {
            throw notFound()
        }

        await addMessages(locale, "root")

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

    // HMR Bug Fix: https://github.com/TanStack/router/issues/5714
    const [prevLocale, setPrevLocale] = useState(locale)
    const [prevMessages, setPrevMessages] = useState(messages)

    useEffect(() => {
        if (locale) setPrevLocale(locale)
        if (messages) setPrevMessages(messages)
    }, [locale, messages])

    return (
        <IntlProvider
            messages={messages || prevMessages}
            locale={locale || prevLocale}
            timeZone={timeZone}
        >
            <Header />

            <Outlet />
        </IntlProvider>
    )
}
