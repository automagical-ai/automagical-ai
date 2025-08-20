import type { AutomagicalConfig } from "@automagical-ai/core"
import { type IncomingMessage, ServerResponse } from "http"

import { saveConfig } from "../lib/save-config"
import { autoTranslate } from "./auto-translate"
import { getToken } from "./get-token"

export interface RouteHandlerOptions {
    applicationId?: string
    apiKey?: string
    apiUrl?: string
}

export interface RouteParams<TBody = Record<string, unknown>> {
    body?: TBody
    searchParams?: URLSearchParams
    options: RouteHandlerOptions
    config: AutomagicalConfig
}

export function routeHandler(
    config: AutomagicalConfig,
    options: RouteHandlerOptions = {}
) {
    options.applicationId =
        options.applicationId ??
        process.env.AUTOMAGICAL_APPLICATION_ID ??
        process.env.AUTOMAGICAL_APP_ID ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APPLICATION_ID ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APP_ID
    options.apiKey = options.apiKey ?? process.env.AUTOMAGICAL_API_KEY
    options.apiUrl = options.apiUrl ?? "https://automagical.ai/api"

    return async (
        request: Request | (IncomingMessage & { body?: unknown }),
        response?: ServerResponse | unknown
    ) => {
        const url = new URL(
            request.url?.startsWith("http:") ||
                request.url?.startsWith("https:")
                ? request.url
                : `protocol://origin${request.url}`
        )

        const method = request.method!
        const slug = url.pathname.split("/").pop()

        let result: Record<string, unknown> = { success: true }

        async function getBody() {
            if (method !== "POST") return null

            try {
                if (request instanceof Request) {
                    return await request.json()
                }

                if (request.body && typeof request.body === "string") {
                    return JSON.parse(request.body)
                }

                return request.body
            } catch (error) {
                console.error(error)
                return null
            }
        }

        const body = await getBody()

        try {
            switch (method) {
                case "GET": {
                    switch (slug) {
                        case "token": {
                            result = await getToken({
                                config,
                                options
                            })

                            break
                        }
                        default: {
                            throw new Error("Not found")
                        }
                    }
                    break
                }
                case "POST": {
                    switch (slug) {
                        case "config": {
                            await saveConfig(body)
                            break
                        }
                        case "auto-translate": {
                            await autoTranslate({ body, config, options })
                            break
                        }
                        case "sync": {
                            // await syncApplication({ config })
                            break
                        }
                        default: {
                            throw new Error("Not found")
                        }
                    }
                    break
                }
                case "DELETE": {
                    switch (slug) {
                        // case "translations":
                        // return await deleteTranslations({ request, config })
                        default:
                            throw new Error("Not found")
                    }
                }
                default:
                    throw new Error("Not found")
            }
        } catch (error) {
            console.error(error)
            let message = "Unknown error"
            if (error instanceof Error) {
                message = error.message
            }

            if (response instanceof ServerResponse) {
                response.statusCode = 500
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({ message }))

                return
            }

            return Response.json({ message }, { status: 500 })
        }

        if (response instanceof ServerResponse) {
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify(result))

            return
        }

        return Response.json(result)
    }
}
