"use client"

import type { AutomagicalConfig } from "@automagical-ai/core"
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState
} from "react"
import { TranslationToast } from "../components/translation-toast"

interface AutomagicalContextType {
    config: AutomagicalConfig
}

const AutomagicalContext = createContext<AutomagicalContextType | undefined>(
    undefined
)

export function AutomagicalProvider({
    children,
    config
}: AutomagicalContextType & {
    children: ReactNode
}) {
    if (process.env.NODE_ENV !== "development") return children

    const [isCheckingTranslations, setIsCheckingTranslations] = useState(false)

    // Check translations whenever the locales array changes (or on initial mount)
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        const checkTranslations = async () => {
            setIsCheckingTranslations(true)

            // try {
            //     await fetch("/api/auto-translate/check-translations")
            // } catch (error) {
            //     console.error("Error checking translations:", error)
            // }

            setIsCheckingTranslations(false)
        }

        checkTranslations()
    }, [config?.autoTranslate?.locales])

    return (
        <AutomagicalContext.Provider value={{ config }}>
            {children}

            <TranslationToast isLoading={isCheckingTranslations} />
        </AutomagicalContext.Provider>
    )
}

export function useAutomagicalConfig() {
    const context = useContext(AutomagicalContext)

    if (context === undefined) {
        throw new Error(
            "useAutomagicalConfig must be used within an AutomagicalProvider"
        )
    }

    return context.config
}
