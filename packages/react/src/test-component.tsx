"use client"

import { test } from "@automagical-ai/core"
import { useEffect } from "react"

export const TestComponent = () => {
    useEffect(() => {
        console.log("TestComponent mounted")
        test()
    }, [])

    return <div>Test</div>
}
