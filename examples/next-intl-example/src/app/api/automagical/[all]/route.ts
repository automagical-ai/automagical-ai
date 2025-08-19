import { routeHandler } from "@automagical-ai/server"
import type { NextRequest } from "next/server"

import automagicalConfig from "@/../automagical.config"

const handler = (request: NextRequest) =>
    routeHandler(automagicalConfig, {
        apiUrl: "http://localhost:3000"
    })(request)

export const GET = handler
export const POST = handler
export const DELETE = handler
