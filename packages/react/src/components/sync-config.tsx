import type { AutomagicalConfig } from "@automagical-ai/core"
import type { TriplitClient } from "@triplit/client"
import { useQueryOne } from "@triplit/react"
import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import type { schema } from "../lib/schema"
import { useAutomagicalContext } from "./automagical-provider"

export function SyncConfig({
    triplit
}: {
    triplit: TriplitClient<typeof schema>
}) {
    const { applicationId, baseURL, config } = useAutomagicalContext()
    const { result: application } = useQueryOne(
        triplit,
        triplit.query("applications").Where("id", "=", applicationId)
    )
    const [isSyncing, setIsSyncing] = useState(false)

    async function syncConfig() {
        if (!config || !application?.config || !applicationId || isSyncing)
            return

        setIsSyncing(true)

        console.log("syncing config")
        try {
            let newConfig: AutomagicalConfig | undefined

            // Check if the local config needs to be applied to the remote config

            if (config.updatedAt) {
                config.updatedAt = new Date(config.updatedAt)
            }

            if (
                !config.updatedAt ||
                isEqual(application.config.updatedAt, config.updatedAt)
            ) {
                newConfig = { ...application.config, ...config }

                // Check if we need to update the remote config
                if (!isEqual(newConfig, application.config)) {
                    newConfig.updatedAt = new Date()

                    console.log("update remotely")

                    await triplit.http.update("applications", applicationId, {
                        config: newConfig
                    })
                } else {
                    newConfig = undefined
                }
            } else if (
                !isEqual(config.updatedAt, application.config.updatedAt)
            ) {
                newConfig = { ...config, ...application.config }
            }

            if (newConfig) {
                console.log("update locally")
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
