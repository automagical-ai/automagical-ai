import { loadTranslations } from "../server/load-translations"
import { saveTranslations } from "../server/save-translations"
import type { AutomagicalConfig } from "../types/automagical-config"
import { deepDelete } from "../utils/deep-delete"
import { deepGet } from "../utils/deep-get"
import { deepSet } from "../utils/deep-set"

interface AutoTranslateParams {
    body: {
        key: string
        message: string
    }
    config: AutomagicalConfig
}

export async function autoTranslate({
    body: { key, message },
    config: { appId, autoTranslate, apiKey, apiUrl }
}: AutoTranslateParams) {
    appId = appId || process.env.AUTOMAGICAL_APP_ID
    apiKey = apiKey || process.env.AUTOMAGICAL_API_KEY
    apiUrl = apiUrl || "https://automagical.ai/api"

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

    // POST this message to automagical.ai/api/translations
    // That endpoint will handle updating the existing text and deleting all others if it changed

    // Perform the translations for each locale
    for (const locale of locales) {
        if (locale === defaultLocale) continue
        let translations = await loadTranslations(locale)

        const translation = deepGet(translations, key) as string | undefined
        if (translation) continue

        const endpoint = "https://automagical.ai/api/auto-translate"

        console.log(
            `Translating message: ${message} to ${locale} using endpoint: ${endpoint}`
        )

        // TODO Attach the API Key using bearer
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                appId,
                message,
                defaultLocale,
                locale
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
}
