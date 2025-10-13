"use client"

import { type Automagical, automagical } from "@automagical-ai/core"
import { useEffect } from "react"

export function useAutomagical(options: Automagical) {
    useEffect(() => automagical(options), [options])
}
