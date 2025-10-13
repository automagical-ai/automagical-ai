import { $fetch } from "@automagical-ai/core"
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

    if (!autoTranslate.enabled) {
        throw new Error("AutoTranslate is not enabled")
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
    let translations = await loadTranslations(defaultLocale)

    const currentValue = get(translations, key) as string | undefined
    const messageChanged = currentValue !== message

    if (messageChanged) {
        // If the message has changed, delete it locally from locales
        for (const locale of locales) {
            const translations = await loadTranslations(locale)
            unset(translations, key)

            await saveTranslations(locale, translations)
        }

        // Mark all of these messages as archived on automagical.ai
        if (applicationId) {
            await $fetch(
                `${apiUrl}/api/translations?applicationId=${applicationId}&key=${key}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: {
                        archived: true
                    }
                }
            )
        }
    }

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

        const data = await $fetch<{ result: string }>(endpoint, {
            method: "POST",
            headers: {
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
            },
            body: {
                applicationId,
                key,
                message,
                from: defaultLocale,
                to: locale
            }
        })

        translations = await loadTranslations(locale)
        set(translations, key, data.result)
        await saveTranslations(locale, translations)
    }

    // Update the message locally for the default locale
    translations = await loadTranslations(defaultLocale)
    set(translations, key, message)
    await saveTranslations(defaultLocale, translations)

    // POST this message to automagical.ai/api/translations
    if (applicationId) {
        await $fetch(`${apiUrl}/api/translations`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`
            },
            body: {
                applicationId,
                key,
                message,
                locale: defaultLocale
            }
        })
    }
}
