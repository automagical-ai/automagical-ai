import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { NextIntlClientProvider } from "next-intl"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <NextIntlClientProvider
            locale={router.locale}
            timeZone="America/Los_Angeles"
            messages={pageProps.messages}
        >
            <Component {...pageProps} />
        </NextIntlClientProvider>
    )
}
