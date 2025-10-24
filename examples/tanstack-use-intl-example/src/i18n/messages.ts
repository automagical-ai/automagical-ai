import { createTranslator, type Locale, type Messages } from "use-intl"

export const getMessages = async (locale: Locale) =>
    (await import(`../../messages/${locale}.json`)).default as Messages

export const getMessage = async (locale: Locale, key: keyof Messages) =>
    (await getMessages(locale))[key]

export const getTranslator = async (locale: Locale) =>
    createTranslator({
        locale,
        messages: await getMessages(locale)
    })
