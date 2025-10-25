import {
    $activeTranslations,
    $automagical,
    createMessageKey,
    deleteTranslation,
    postAutoTranslate
} from "@automagical-ai/core"
import { LoadingText } from "@automagical-ai/react"
import { useStore } from "@nanostores/react"
import { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "use-intl"

export interface AutoTranslateProps {
    children?: string
    dynamic?: boolean
    message?: string
    namespace?: string
    tKey?: string
    values?: Record<string, string | number | Date>
}

export function AutoTranslate({
    children,
    message: messageProp,
    namespace,
    values,
    tKey
}: AutoTranslateProps) {
    const message = messageProp ?? children

    if (message === undefined) {
        throw new Error(
            "AutoTranslate component must have a message or children"
        )
    }

    const t = useTranslations()

    const resolvedTKey = tKey ?? createMessageKey(message)
    const translationKey = namespace
        ? `${namespace}.${resolvedTKey}`
        : resolvedTKey

    if (process.env.NODE_ENV !== "development") {
        return t.has(translationKey) ? t(translationKey, values) : message
    }

    const [previousMessage, setPreviousMessage] = useState(message)

    const locale = useLocale()

    const {
        config: { autoTranslate }
    } = useStore($automagical)
    const defaultLocale = autoTranslate?.defaultLocale

    const activeTranslations = useStore($activeTranslations)
    const isTranslating = activeTranslations.includes(translationKey)

    const needsTranslation = useMemo(
        () =>
            !t.has(translationKey) ||
            (locale === defaultLocale &&
                t(
                    translationKey,
                    values
                        ? Object.fromEntries(
                              Object.keys(values).map((key) => [
                                  key,
                                  `{${key}}`
                              ])
                          )
                        : undefined
                ) !== message) ||
            (locale !== defaultLocale && message !== previousMessage),
        [
            message,
            previousMessage,
            locale,
            t,
            translationKey,
            defaultLocale,
            values
        ]
    )

    const translateMessage = async () => {
        try {
            // Delete the previous translations if it's changed and the key is generated
            if (
                !tKey &&
                previousMessage !== message &&
                (locale !== defaultLocale ||
                    t(translationKey, values) !== message)
            ) {
                const prevMessageKey = createMessageKey(previousMessage)
                const translationKey = namespace
                    ? `${namespace}.${prevMessageKey}`
                    : prevMessageKey

                deleteTranslation(translationKey)
            }

            await postAutoTranslate(translationKey, message)

            setPreviousMessage(message)
        } catch (_) {}
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (!needsTranslation) return

        translateMessage()
    }, [needsTranslation])

    if (isTranslating) {
        return (
            <LoadingText>
                {t.has(translationKey) ? t(translationKey, values) : message}
            </LoadingText>
        )
    }

    return t.has(translationKey) ? t(translationKey, values) : message
}
