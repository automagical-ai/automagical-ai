"use client"

import type { AutomagicalOptions } from "@automagical-ai/core"
import { useAutomagical } from "../hooks/use-automagical"

export function Automagical(props: AutomagicalOptions) {
    useAutomagical(props)

    return null
}
