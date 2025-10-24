import { createServerFn } from "@tanstack/react-start"
import type defaultMessages from "../../messages/en.json"
import type { Locale } from "./locales"

export const loadMessages = createServerFn()
    .inputValidator((locale: Locale) => locale)
    .handler(async (ctx) => {
        const locale = ctx.data

        const messages = (await import(`../../messages/${locale}.json`)).default

        return messages as typeof defaultMessages
    })
