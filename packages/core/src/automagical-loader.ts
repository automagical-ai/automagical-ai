import { $activeTranslations } from "./automagical"

export function renderLoader() {
    if (document.getElementById("automagical-loader")) return

    // Add keyframe animation
    const style = document.createElement("style")
    style.textContent = `
        @keyframes automagical-spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `
    document.head.appendChild(style)

    // Create loader container
    const loader = document.createElement("div")
    loader.id = "automagical-loader"
    loader.style.cssText = `
        animation: automagical-spin 1.75s linear infinite;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 18px;
        border: 2px solid #222222;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
        background-color: rgba(0, 0, 0, 0.8);
        opacity: 0;
        transition: opacity 0.25s ease-in-out;
    `

    // Create SVG icon
    loader.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="m12 15.39l-3.76 2.27l.99-4.28l-3.32-2.88l4.38-.37L12 6.09l1.71 4.04l4.38.37l-3.32 2.88l.99 4.28M22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.45 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03z"
            />
        </svg>
    `

    document.body.appendChild(loader)
}

export function updateLoaderVisibility() {
    const isLoading = $activeTranslations.get().length > 0

    const loader = document.getElementById("automagical-loader")
    if (loader) {
        loader.style.opacity = isLoading ? "1" : "0"
    }
}
