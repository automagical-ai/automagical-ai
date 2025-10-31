import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useTranslation } from "react-i18next"
import { i18n } from "@/i18n/i18n"
import { addMessages, loadMessages } from "@/i18n/messages"

export const Route = createFileRoute("/{-$locale}/")({
    beforeLoad: async ({ context: { locale } }) => {
        await addMessages(locale, "index")
    },
    component: Home
})

const getServerMessage = createServerFn()
    .inputValidator(({ locale }: { locale: string }) => ({ locale }))
    .handler(async ({ data: { locale } }) => {
        i18n.changeLanguage(locale)
        await loadMessages(locale, "index")
        const message = i18n.t("hello_world", { ns: "index" })

        // const autoTranslate = createAutoTranslate(i18n, "index")
        // const message = autoTranslate("Hello, world!")
        // const message = autoTranslate(i18n, "Hello, world!", { ns: "index" })

        console.log("message", message)
    })

function Home() {
    const { t } = useTranslation("index")
    // const { autoTranslate } = useAutoTranslate("index")
    const { locale } = Route.useRouteContext()

    return (
        <main className="container mx-auto p-4">
            <h1>{t("hello_world")}</h1>

            <button
                onClick={() => getServerMessage({ data: { locale } })}
                type="button"
            >
                Log server fn
            </button>
        </main>
    )
}
