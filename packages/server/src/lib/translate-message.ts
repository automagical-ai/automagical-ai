import type { AutomagicalConfig } from "@automagical-ai/core"
import { performTranslations } from "./perform-translations"

export async function translateMessage({
    request,
    config
}: {
    request: Request
    config: AutomagicalConfig
}) {
    const { searchParams } = new URL(request.url)

    const key = searchParams.get("key")
    const message = searchParams.get("message")
    const context = searchParams.get("context") ?? undefined

    if (!key || !message) {
        return Response.json(
            { error: "Key and message are required" },
            { status: 400 }
        )
    }

    // If the message is different from the current value, translate it
    await performTranslations({ key, message, context, config })

    return Response.json({
        key,
        message
    })
}
