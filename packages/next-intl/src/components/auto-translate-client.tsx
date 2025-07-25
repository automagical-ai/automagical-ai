"use client"

import { createMessageKey } from "@automagical-ai/core"
import { LoadingText, useAutomagicalContext } from "@automagical-ai/react"
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
    const {
        setActiveTranslations,
        baseURL,
        config: { autoTranslate }
    } = useAutomagicalContext()

    const defaultLocale = autoTranslate?.defaultLocale

    const [previousMessage, setPreviousMessage] = useState(message)

    const resolvedTKey = tKey ?? createMessageKey(message)
    const translationKey = namespace
        ? `${namespace}.${resolvedTKey}`
        : resolvedTKey

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

    const isTranslatingRef = useRef(false)
    const [isTranslating, setIsTranslating] = useState(false)

    const translateMessage = useCallback(async () => {
        isTranslatingRef.current = true
        setIsTranslating(true)

        setActiveTranslations((prev: string[]) => [...prev, translationKey])

        // Delete the previous translations if it's changed and the key is generated
        if (
            !tKey &&
            previousMessage !== message &&
            (locale !== defaultLocale || t(translationKey, values) !== message)
        ) {
            const prevMessageKey = createMessageKey(previousMessage)
            const translationKey = namespace
                ? `${namespace}.${prevMessageKey}`
                : prevMessageKey

            await fetch(
                `${baseURL}/api/automagical/translations?key=${translationKey}`,
                {
                    method: "DELETE"
                }
            )
        }

        await fetch(`${baseURL}/api/automagical/auto-translate`, {
            method: "POST",
            body: JSON.stringify({
                key: translationKey,
                message: message
            })
        })

        isTranslatingRef.current = false
        setPreviousMessage(message)
        setIsTranslating(false)
        setActiveTranslations((prev: string[]) =>
            prev.filter((key) => key !== translationKey)
        )
    }, [
        previousMessage,
        message,
        setActiveTranslations,
        t,
        tKey,
        namespace,
        translationKey,
        baseURL,
        locale,
        defaultLocale,
        values
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
