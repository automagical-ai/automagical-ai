import { TriplitClient } from "@triplit/client"
import { useEffect, useState } from "react"

import { useToken } from "../hooks/use-token"
import { schema } from "../lib/schema"
import { useAutomagicalContext } from "./automagical-provider"
import { SyncConfig } from "./sync-config"

export function TriplitSync() {
    const { token, refetch: refetchToken } = useToken()
    const { dbURL } = useAutomagicalContext()
    const [triplit, setTriplit] = useState<TriplitClient<typeof schema>>()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        triplit?.disconnect()

        setTriplit(
            new TriplitClient({
                serverUrl: dbURL,
                autoConnect: false,
                schema
            })
        )
    }, [dbURL])

    useEffect(() => {
        if (!triplit || !token) return

        triplit.startSession(token, true, { refreshHandler: refetchToken })
    }, [triplit, token, refetchToken])

    if (!triplit) return null

    return <SyncConfig triplit={triplit} />
}
