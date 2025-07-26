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

interface AutomagicalProviderProps {
    config: AutomagicalConfig
    applicationId?: string
    baseURL?: string
}

interface AutomagicalContextType extends AutomagicalProviderProps {
    baseURL: string
    activeTranslations: string[]
    setActiveTranslations: Dispatch<SetStateAction<string[]>>
}

const AutomagicalContext = createContext<AutomagicalContextType | undefined>(
    undefined
)

export function AutomagicalProvider({
    children,
    applicationId,
    baseURL = "",
    config
}: AutomagicalProviderProps & { children: ReactNode }) {
    if (process.env.NODE_ENV !== "development") return children

    const [isSyncing, setIsSyncing] = useState(false)
    const [activeTranslations, setActiveTranslations] = useState<string[]>([])

    // Check translations whenever the locales array changes (or on initial mount)
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        const syncApplication = async () => {
            setIsSyncing(true)

            try {
                await fetch(`${baseURL}/api/automagical/sync`, {
                    method: "POST"
                })
            } catch (error) {
                console.error("Error checking translations:", error)
            }

            setIsSyncing(false)
        }

        syncApplication()
    }, [config, baseURL])

    applicationId =
        applicationId ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APPLICATION_ID ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APP_ID

    return (
        <AutomagicalContext.Provider
            value={{
                config,
                applicationId,
                baseURL,
                activeTranslations,
                setActiveTranslations
            }}
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
