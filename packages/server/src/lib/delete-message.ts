import type { AutomagicalConfig } from "@automagical-ai/core"
import { unset } from "lodash"
import { loadTranslations } from "../lib/load-translations"
import { saveTranslations } from "../lib/save-translations"

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

        unset(translations, key)
        await saveTranslations(locale, translations)
        results.push(`Deleted from ${locale}`)
    }

    return Response.json({
        key,
        deleted: results.length > 0,
        results
    })
}
