import { createMiddleware } from "@automagical-ai/start-intl"
import { routing } from "./routing"

export const { localeMiddleware, useLocaleMiddleware } =
    createMiddleware(routing)

