import detectIndent from "detect-indent"
import fs from "fs"
import { join } from "path"

/**
 * Detects the indentation of the automagical.json file
 * @returns The detected indentation or 2 spaces as fallback
 */
export function detectIndentation(): string | number {
    try {
        const filePath = join(process.cwd(), "automagical.json")
        const fileContents = fs.readFileSync(filePath, "utf8")
        return detectIndent(fileContents).indent || 2
    } catch {
        // If file doesn't exist or can't be read, default to 2 spaces
        return 2
    }
}
