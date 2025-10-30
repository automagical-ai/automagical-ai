import { createFileRoute } from "@tanstack/react-router"
import { useSSR, useTranslation } from "react-i18next"
import { localeDetection } from "@/i18n/detection"
import { i18n } from "@/i18n/i18n"
import { loadMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/")({
    beforeLoad: async (context) => {
        const locale = localeDetection(context)

        await loadMessages(locale, "index")

        console.log(i18n.store.data)

        return {
            initialI18nStore: i18n.store.data,
            initialLanguage: locale
        }
    },
    component: Home
})

function Home() {
    const { initialI18nStore, initialLanguage } = Route.useRouteContext()
    useSSR(initialI18nStore, initialLanguage)

    const { t } = useTranslation("index")

    return (
        <main className="container mx-auto p-4">
            <h1>{t("title")}</h1>
            <p className="mt-4">{t("welcome")}</p>
            <p>{t("description")}</p>
        </main>
    )
}
