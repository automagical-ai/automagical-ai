import type { AutomagicalConfig } from "../types/automagical-config"
import { checkTranslations } from "./check-translations"
import { deleteMessage } from "./delete-message"
import { translateMessage } from "./translate-message"

export function routeHandler({
    request,
    config
}: {
    request: Request
    config: AutomagicalConfig
}) {
    const url = new URL(request.url)
    const slug = url.pathname.split("/").pop()

    switch (slug) {
        case "check-translations":
            return checkTranslations({ request, config })
        case "translate-message":
            return translateMessage({ request, config })
        case "delete-message":
            return deleteMessage({ request, config })
        default:
            return Response.json({ error: "Not found" }, { status: 404 })
    }
}
