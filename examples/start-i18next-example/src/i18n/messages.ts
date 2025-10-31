import { i18n } from "./i18n"

export async function loadMessages(locale: string, namespace: string) {
    const messages = (
        await import(`../../messages/${locale}/${namespace}.json`)
    ).default

    return messages
}

export async function addMessages(locale: string, namespace: string) {
    const messages = await loadMessages(locale, namespace)
    i18n.addResources(locale, namespace, messages)
}
