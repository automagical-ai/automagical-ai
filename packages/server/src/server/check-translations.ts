import type { AutomagicalConfig } from "@automagical-ai/core"
import { deepGet } from "../lib/deep-get"
import { flattenObject } from "../lib/flatten-object"
import { loadTranslations } from "./load-translations"
import { performTranslations } from "./perform-translations"

export async function checkTranslations({
    request,
    config
}: {
    request: Request
    config: AutomagicalConfig
}) {
    // Load translations from the default locale
    const defaultTranslations = await loadTranslations(
        config.autoTranslate?.defaultLocale ?? "en"
    )

    // Get all keys in dot notation
    const allKeys = flattenObject(defaultTranslations)

    // Keep track of processing status
    const results: Array<{ key: string; status: string }> = []

    // Process each key
    for (const key of allKeys) {
        try {
            const message = deepGet(defaultTranslations, key) as string

            if (typeof message === "string") {
                // Perform translation for this key and message
                await performTranslations({
                    key,
                    message,
                    context: undefined,
                    config
                })

                results.push({ key, status: "success" })
            } else {
                results.push({ key, status: "skipped - not a string" })
            }
        } catch (error) {
            console.error(`Error processing translation for key ${key}:`, error)
            results.push({ key, status: "error" })
        }
    }

    return Response.json({
        processed: results.length,
        results
    })
}
