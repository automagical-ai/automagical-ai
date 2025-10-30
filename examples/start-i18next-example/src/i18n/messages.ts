export async function loadMessages(locale: string, namespace: string) {
    const messages = (
        await import(`../../messages/${locale}/${namespace}.json`)
    ).default

    return messages
}
