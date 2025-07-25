import "@/styles/globals.css"
import { AutomagicalProvider } from "@automagical-ai/react"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { NextIntlClientProvider } from "next-intl"
import automagicalConfig from "../../automagical.config"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <NextIntlClientProvider
            locale={router.locale}
            timeZone="America/Los_Angeles"
            messages={pageProps.messages}
        >
            <AutomagicalProvider config={automagicalConfig}>
                <Component {...pageProps} />
            </AutomagicalProvider>
        </NextIntlClientProvider>
    )
}
