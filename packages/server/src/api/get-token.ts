import type { RouteParams } from "./route-handler"

export async function getToken({
    options: { apiKey, apiUrl, applicationId }
}: RouteParams) {
    const endpoint = `${apiUrl}/api/token?applicationId=${applicationId}`

    const response = await fetch(endpoint, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
        }
    })

    const data = await response.json()
    if (!data.token) {
        throw new Error("No token found")
    }

    return data
}
