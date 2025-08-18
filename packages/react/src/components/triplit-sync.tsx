"use client"

import { useEffect } from "react"

import { useToken } from "../hooks/use-token"
import { triplit } from "../triplit/client"
import { useAutomagicalContext } from "./automagical-provider"
import { SyncConfig } from "./sync-config"

export function TriplitSync() {
    const { token, refetch: refetchToken } = useToken()
    const { dbURL } = useAutomagicalContext()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (!token) return

        triplit.disconnect()

        if (dbURL !== undefined) {
            triplit.updateServerUrl(dbURL)
        }

        triplit.startSession(token, true, {
            refreshHandler: refetchToken
        })
    }, [dbURL, token])

    return <SyncConfig />
}
