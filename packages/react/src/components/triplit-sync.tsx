import { TriplitClient } from "@triplit/client"
import { useEffect, useState } from "react"
import { useToken } from "../hooks/use-token"
import { useAutomagicalContext } from "./automagical-provider"

export function TriplitSync() {
    const { token } = useToken()
    const { dbURL } = useAutomagicalContext()
    const [triplit, setTriplit] = useState<TriplitClient>()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        triplit?.disconnect()

        setTriplit(
            new TriplitClient({
                serverUrl: dbURL,
                autoConnect: false
            })
        )
    }, [dbURL])

    useEffect(() => {
        if (!triplit || !token) return
        triplit.startSession(token)
    }, [triplit, token])

    return null
}
