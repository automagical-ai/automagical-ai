import type { AutomagicalConfig } from "@automagical-ai/core"
import type { IncomingMessage, ServerResponse } from "http"
import { autoTranslate } from "./auto-translate"

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

export async function routeHandler(
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
        request: Request | (IncomingMessage & { body: unknown }),
        response?: ServerResponse
    ) => {
        const url = new URL(
            request.url?.startsWith("http:") ||
                request.url?.startsWith("https:")
                ? request.url
                : `protocol://origin${request.url}`
        )

        const searchParams = url.searchParams
        const method = request.method!
        const slug = url.pathname.split("/").pop()

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
            } catch (_) {
                return null
            }
        }

        const body = await getBody()

        try {
            switch (method) {
                case "GET": {
                    console.log("GET", slug)
                    break
                }
                case "POST": {
                    switch (slug) {
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
            let errorMessage = "Unknown error"
            if (error instanceof Error) {
                errorMessage = error.message
            }

            if (response) {
                response.statusCode = 500
                response.setHeader("Content-Type", "application/json")
                response.end(JSON.stringify({ error: errorMessage }))
                return
            }

            return new Response(JSON.stringify({ error: errorMessage }), {
                status: 500
            })
        }

        if (response) {
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify({ success: true }))
            return
        }

        return new Response(JSON.stringify({ success: true }))

        //     case "check-translations":
        //         return checkTranslations({ request, config })
        //     case "translate-message":
        //         return translateMessage({ request, config })
        //     case "delete-message":
        //         return deleteMessage({ request, config })
        //     default:
        //         return Response.json({ error: "Not found" }, { status: 404 })
        // }
    }
}
