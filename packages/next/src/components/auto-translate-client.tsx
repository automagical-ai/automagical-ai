"use client"

import { createMessageKey } from "@automagical-ai/core"
import { LoadingText, useAutomagicalConfig } from "@automagical-ai/react"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { AutoTranslateProps } from "./auto-translate"

export function AutoTranslateClient({
    children: message,
    namespace,
    tKey
}: AutoTranslateProps) {
    const t = useTranslations()

    const locale = useLocale()
    const { autoTranslate } = useAutomagicalConfig()
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
            message !== previousMessage,
        [message, previousMessage, locale, t, translationKey, defaultLocale]
    )

    const isTranslatingRef = useRef(false)
    const [isTranslating, setIsTranslating] = useState(false)

    const translateMessage = useCallback(async () => {
        isTranslatingRef.current = true
        setIsTranslating(true)

        // Delete the previous message if it's changed
        if (previousMessage !== message && !tKey) {
            const prevMessageKey = createMessageKey(previousMessage)
            const translationKey = namespace
                ? `${namespace}.${prevMessageKey}`
                : prevMessageKey

            await fetch(
                `/api/auto-translate/delete-message?key=${translationKey}`
            )
        }

        await fetch(
            `/api/auto-translate/translate-message?key=${translationKey}&message=${message}`
        )

        isTranslatingRef.current = false
        setIsTranslating(false)
    }, [previousMessage, message, tKey, namespace, translationKey])

    useEffect(() => {
        setPreviousMessage(message)
    }, [message])

    useEffect(() => {
        if (!needsTranslation) return
        if (isTranslatingRef.current) return

        translateMessage()
    }, [needsTranslation, translateMessage])

    if (isTranslating) {
        return (
            <LoadingText>
                {t.has(translationKey) ? t(translationKey) : message}
            </LoadingText>
        )
    }

    return t.has(translationKey) ? t(translationKey) : message
}
