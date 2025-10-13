import { atom, map } from "nanostores"
import { renderLoader, updateLoaderVisibility } from "./automagical-loader"
import type { AutomagicalConfig } from "./types/automagical-config"

export interface AutomagicalOptions {
    config: AutomagicalConfig
    baseURL?: string
    applicationId?: string
    environment?: "development" | "production"
}

export const $automagical = map<AutomagicalOptions>({
    config: {},
    applicationId:
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APPLICATION_ID ??
        process.env.NEXT_PUBLIC_AUTOMAGICAL_APP_ID,
    baseURL: "",
    environment: process.env.NODE_ENV as "development" | "production"
})

export const $activeTranslations = atom<string[]>([])

export function automagical(options: AutomagicalOptions) {
    renderLoader()
    $automagical.set({ ...$automagical.get(), ...options })

    const unbindAutomagicalListener = $automagical.subscribe(() => {
        updateLoaderVisibility()
    })

    const unbindActiveTranslationsListener = $activeTranslations.subscribe(
        () => {
            updateLoaderVisibility()
        }
    )

    return () => {
        unbindAutomagicalListener()
        unbindActiveTranslationsListener()
    }
}
