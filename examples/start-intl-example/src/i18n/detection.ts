import { createDetection } from "@automagical-ai/start-i18n"
import { routing } from "./routing"

export const { localeDetection, useLocaleDetection } = createDetection(routing)
