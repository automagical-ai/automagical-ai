import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { addMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/about")({
    beforeLoad: async ({ context: { locale } }) => {
        await addMessages(locale, "about")
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
