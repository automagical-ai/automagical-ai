import type { AutomagicalConfig } from "@automagical-ai/core"
import { deepDelete } from "../lib/deep-delete"
import { loadTranslations } from "./load-translations"
import { saveTranslations } from "./save-translations"

export async function deleteMessage({
    request,
    config
}: {
    request: Request
    config: AutomagicalConfig
}) {
    const { searchParams } = new URL(request.url)

    // key is in dot notation "namespace.key" or even "namespace.key.subkey"
    const key = searchParams.get("key")

    if (!key)
        return Response.json({ error: "Key is required" }, { status: 400 })

    const results = []

    for (const locale of config.autoTranslate?.locales ?? []) {
        const translations = await loadTranslations(locale)

        deepDelete(translations, key)
        await saveTranslations(locale, translations)
        results.push(`Deleted from ${locale}`)
    }

    return Response.json({
        key,
        deleted: results.length > 0,
        results
    })
}
