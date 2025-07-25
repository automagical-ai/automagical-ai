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
    activeTranslations: string[]
    setActiveTranslations: React.Dispatch<React.SetStateAction<string[]>>
}

const AutomagicalContext = createContext<AutomagicalContextType | undefined>(
    undefined
)

export function AutomagicalProvider({
    children,
    config
}: Partial<AutomagicalContextType> & {
    config: AutomagicalConfig
    children: ReactNode
}) {
    if (process.env.NODE_ENV !== "development") return children

    const [isCheckingTranslations, setIsCheckingTranslations] = useState(false)
    const [activeTranslations, setActiveTranslations] = useState<string[]>([])

    // Check translations whenever the locales array changes (or on initial mount)
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        const checkTranslations = async () => {
            // setIsCheckingTranslations(true)

            // try {
            //     await fetch("/api/auto-translate/check-translations")
            // } catch (error) {
            //     console.error("Error checking translations:", error)
            // }

            setIsCheckingTranslations(false)
        }

        checkTranslations()
    }, [config?.autoTranslate?.locales])

    config.baseUrl = config.baseUrl ?? ""

    return (
        <AutomagicalContext.Provider
            value={{ config, activeTranslations, setActiveTranslations }}
        >
            {children}

            <TranslationToast
                isLoading={
                    isCheckingTranslations || activeTranslations.length > 0
                }
            />
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

export function useActiveTranslations() {
    const context = useContext(AutomagicalContext)

    if (context === undefined) {
        throw new Error(
            "useActiveTranslations must be used within an AutomagicalProvider"
        )
    }

    return {
        activeTranslations: context.activeTranslations,
        setActiveTranslations: context.setActiveTranslations
    }
}
