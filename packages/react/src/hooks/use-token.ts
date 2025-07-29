import { useCallback, useEffect, useRef, useState } from "react"
import { useAutomagicalContext } from "../components/automagical-provider"

export function useToken() {
    const [token, setToken] = useState<string>()
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { baseURL } = useAutomagicalContext()
    const retryCountRef = useRef(0)
    const maxRetries = 5
    const baseDelay = 1000

    const fetchToken = useCallback(async () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current)
            retryTimeoutRef.current = null
        }

        try {
            const response = await fetch(`${baseURL}/api/automagical/token`)

            const data = await response.json()

            if (!data.token) {
                throw new Error("No token found")
            }

            setToken(data.token)
            retryCountRef.current = 0
            return true
        } catch (error) {
            console.error(error)

            // Retry logic with exponential backoff
            if (retryCountRef.current < maxRetries) {
                const delay = baseDelay * 2 ** retryCountRef.current
                console.log(
                    `Retrying fetch in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`
                )

                retryTimeoutRef.current = setTimeout(() => {
                    retryCountRef.current++
                    fetchToken()
                }, delay)
            } else {
                console.error("Max retries reached, giving up")
            }

            return false
        }
    }, [baseURL])

    useEffect(() => {
        fetchToken()

        window.addEventListener("online", fetchToken)

        return () => {
            window.removeEventListener("online", fetchToken)

            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    }, [fetchToken])

    return { token, refetch: fetchToken }
}
