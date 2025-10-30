import { i18n } from "./i18n"

export async function loadMessages(locale: string, namespace: string) {
    const messages = (
        await import(`../../messages/${locale}/${namespace}.json`)
    ).default

    console.log(`messages/${locale}/${namespace}.json`)
    console.log(messages)

    console.log("loadMessages?")

    i18n.addResources(locale, namespace, messages)
}
