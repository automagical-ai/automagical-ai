import { useAutoTranslate } from "@automagical-ai/next-intl"
import type { GetStaticPropsContext } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export async function getStaticProps(context: GetStaticPropsContext) {
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by locale and read
            // the desired one based on the `locale` received from Next.js.
            messages: (await import(`../../messages/${context.locale}.json`))
                .default
        }
    }
}

export default function Home() {
    const { AutoTranslate } = useAutoTranslate({ namespace: "Home" })
    const { locale, locales, route } = useRouter()
    const otherLocale = locales?.find((cur) => cur !== locale) as string

    return (
        <div
            className={`${geistSans.className} ${geistMono.className} grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20`}
        >
            <Link href={route} locale={otherLocale}>
                {otherLocale}
            </Link>

            <AutoTranslate>Welcome to the Next.js example</AutoTranslate>

            <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <ol className="list-inside list-decimal text-center font-mono text-sm/6 sm:text-left">
                    <li className="mb-2 tracking-[-.01em]">
                        <AutoTranslate>Get started by editing</AutoTranslate>{" "}
                        <code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
                            src/pages/index.tsx
                        </code>
                        .
                    </li>
                    <li className="tracking-[-.01em]">
                        <AutoTranslate>
                            Save and see your changes instantly.
                        </AutoTranslate>
                    </li>
                </ol>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <a
                        className="flex h-10 items-center justify-center gap-2 rounded-full border border-transparent border-solid bg-foreground px-4 font-medium text-background text-sm transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            className="dark:invert"
                            src="/vercel.svg"
                            alt="Vercel logomark"
                            width={20}
                            height={20}
                        />
                        <AutoTranslate>Deploy now</AutoTranslate>
                    </a>
                    <a
                        className="flex h-10 w-full items-center justify-center rounded-full border border-black/[.08] border-solid px-4 font-medium text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <AutoTranslate>Read our docs</AutoTranslate>
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    <AutoTranslate>Learn</AutoTranslate>
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    <AutoTranslate>Examples</AutoTranslate>
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    <AutoTranslate values={{ domain: "nextjs.org" }}>
                        {"Go to {domain} →"}
                    </AutoTranslate>
                </a>
            </footer>
        </div>
    )
}
