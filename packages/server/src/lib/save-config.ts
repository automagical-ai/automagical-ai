import type { AutomagicalConfig } from "@automagical-ai/core"
import detectIndent from "detect-indent"
import fs from "fs"
import { join } from "path"

/**
 * Saves the AutomagicalConfig to automagical.json while preserving indentation
 * @param config The configuration to save
 */
export async function saveConfig(config: AutomagicalConfig) {
    try {
        const filePath = join(process.cwd(), "automagical.json")

        // Read the existing file to detect indentation
        const fileContents = fs.readFileSync(filePath, "utf8")

        // Detect the indentation and fall back to 4 spaces if it can't be detected
        const indent = detectIndent(fileContents).indent || 2

        // Write the config back with the detected indentation
        fs.writeFileSync(filePath, `${JSON.stringify(config, null, indent)}\n`)
    } catch (error) {
        console.error(error)
        throw new Error("Failed to save automagical.json config file")
    }
}
