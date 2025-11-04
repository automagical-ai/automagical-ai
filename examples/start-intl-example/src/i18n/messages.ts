import { createTranslator, type Locale, type Messages } from "use-intl"

export const messages = {} as Messages

export async function loadMessages(locale: string, namespace: keyof Messages) {
    const messages = (
        await import(`../../messages/${locale}/${namespace}.json`)
    ).default

    return messages
}

export const getMessages = async (
    locale: Locale,
    namespace: keyof Messages
) => {
    const messages = await loadMessages(locale, namespace)
    return { [namespace]: messages }
}

export const addMessages = async (
    locale: Locale,
    namespace: keyof Messages
) => {
    const newMessages = await getMessages(locale, namespace)

    Object.assign(messages, newMessages)
}

export const getTranslator = async (
    locale: Locale,
    namespace: keyof Messages
) =>
    createTranslator({
        locale,
        messages: await getMessages(locale, namespace),
        namespace
    })
