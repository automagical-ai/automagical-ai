import fs from "node:fs"
import { join } from "node:path"

/**
 * Saves translations to the messages/{locale}.json file
 */
export async function saveTranslations(
    locale: string,
    translations: Record<string, unknown>
) {
    try {
        const filePath = join(process.cwd(), "messages", `${locale}.json`)

        // Ensure the directory exists
        const dirPath = join(process.cwd(), "messages")
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }

        // Write the translations to the file
        fs.writeFileSync(
            filePath,
            JSON.stringify(translations, null, 2),
            "utf8"
        )

        return true
    } catch (error) {
        console.error("Error saving translations:", error)
        return false
    }
}
