import { loadTranslations } from "../server/load-translations"
import { saveTranslations } from "../server/save-translations"
import { deepDelete } from "../utils/deep-delete"
import type { RouteParams } from "./route-handler"

export async function deleteTranslations({
    searchParams,
    config: { applicationId, autoTranslate, apiKey, apiUrl }
}: RouteParams) {
    const key = searchParams?.get("key")

    if (!key) {
        return Response.json({ error: "Key is required" }, { status: 400 })
    }

    if (!autoTranslate) {
        return Response.json(
            { error: "Auto translate config not found" },
            { status: 400 }
        )
    }

    const { locales } = autoTranslate

    // Delete the translations locally
    for (const locale of locales) {
        const translations = await loadTranslations(locale)
        deepDelete(translations, key)
        await saveTranslations(locale, translations)
    }

    // Delete the translations from the server
    await fetch(
        `${apiUrl}/api/translations?applicationId=${applicationId}&key=${key}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
            }
        }
    )

    return Response.json({ success: true })
}
