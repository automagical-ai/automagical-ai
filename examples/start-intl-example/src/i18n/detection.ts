import { createDetection } from "@automagical-ai/start-intl"
import { routing } from "./routing"

export const { localeDetection, useLocaleDetection } = createDetection(routing)
