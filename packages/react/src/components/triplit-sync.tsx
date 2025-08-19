"use client"

import { dbClient } from "@automagical-ai/core"
import { useEffect } from "react"
import { useToken } from "../hooks/use-token"
import { useAutomagicalContext } from "./automagical-provider"
import { SyncConfig } from "./sync-config"

export function TriplitSync() {
    const { token, refetch: refetchToken } = useToken()
    const { dbURL } = useAutomagicalContext()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (dbURL === dbClient.serverUrl && token === dbClient.token) return

        dbClient.disconnect()

        if (dbURL !== undefined) {
            dbClient.updateServerUrl(dbURL)
        }

        if (!token) return

        dbClient.startSession(token, true, {
            refreshHandler: refetchToken
        })
    }, [dbURL, token])

    return <SyncConfig />
}
