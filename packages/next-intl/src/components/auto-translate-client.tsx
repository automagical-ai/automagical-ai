"use client"

import { createMessageKey } from "@automagical-ai/core"
import { LoadingText, useAutomagicalConfig } from "@automagical-ai/react"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { AutoTranslateProps } from "./auto-translate"

export function AutoTranslateClient({
    children: message,
    namespace,
    values,
    tKey
}: AutoTranslateProps) {
    const t = useTranslations()

    const locale = useLocale()
    const { autoTranslate, baseUrl } = useAutomagicalConfig()
    const defaultLocale = autoTranslate?.defaultLocale

    const [previousMessage, setPreviousMessage] = useState(message)

    const resolvedTKey = tKey ?? createMessageKey(message)
    const translationKey = namespace
        ? `${namespace}.${resolvedTKey}`
        : resolvedTKey

    const needsTranslation = useMemo(
        () =>
            !t.has(translationKey) ||
            (locale === defaultLocale && t(translationKey) !== message) ||
            (locale !== defaultLocale && message !== previousMessage),
        [message, previousMessage, locale, t, translationKey, defaultLocale]
    )

    const isTranslatingRef = useRef(false)
    const [isTranslating, setIsTranslating] = useState(false)

    const translateMessage = useCallback(async () => {
        isTranslatingRef.current = true
        setIsTranslating(true)

        // Delete the previous translations if it's changed and the key is generated
        if (
            !tKey &&
            previousMessage !== message &&
            (locale !== defaultLocale || t(translationKey) !== message)
        ) {
            const prevMessageKey = createMessageKey(previousMessage)
            const translationKey = namespace
                ? `${namespace}.${prevMessageKey}`
                : prevMessageKey

            await fetch(
                `${baseUrl || ""}/api/automagical/translations?key=${translationKey}`,
                {
                    method: "DELETE"
                }
            )
        }

        await fetch(`${baseUrl || ""}/api/automagical/auto-translate`, {
            method: "POST",
            body: JSON.stringify({
                key: translationKey,
                message: message
            })
        })

        isTranslatingRef.current = false
        setPreviousMessage(message)
        setIsTranslating(false)
    }, [
        previousMessage,
        message,
        t,
        tKey,
        namespace,
        translationKey,
        baseUrl,
        locale,
        defaultLocale
    ])

    useEffect(() => {
        if (!needsTranslation) return
        if (isTranslatingRef.current) return

        translateMessage()
    }, [needsTranslation, translateMessage])

    if (isTranslating) {
        return (
            <LoadingText>
                {t.has(translationKey) ? t(translationKey, values) : message}
            </LoadingText>
        )
    }

    return t.has(translationKey) ? t(translationKey, values) : message
}
