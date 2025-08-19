import { TriplitClient } from "@triplit/client"
import { schema } from "./schema"

export const dbClient = new TriplitClient({
    schema,
    serverUrl: "https://db.automagical.ai",
    autoConnect: false
})
