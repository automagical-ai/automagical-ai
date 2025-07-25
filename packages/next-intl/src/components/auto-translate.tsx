import { createMessageKey } from "@automagical-ai/core"
import { useTranslations } from "next-intl"
import { getNamespace } from "../lib/namespace-cache"
import { AutoTranslateClient } from "./auto-translate-client"

export interface AutoTranslateProps {
    children: string
    values?: Record<string, string | number | Date>
    namespace?: string
    tKey?: string
    dynamic?: boolean
}

export function AutoTranslate({
    children: message,
    namespace,
    tKey,
    dynamic,
    values
}: AutoTranslateProps) {
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
            namespace={resolvedNamespace}
            tKey={tKey}
            dynamic={dynamic}
            values={values}
        >
            {message}
        </AutoTranslateClient>
    )
}
