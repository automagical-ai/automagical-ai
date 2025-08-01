import { get, set, unset } from "lodash"
import { loadTranslations } from "../lib/load-translations"
import { saveTranslations } from "../lib/save-translations"
import type { RouteParams } from "./route-handler"

export async function autoTranslate({
    body = {},
    config: { autoTranslate },
    options: { apiKey, apiUrl, applicationId }
}: RouteParams<{
    key?: string
    message?: string
}>) {
    const { key, message } = body

    if (!autoTranslate) {
        throw new Error("AutoTranslate config not found")
    }

    if (!key || !message) {
        throw new Error("Key and message are required")
    }

    const { defaultLocale, locales } = autoTranslate

    if (!defaultLocale) {
        throw new Error("Default locale is required")
    }

    if (!locales) {
        throw new Error("Locales are required")
    }

    // Load the existing translations for the default locale
    const translations = await loadTranslations(defaultLocale)

    const currentValue = get(translations, key) as string | undefined

    if (currentValue !== message) {
        // Update the message locally for the default locale
        set(translations, key, message)
        await saveTranslations(defaultLocale, translations)

        // If the message has changed, delete it locally from all other locales
        for (const locale of locales) {
            if (locale === defaultLocale) continue
            const translations = await loadTranslations(locale)

            unset(translations, key)
            await saveTranslations(locale, translations)
        }
    }

    // PUT this message to automagical.ai/api/translations
    // That endpoint will handle updating the existing text and deleting all others if it changed

    // Perform the translations for each locale
    for (const locale of locales) {
        if (locale === defaultLocale) continue
        let translations = await loadTranslations(locale)

        const translation = get(translations, key) as string | undefined
        if (translation) continue

        const endpoint = `${apiUrl}/api/auto-translate`

        console.debug(
            `Translating message: '${message}' from '${defaultLocale}' to '${locale}' using endpoint: ${endpoint}`
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
        set(translations, key, data.result)
        await saveTranslations(locale, translations)
    }
}
