import fs from "fs"
import { join } from "path"

/**
 * Loads English translations from messages/en.json file
 * @returns Object containing the translations
 */
export async function loadTranslations(locale: string) {
    try {
        const filePath = join(process.cwd(), "messages", `${locale}.json`)

        // // Read the file and parse it as JSON
        const fileContents = fs.readFileSync(filePath, "utf8")
        const translations = JSON.parse(fileContents)

        return translations as Record<string, unknown>
    } catch (error) {
        console.warn(error)
        return {}
    }
}
