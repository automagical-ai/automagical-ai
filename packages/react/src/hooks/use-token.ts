"use client"

import { $fetch } from "@automagical-ai/core"
import { useCallback, useEffect, useState } from "react"

import { useAutomagicalContext } from "../components/automagical-provider"
import { triplit } from "../triplit/client"

export function useToken() {
    const [token, setToken] = useState<string | undefined>(triplit.token)
    const { baseURL, setIsSyncing, applicationId } = useAutomagicalContext()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    const fetchToken = useCallback(async () => {
        setIsSyncing(true)

        try {
            const data = await $fetch<{ token: string }>(
                `${baseURL}/api/automagical/token`
            )

            setToken(data.token)
            setIsSyncing(false)

            return data.token
        } catch (error) {
            console.error(error)
            setIsSyncing(false)

            return null
        }
    }, [baseURL])

    useEffect(() => {
        if (triplit.decodedToken?.sub !== applicationId) {
            fetchToken()
        }

        window.addEventListener("online", fetchToken)

        return () => {
            window.removeEventListener("online", fetchToken)
        }
    }, [fetchToken, applicationId])

    return { token, refetch: fetchToken }
}
