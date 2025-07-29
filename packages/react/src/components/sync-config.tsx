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
    const { applicationId, config } = useAutomagicalContext()
    const { result: application } = useQueryOne(
        triplit,
        triplit.query("applications").Where("id", "=", applicationId)
    )

    useEffect(() => {
        if (!config || !application?.config) return

        const needsSync =
            !config.updatedAt || !isEqual(config, application.config)

        if (!needsSync) return

        if (!config.updatedAt) {
            // We need to apply the config to the application
        }
    }, [config, application?.config])

    return null
}
