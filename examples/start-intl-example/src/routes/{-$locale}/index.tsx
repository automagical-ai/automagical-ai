import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useEffect } from "react"
import type { Locale } from "use-intl"
import { createTranslator, useTranslations } from "use-intl"
import { getTranslator, testFunction } from "@/i18n/messages"

const getServerMessage = createServerFn()
    .inputValidator(({ emoji, locale }: { emoji: string; locale: Locale }) => ({
        emoji,
        locale
    }))
    .handler(async ({ data: { locale, emoji } }) => {
        const t = await getTranslator(locale)

        return t("server_message", { emoji })
    })

export const Route = createFileRoute("/{-$locale}/")({
    component: Home,
    loader: async ({ context: { locale, messages } }) => {
        const t = createTranslator({
            locale,
            messages
        })

        return {
            messageFromLoader: t("example_message", { username: "John Doe" }),
            serverFunctionMessage: await getServerMessage({
                data: { emoji: "📩", locale }
            })
        }
    }
})

function Home() {
    const t = useTranslations()
    const { serverFunctionMessage, messageFromLoader } = Route.useLoaderData()

    useEffect(() => {
        testFunction()
    }, [])

    return (
        <main className="container mx-auto p-4">
            <h2>Message from loader: {messageFromLoader}</h2>

            <h2>Server function messsage: {serverFunctionMessage}:</h2>

            <h2>{t("example_message", { username: "John Doe" })}</h2>
        </main>
    )
}
