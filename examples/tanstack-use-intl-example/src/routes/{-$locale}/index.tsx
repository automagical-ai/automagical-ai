import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import type { Locale } from "use-intl"
import { createTranslator, useTranslations } from "use-intl"
import { getTranslator } from "@/i18n/messages"

const getServerMessage = createServerFn()
    .inputValidator(({ emoji, locale }: { emoji: string; locale: Locale }) => ({
        emoji,
        locale
    }))
    .handler(async ({ data }) => {
        const t = await getTranslator(data.locale)

        return t("server_message", { emoji: data.emoji })
    })

export const Route = createFileRoute("/{-$locale}/")({
    component: Home,
    loader: async ({ context }) => {
        const t = createTranslator({
            locale: context.locale,
            messages: context.messages
        })

        return {
            messageFromLoader: t("example_message", { username: "John Doe" }),
            serverFunctionMessage: await getServerMessage({
                data: { emoji: "📩", locale: context.locale }
            })
        }
    }
})

function Home() {
    const t = useTranslations()

    const { serverFunctionMessage, messageFromLoader } = Route.useLoaderData()
    return (
        <div className="p-2">
            <h2>Message from loader: {messageFromLoader}</h2>
            <h2>Server function message: {serverFunctionMessage}:</h2>
            <h2>{t("example_message", { username: "John Doe" })}</h2>
        </div>
    )
}
