import { loadTranslations } from "../server/load-translations"
import { saveTranslations } from "../server/save-translations"
import { deepDelete } from "../utils/deep-delete"
import { deepGet } from "../utils/deep-get"
import { deepSet } from "../utils/deep-set"
import type { RouteParams } from "./route-handler"

interface AutoTranslateBody {
    key: string
    message: string
}

export async function autoTranslate({
    request,
    config: { applicationId, autoTranslate, apiKey, apiUrl }
}: RouteParams) {
    const { key, message }: AutoTranslateBody = await request.json()

    if (!autoTranslate) {
        return Response.json(
            { error: "Auto translate config not found" },
            { status: 400 }
        )
    }

    const { defaultLocale, locales } = autoTranslate

    // Load the existing translations for the default locale
    const translations = await loadTranslations(defaultLocale)

    const currentValue = deepGet(translations, key) as string | undefined

    if (currentValue !== message) {
        // Update the message locally for the default locale
        deepSet(translations, key, message)
        await saveTranslations(defaultLocale, translations)

        // If the message has changed, delete it locally from all other locales
        for (const locale of locales) {
            if (locale === defaultLocale) continue
            const translations = await loadTranslations(locale)

            deepDelete(translations, key)
            await saveTranslations(locale, translations)
        }
    }

    // PUT this message to automagical.ai/api/translations
    // That endpoint will handle updating the existing text and deleting all others if it changed

    // Perform the translations for each locale
    for (const locale of locales) {
        if (locale === defaultLocale) continue
        let translations = await loadTranslations(locale)

        const translation = deepGet(translations, key) as string | undefined
        if (translation) continue

        const endpoint = `${apiUrl}/api/auto-translate`

        console.info(
            `Translating message: ${message} to ${locale} using endpoint: ${endpoint}`
        )

        // TODO Attach the API Key using bearer
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
            },
            body: JSON.stringify({
                applicationId,
                key,
                message,
                from: defaultLocale,
                to: locale
            })
        })

        const data = await response.json()
        if (!data.result) {
            console.error(`Error translating message: ${message}`, data)
            continue
        }

        translations = await loadTranslations(locale)
        deepSet(translations, key, data.result)
        await saveTranslations(locale, translations)
    }

    return Response.json({ success: true })
}
