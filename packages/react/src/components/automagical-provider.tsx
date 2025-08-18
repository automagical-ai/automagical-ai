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
import { triplit } from "../triplit/client"
import { AutomagicalLoader } from "./automagical-loader"
import { TriplitSync } from "./triplit-sync"

interface AutomagicalProviderProps {
    config: AutomagicalConfig
    applicationId?: string
    baseURL?: string
    dbURL?: string
}

interface AutomagicalContextType extends AutomagicalProviderProps {
    activeTranslations: string[]
    baseURL: string
    dbURL?: string
    setActiveTranslations: Dispatch<SetStateAction<string[]>>
    setIsSyncing: Dispatch<SetStateAction<boolean>>
}

const AutomagicalContext = createContext<AutomagicalContextType | undefined>(
    undefined
)

export function AutomagicalProvider({
    children,
    config,
    applicationId: applicationIdProp,
    baseURL = "",
    dbURL = triplit.serverUrl
}: AutomagicalProviderProps & { children: ReactNode }) {
    delete config.$schema

    const [isSyncing, setIsSyncing] = useState(false)
    const [activeTranslations, setActiveTranslations] = useState<string[]>([])

    // Check translations whenever the locales array changes (or on initial mount)
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        const syncApplication = async () => {
            setIsSyncing(true)

            // try {
            //     await fetch(`${baseURL}/api/automagical/sync`, {
            //         method: "POST"
            //     })
            // } catch (error) {
            //     console.error("Error checking translations:", error)
            // }

            setIsSyncing(false)
        }

        syncApplication()
    }, [config, baseURL])

    const applicationId =
        applicationIdProp ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APPLICATION_ID ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APP_ID

    return (
        <AutomagicalContext.Provider
            value={{
                config,
                applicationId,
                activeTranslations,
                baseURL,
                dbURL,
                setActiveTranslations,
                setIsSyncing
            }}
        >
            {children}

            {!!applicationId && process.env.NODE_ENV === "development" && (
                <>
                    <AutomagicalLoader
                        isLoading={isSyncing || activeTranslations.length > 0}
                    />

                    <TriplitSync />
                </>
            )}
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
