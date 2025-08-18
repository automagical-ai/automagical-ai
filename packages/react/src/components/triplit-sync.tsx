"use client"

import { TriplitClient } from "@triplit/client"
import { useEffect, useState } from "react"

import { useToken } from "../hooks/use-token"
import { schema } from "../lib/schema"
import { useAutomagicalContext } from "./automagical-provider"
import { SyncConfig } from "./sync-config"

declare global {
    interface Window {
        __triplitClients?: Map<string, TriplitClient<typeof schema>>
    }
}

function getOrCreateTriplitClient(dbURL: string) {
    if (!window.__triplitClients) {
        window.__triplitClients = new Map()
    }

    const existingClient = window.__triplitClients.get(dbURL)
    if (existingClient) return existingClient

    const newClient = new TriplitClient({
        serverUrl: dbURL,
        autoConnect: false,
        schema
    })

    window.__triplitClients.set(dbURL, newClient)

    return newClient
}

export function TriplitSync() {
    const { token, refetch: refetchToken } = useToken()
    const { dbURL } = useAutomagicalContext()
    const [triplit, setTriplit] = useState<TriplitClient<typeof schema>>()

    useEffect(() => {
        if (!token) return

        const client = getOrCreateTriplitClient(dbURL)
        setTriplit(client)

        client.startSession(token, true, {
            refreshHandler: refetchToken
        })

        return () => {
            client.disconnect()
        }
    }, [dbURL, token, refetchToken])

    if (!triplit) return null

    return <SyncConfig triplit={triplit} />
}
