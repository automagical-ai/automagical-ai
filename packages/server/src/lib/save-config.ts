import type { AutomagicalConfig } from "@automagical-ai/core"
import fs from "fs"
import { join } from "path"
import { detectIndentation } from "./detect-indentation"

/**
 * Saves the AutomagicalConfig to automagical.json while preserving indentation
 * @param config The configuration to save
 */
export async function saveConfig(config: AutomagicalConfig) {
    try {
        const indentation = detectIndentation()
        const filePath = join(process.cwd(), "automagical.json")

        // Reorder properties to ensure updatedAt is always at the bottom
        const { updatedAt, ...restConfig } = config
        const orderedConfig = { ...restConfig, updatedAt }

        fs.writeFileSync(
            filePath,
            `${JSON.stringify(orderedConfig, null, indentation)}\n`
        )
    } catch (error) {
        console.error(error)
        throw new Error("Failed to save automagical.json config file")
    }
}
