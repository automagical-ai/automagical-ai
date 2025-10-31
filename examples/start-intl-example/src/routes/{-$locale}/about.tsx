import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl"
import { getMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/about")({
    beforeLoad: async ({ context: { locale, messages } }) => {
        const aboutMessages = await getMessages(locale, "about")
        Object.assign(messages, aboutMessages)
    },
    component: AboutPage
})

function AboutPage() {
    const t = useTranslations("about")
    return <main className="container mx-auto p-4">{t("about_page")}</main>
}
