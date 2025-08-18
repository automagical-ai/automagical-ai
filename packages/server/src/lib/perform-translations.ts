import { $fetch, type AutomagicalConfig } from "@automagical-ai/core"
import { get, set, unset } from "lodash"
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
    const currentValue = get(translations, key) as string | undefined

    set(translations, key, message)
    await saveTranslations(
        config.autoTranslate?.defaultLocale ?? "en",
        translations
    )

    // If the message has changed, clear it from all other locales
    if (currentValue !== message) {
        for (const locale of config.autoTranslate?.locales ?? []) {
            if (locale === config.autoTranslate?.defaultLocale) continue
            const translations = await loadTranslations(locale)

            unset(translations, key)
            await saveTranslations(locale, translations)
        }
    }

    for (const locale of config.autoTranslate?.locales ?? []) {
        if (locale === config.autoTranslate?.defaultLocale) continue
        let translations = await loadTranslations(locale)

        const translation = get(translations, key) as string | undefined
        if (translation) continue

        const endpoint = "https://autotranslate.ai/api/translate"

        console.log(
            `Translating message: ${message} to ${locale} using endpoint: ${endpoint}`
        )

        const data = await $fetch<{ result: string }>(endpoint, {
            method: "POST",
            body: JSON.stringify({
                message,
                context,
                from: config.autoTranslate?.defaultLocale ?? "en",
                to: locale
            })
        })

        translations = await loadTranslations(locale)
        set(translations, key, data.result)
        await saveTranslations(locale, translations)
    }
}
