import type { AutomagicalConfig } from "@automagical-ai/core"
import type { AutoTranslateConfig } from "@automagical-ai/core/dist/types/auto-translate-config"
import type { RouteParams } from "./route-handler"

export async function syncApplication({
    config: { autoTranslate },
    options: { apiKey, apiUrl, applicationId }
}: RouteParams) {
    if (!applicationId) {
        throw new Error("Application ID is required")
    }

    console.log(`${apiUrl}/api/applications/${applicationId}`)

    const response = await fetch(
        `${apiUrl}/api/applications/${applicationId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            }
        }
    )

    const data = (await response.json()) as {
        config: AutomagicalConfig
    }

    const remoteConfig = data.config
    let isDifferent = false

    // Check if our local config has any values that are different from the remote config recursively
    if (autoTranslate) {
        if (remoteConfig.autoTranslate) {
            for (const key in autoTranslate) {
                if (
                    autoTranslate[key as keyof AutoTranslateConfig] !==
                    remoteConfig.autoTranslate[key as keyof AutoTranslateConfig]
                ) {
                    console.log(`${key} is different`)
                    isDifferent = true
                }
            }
        } else {
            console.log("autoTranslate is different")
            isDifferent = true
        }
    }

    if (isDifferent) {
        await fetch(`${apiUrl}/api/applications/${applicationId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                config: {
                    autoTranslate
                }
            })
        })
    }
}
