import { createFileRoute } from "@tanstack/react-router"
import { useTranslation, useSSR } from "react-i18next"
import { localeDetection } from "@/i18n/detection"
import { i18n } from "@/i18n/i18n"
import { loadMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/about")({
    beforeLoad: async (context) => {
        const locale = localeDetection(context)
        
        // Load about namespace messages
        await loadMessages(locale, "about")

        return {
            initialI18nStore: i18n.store.data,
            initialLanguage: locale
        }
    },
    component: About
})

function About() {
    const { initialI18nStore, initialLanguage } = Route.useRouteContext()
    useSSR(initialI18nStore, initialLanguage)
    const { t } = useTranslation("about")

    return (
        <main className="container mx-auto p-4">
            <h1>{t("title")}</h1>
            <p className="mt-4">{t("description")}</p>
            <p>{t("content")}</p>
        </main>
    )
}
