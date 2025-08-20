import { routeHandler } from "@automagical-ai/server"

import automagicalConfig from "@/../automagical.config"

const handler = routeHandler(automagicalConfig, {
    apiUrl: "http://localhost:3000"
})

export const GET = handler
export const POST = handler
export const DELETE = handler
