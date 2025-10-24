import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { createTranslator, useTranslations } from "use-intl"
import { loadMessages } from "@/i18n/loader"
import type { Locale } from "@/i18n/locales"

const getServerMessage = createServerFn()
    .inputValidator(({ emoji, locale }: { emoji: string; locale: string }) => ({
        emoji,
        locale
    }))
    .handler(async (ctx) => {
        const messages = await loadMessages({ data: ctx.data.locale as Locale })
        const t = createTranslator({
            locale: ctx.data.locale,
            messages: messages
        })

        return t("server_message", { emoji: ctx.data.emoji })
    })

export const Route = createFileRoute("/{-$locale}/")({
    component: Home
    // loader: async ({ context }) => {
    //     const t = createTranslator({
    //         locale: context.locale,
    //         messages: context.messages
    //     })

    //     return {
    //         messageFromLoader: t("example_message", { username: "John Doe" }),
    //         serverFunctionMessage: await getServerMessage({
    //             data: { emoji: "📩", locale: context.locale }
    //         })
    //     }
    // }
})

function Home() {
    const t = useTranslations()

    // const { serverFunctionMessage, messageFromLoader } = Route.useLoaderData()
    return (
        <div className="p-2">
            {/* <h2>Message from loader: {messageFromLoader}</h2> */}
            {/* <h2>Server function message: {serverFunctionMessage}:</h2> */}
            <h2>{t("example_message", { username: "John Doe" })}</h2>
        </div>
    )
}
