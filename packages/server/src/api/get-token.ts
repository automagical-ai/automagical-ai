import { $fetch } from "@automagical-ai/core"
import type { RouteParams } from "./route-handler"

export async function getToken({
    options: { apiKey, apiUrl, applicationId }
}: RouteParams) {
    const endpoint = `${apiUrl}/api/token?applicationId=${applicationId}`

    const data = await $fetch<{ token: string }>(endpoint, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    })

    return data
}
