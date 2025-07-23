"use client"

import { createMessageKey } from "@automagical-ai/core"
import { LoadingText } from "@automagical-ai/react"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { AutoTranslateProps } from "./auto-translate"

export function AutoTranslateClient({
    children: message,
    namespace,
    tKey
}: AutoTranslateProps) {
    const resolvedTKey = tKey ?? createMessageKey(message)
    const [prevMessage, setPrevMessage] = useState(message)

    const locale = useLocale()

    const t = useTranslations()
    const translationKey = namespace
        ? `${namespace}.${resolvedTKey}`
        : resolvedTKey

    const needsTranslation = useMemo(() => {
        const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en"

        return (
            !t.has(translationKey) ||
            (locale === defaultLocale && t(translationKey) !== message) ||
            message !== prevMessage
        )
    }, [message, prevMessage, locale, t, translationKey])

    const isTranslatingRef = useRef(false)
    const [isTranslating, setIsTranslating] = useState(false)

    const translateMessage = useCallback(async () => {
        isTranslatingRef.current = true
        setIsTranslating(true)

        if (prevMessage !== message && !tKey) {
            const prevMessageKey = createMessageKey(prevMessage)
            const translationKey = namespace
                ? `${namespace}.${prevMessageKey}`
                : prevMessageKey

            // delete the message
            await fetch(
                `/api/auto-translate/delete-message?key=${translationKey}`
            )
        }

        await fetch(
            `/api/auto-translate/translate-message?key=${translationKey}&message=${message}`
        )

        isTranslatingRef.current = false
        setIsTranslating(false)
    }, [prevMessage, message, tKey, namespace, translationKey])

    useEffect(() => {
        setPrevMessage(message)
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
