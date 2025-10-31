import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { type Locale, useTranslations } from "use-intl"

import { getMessages, getTranslator } from "@/i18n/messages"

const getServerMessage = createServerFn()
    .inputValidator(({ emoji, locale }: { emoji: string; locale: Locale }) => ({
        emoji,
        locale
    }))
    .handler(async ({ data: { locale, emoji } }) => {
        const t = await getTranslator(locale, "index")

        return t("server_message", { emoji })
    })

export const Route = createFileRoute("/{-$locale}/")({
    beforeLoad: async ({ context: { locale, messages } }) => {
        const indexMessages = await getMessages(locale, "index")
        Object.assign(messages, indexMessages)
    },
    // loader: async ({ context: { locale, messages } }) => {
    //     const t = createTranslator({
    //         locale,
    //         messages
    //     })

    //     return {
    //         messageFromLoader: t("example_message", { username: "John Doe" }),
    //         serverFunctionMessage: await getServerMessage({
    //             data: { emoji: "📩", locale }
    //         })
    //     }
    // },
    component: IndexPage
})

function IndexPage() {
    const t = useTranslations("index")
    // const { serverFunctionMessage, messageFromLoader } = Route.useLoaderData()

    return (
        <main className="container mx-auto p-4">
            {/* <h2>Message from loader: {messageFromLoader}</h2>

            <h2>Server function messsage: {serverFunctionMessage}:</h2> */}

            <h2>{t("hello_world", { username: "John Doe" })}</h2>
        </main>
    )
}
