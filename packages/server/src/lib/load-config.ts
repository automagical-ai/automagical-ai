import type { AutomagicalConfig } from "@automagical-ai/core"
import fs from "fs"
import { join } from "path"

/**
 * Loads English translations from messages/en.json file
 * @returns Object containing the translations
 */
export async function loadConfig() {
    try {
        const filePath = join(process.cwd(), "automagical.json")

        // // Read the file and parse it as JSON
        const fileContents = fs.readFileSync(filePath, "utf8")
        const config = JSON.parse(fileContents)
        delete config.$schema

        return config as AutomagicalConfig
    } catch (error) {
        console.error(error)
        throw new Error("Failed to load automagical.json config file")
    }
}
