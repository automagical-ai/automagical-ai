import { useTranslations } from "next-intl"
import { getNamespace } from "../lib/namespace-cache"

export interface AutoTranslateProps {
    children: string
    namespace?: string
    tKey?: string
}

export function AutoTranslate({
    children: message,
    namespace,
    tKey
}: AutoTranslateProps) {
    const resolvedNamespace = namespace ?? getNamespace()
    const t = useTranslations(resolvedNamespace)
    const translationKey = "test"

    if (process.env.NODE_ENV !== "development") {
        return t.has(translationKey) ? t(translationKey) : message
    }

    return t.has(translationKey) ? t(translationKey) : message
}
