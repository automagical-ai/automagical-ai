import { deepDelete } from "../lib/deep-delete"
import { loadTranslations } from "../server/load-translations"
import { saveTranslations } from "../server/save-translations"
import type { RouteParams } from "./route-handler"

export async function deleteTranslations({
    searchParams,
    config: { autoTranslate },
    options: { apiKey, apiUrl, applicationId }
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

    if (!locales) {
        throw new Error("Locales are required")
    }

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
