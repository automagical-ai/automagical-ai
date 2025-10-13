"use client"

import type { Automagical as AutomagicalProps } from "@automagical-ai/core"
import { useAutomagical } from "../hooks/use-automagical"

export function Automagical(props: AutomagicalProps) {
    useAutomagical(props)

    return null
}
