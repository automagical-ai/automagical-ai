"use client"

// export function SyncConfig() {
//     const { applicationId, baseURL, config, isSyncing, setIsSyncing } =
//         useAutomagicalContext()
//     const { result: application } = useQueryOne(
//         dbClient,
//         dbClient.query("applications").Where("id", "=", applicationId)
//     )

//     async function syncConfig() {
//         if (!config || !application?.config || !applicationId || isSyncing)
//             return

//         setIsSyncing(true)

//         try {
//             let newConfig: AutomagicalConfig | undefined

//             // Check if the local config needs to be applied to the remote config
//             if (
//                 !config.updatedAt ||
//                 isEqual(application.config.updatedAt, config.updatedAt)
//             ) {
//                 newConfig = { ...application.config, ...config }

//                 // Check if we need to update the remote config
//                 if (!isEqual(newConfig, application.config)) {
//                     const updatedAt = new Date()

//                     await dbClient.http.update("applications", applicationId, {
//                         config: { ...newConfig, updatedAt }
//                     })

//                     newConfig!.updatedAt = updatedAt
//                 } else if (config.updatedAt) {
//                     newConfig = undefined
//                 }
//             } else if (
//                 !isEqual(config.updatedAt, application.config.updatedAt)
//             ) {
//                 newConfig = { ...config, ...application.config }
//             }

//             if (newConfig) {
//                 await $fetch(`${baseURL}/api/automagical/config`, {
//                     method: "POST",
//                     body: newConfig
//                 })
//             }
//         } catch (error) {
//             console.error(error)
//         }

//         setIsSyncing(false)
//     }

//     // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
//     useEffect(() => {
//         syncConfig()
//     }, [config, application?.config])

//     return null
// }
