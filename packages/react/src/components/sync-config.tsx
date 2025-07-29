import type { TriplitClient } from "@triplit/client"
import { useQueryOne } from "@triplit/react"
import type { schema } from "../lib/schema"
import { useAutomagicalContext } from "./automagical-provider"

export function SyncConfig({
    triplit
}: {
    triplit: TriplitClient<typeof schema>
}) {
    const { applicationId } = useAutomagicalContext()
    const { result: application } = useQueryOne(
        triplit,
        triplit.query("applications").Where("id", "=", applicationId)
    )

    console.log({ application })

    return null
}
