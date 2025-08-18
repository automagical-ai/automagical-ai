import { createMessageKey } from "@automagical-ai/core"
import { useTranslations } from "next-intl"
import { getNamespace } from "../lib/namespace-cache"
import { AutoTranslateClient } from "./auto-translate-client"

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
    dynamic,
    namespace,
    tKey,
    values
}: AutoTranslateProps) {
    const message = messageProp ?? children

    if (message === undefined) {
        throw new Error(
            "AutoTranslate component must have a message or children"
        )
    }

    const resolvedNamespace = namespace ?? getNamespace()
    const resolvedKey = tKey ?? createMessageKey(message)

    const t = useTranslations()
    const translationKey = resolvedNamespace
        ? `${resolvedNamespace}.${resolvedKey}`
        : resolvedKey

    if (process.env.NODE_ENV !== "development") {
        return t.has(translationKey) ? t(translationKey, values) : message
    }

    return (
        <AutoTranslateClient
            key={resolvedKey}
            namespace={resolvedNamespace}
            tKey={tKey}
            dynamic={dynamic}
            values={values}
        >
            {message}
        </AutoTranslateClient>
    )
}
