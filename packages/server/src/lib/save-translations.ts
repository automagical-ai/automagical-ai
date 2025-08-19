import fs from "fs"
import { join } from "path"
import { detectIndentation } from "./detect-indentation"

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

        const indentation = detectIndentation()

        fs.writeFileSync(
            filePath,
            `${JSON.stringify(translations, null, indentation.type === "tab" ? "\t" : indentation.amount)}\n`,
            "utf8"
        )
    } catch (error) {
        console.error("Error saving translations:", error)
        throw new Error(`Failed to save translations for locale: ${locale}`)
    }
}
