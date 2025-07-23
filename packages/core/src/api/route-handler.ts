import type { AutomagicalConfig } from "../types/automagical-config"
import { autoTranslate } from "./auto-translate"

export function routeHandler(config: AutomagicalConfig) {
    config.appId = config.appId || process.env.AUTOMAGICAL_APP_ID
    config.apiKey = config.apiKey || process.env.AUTOMAGICAL_API_KEY
    config.apiUrl = config.apiUrl || "https://automagical.ai/api"

    return async (request: Request) => {
        const url = new URL(request.url)
        const method = request.method
        const slug = url.pathname.split("/").pop()

        switch (method) {
            case "POST": {
                const body = await request.json()

                switch (slug) {
                    case "auto-translate":
                        return autoTranslate({ body, config })
                    default:
                        return Response.json(
                            { error: "Not found" },
                            { status: 404 }
                        )
                }
            }
            default:
                return Response.json({ error: "Not found" }, { status: 404 })
        }

        // switch (slug) {
        //     case "check-translations":
        //         return checkTranslations({ request, config })
        //     case "translate-message":
        //         return translateMessage({ request, config })
        //     case "delete-message":
        //         return deleteMessage({ request, config })
        //     default:
        //         return Response.json({ error: "Not found" }, { status: 404 })
        // }
    }
}
