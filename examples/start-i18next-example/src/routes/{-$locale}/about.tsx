import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { i18n } from "@/i18n/i18n"
import { loadMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/about")({
    beforeLoad: async ({ context: { locale } }) => {
        const messages = await loadMessages(locale, "about")
        i18n.addResources(locale, "about", messages)
    },
    component: About
})

function About() {
    const { t } = useTranslation("about")

    return (
        <main className="container mx-auto p-4">
            <h1>{t("about_page")}</h1>
        </main>
    )
}
