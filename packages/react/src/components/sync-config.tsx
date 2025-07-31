import type { AutomagicalConfig } from "@automagical-ai/core"
import type { TriplitClient } from "@triplit/client"
import { useQueryOne } from "@triplit/react"
import { isEqual } from "lodash"
import { useEffect } from "react"
import type { schema } from "../lib/schema"
import { useAutomagicalContext } from "./automagical-provider"

export function SyncConfig({
    triplit
}: {
    triplit: TriplitClient<typeof schema>
}) {
    const { applicationId, baseURL, config, setIsSyncing } =
        useAutomagicalContext()
    const { result: application } = useQueryOne(
        triplit,
        triplit.query("applications").Where("id", "=", applicationId)
    )

    async function syncConfig() {
        if (!config || !application?.config || !applicationId) return

        setIsSyncing(true)

        try {
            let newConfig: AutomagicalConfig | undefined

            if (config.updatedAt) {
                config.updatedAt = new Date(config.updatedAt)
            }

            // Check if the local config needs to be applied to the remote config
            if (
                !config.updatedAt ||
                isEqual(application.config.updatedAt, config.updatedAt)
            ) {
                newConfig = { ...application.config, ...config }

                // Check if we need to update the remote config
                if (!isEqual(newConfig, application.config)) {
                    const updatedAt = new Date()

                    await triplit.http.update("applications", applicationId, {
                        config: { ...newConfig, updatedAt }
                    })

                    newConfig.updatedAt = updatedAt
                } else {
                    newConfig = undefined
                }
            } else if (
                !isEqual(config.updatedAt, application.config.updatedAt)
            ) {
                newConfig = { ...config, ...application.config }
            }

            if (newConfig) {
                await fetch(`${baseURL}/api/automagical/config`, {
                    method: "POST",
                    body: JSON.stringify(newConfig)
                })
            }
        } catch (error) {
            console.error(error)
        }

        setIsSyncing(false)
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        syncConfig()
    }, [config, application?.config])

    return null
}
