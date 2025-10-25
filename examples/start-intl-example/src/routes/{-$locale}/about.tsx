import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

export const Route = createFileRoute("/{-$locale}/about")({
    component: RouteComponent
})

function RouteComponent() {
    const t = useTranslations()
    return <div>{t("about_message")}</div>
}
