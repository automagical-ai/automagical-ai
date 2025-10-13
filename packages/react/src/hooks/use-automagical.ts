"use client"

import { type AutomagicalOptions, automagical } from "@automagical-ai/core"
import { useEffect } from "react"

export function useAutomagical(options: AutomagicalOptions) {
    useEffect(() => automagical(options), [options])
}
