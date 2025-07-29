import type { AutomagicalConfig } from "@automagical-ai/core"
import { deepDelete } from "../lib/deep-delete"
import { deepGet } from "../lib/deep-get"
import { deepSet } from "../lib/deep-set"
import { loadTranslations } from "./load-translations"
import { saveTranslations } from "./save-translations"

export async function performTranslations({
    key,
    message,
    context,
    config
}: {
    key: string
    message: string
    context?: string
    config: AutomagicalConfig
}) {
    const translations = await loadTranslations(
        config.autoTranslate?.defaultLocale ?? "en"
    )
    const currentValue = deepGet(translations, key) as string | undefined

    deepSet(translations, key, message)
    await saveTranslations(
        config.autoTranslate?.defaultLocale ?? "en",
        translations
    )

    // If the message has changed, clear it from all other locales
    if (currentValue !== message) {
        for (const locale of config.autoTranslate?.locales ?? []) {
            if (locale === config.autoTranslate?.defaultLocale) continue
            const translations = await loadTranslations(locale)

            deepDelete(translations, key)
            await saveTranslations(locale, translations)
        }
    }

    for (const locale of config.autoTranslate?.locales ?? []) {
        if (locale === config.autoTranslate?.defaultLocale) continue
        let translations = await loadTranslations(locale)

        const translation = deepGet(translations, key) as string | undefined
        if (translation) continue

        const endpoint = "https://autotranslate.ai/api/translate"
        console.log(
            `Translating message: ${message} to ${locale} using endpoint: ${endpoint}`
        )
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                message,
                context,
                from: config.autoTranslate?.defaultLocale ?? "en",
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
}
