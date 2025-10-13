import { useAutomagical } from "@automagical-ai/react"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { NextIntlClientProvider } from "next-intl"

import automagicalConfig from "@/../automagical.config"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    useAutomagical({ config: automagicalConfig })

    return (
        <NextIntlClientProvider
            locale={router.locale}
            messages={pageProps.messages}
            timeZone="America/Los_Angeles"
        >
            <Component {...pageProps} />
        </NextIntlClientProvider>
    )
}
