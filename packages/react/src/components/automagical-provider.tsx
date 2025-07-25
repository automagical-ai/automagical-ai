"use client"

import type { AutomagicalConfig } from "@automagical-ai/core"
import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useEffect,
    useState
} from "react"
import { TranslationToast } from "../components/translation-toast"

interface AutomagicalContextType {
    config: AutomagicalConfig
    activeTranslations: string[]
    setActiveTranslations: Dispatch<SetStateAction<string[]>>
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

    const [isSyncing, setIsSyncing] = useState(false)
    const [activeTranslations, setActiveTranslations] = useState<string[]>([])

    config.baseUrl = config.baseUrl ?? ""

    // Check translations whenever the locales array changes (or on initial mount)
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        const syncApplication = async () => {
            setIsSyncing(true)

            try {
                await fetch(`${config.baseUrl}/api/automagical/sync`, {
                    method: "POST"
                })
            } catch (error) {
                console.error("Error checking translations:", error)
            }

            setIsSyncing(false)
        }

        syncApplication()
    }, [
        config?.autoTranslate?.defaultLocale,
        config?.autoTranslate?.locales,
        config?.baseUrl
    ])

    return (
        <AutomagicalContext.Provider
            value={{ config, activeTranslations, setActiveTranslations }}
        >
            {children}

            <TranslationToast
                isLoading={isSyncing || activeTranslations.length > 0}
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

export function useAutomagicalContext() {
    const context = useContext(AutomagicalContext)

    if (context === undefined) {
        throw new Error(
            "useActiveTranslations must be used within an AutomagicalProvider"
        )
    }

    return context
}
