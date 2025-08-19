"use client"

import { type AutomagicalConfig, dbClient } from "@automagical-ai/core"
import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useState
} from "react"

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
    isSyncing: boolean
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
    dbURL = dbClient.serverUrl
}: AutomagicalProviderProps & { children: ReactNode }) {
    const [isSyncing, setIsSyncing] = useState(false)
    const [activeTranslations, setActiveTranslations] = useState<string[]>([])

    // TODO Check translations whenever the locales array changes (or on initial mount)

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
                isSyncing,
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
            "useAutomagicalContext must be used within an AutomagicalProvider"
        )
    }

    return context
}
