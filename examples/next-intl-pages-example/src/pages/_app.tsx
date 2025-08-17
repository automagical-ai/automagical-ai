import { AutomagicalProvider } from "@automagical-ai/react"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { NextIntlClientProvider } from "next-intl"

import automagicalConfig from "@/../automagical.json"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <NextIntlClientProvider
            locale={router.locale}
            messages={pageProps.messages}
        >
            <AutomagicalProvider config={automagicalConfig}>
                <Component {...pageProps} />
            </AutomagicalProvider>
        </NextIntlClientProvider>
    )
}
