export const LoadingText = ({ children }: { children: string }) => {
    const loadingTextStyle = {
        background: "linear-gradient(90deg, #000, #fff, #000)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "loadingAnimation 2s linear infinite",
        display: "inline-block",
        textShadow: "0px 0px 1px rgba(0, 0, 0, 0.2)" // Add a soft shadow for smoothing
    }

    const keyframesStyle = `
        @keyframes loadingAnimation {
            0% {
                background-position: 200% 0
            }
            100% {
                background-position: -200% 0
            }
        }
    `

    return (
        <>
            <style>{keyframesStyle}</style>
            <span style={loadingTextStyle}>{children}</span>
        </>
    )
}
