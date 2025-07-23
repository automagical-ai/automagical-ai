"use client"

import { useIsHydrated } from "../hooks/use-hydrated"

export const LoadingText = ({ children }: { children: string }) => {
    const isHydrated = useIsHydrated()

    const loadingTextStyle = {
        background: "linear-gradient(90deg, #000, #fff, #000)",
        backgroundSize: "200% 100%",
        backgroundPosition: "200% 0",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "loadingAnimation 3s infinite",
        display: "inline-block",
        textShadow: "0px 0px 1px rgba(0, 0, 0, 0.2)" // Add a soft shadow for smoothing
    }

    const keyframesStyle = `
        @keyframes loadingAnimation {
            to {
                background-position: -200% 0
            }
        }
    `

    return (
        <>
            {isHydrated && <style>{keyframesStyle}</style>}
            <span style={loadingTextStyle}>{children}</span>
        </>
    )
}
