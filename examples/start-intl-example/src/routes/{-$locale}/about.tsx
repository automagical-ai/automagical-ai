import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

export const Route = createFileRoute("/{-$locale}/about")({
    component: RouteComponent,
    beforeLoad: async () => {
        console.log("hello worldzzzzzzzzsszzzzzzzzz")
    }
})

function RouteComponent() {
    const t = useTranslations()
    return <main className="container mx-auto p-4">{t("about_message")}</main>
}
