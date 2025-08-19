import detectIndent from "detect-indent"
import fs from "fs"
import { join } from "path"

/**
 * Detects the indentation of automagical.config.ts
 * @returns The detected indentation or 2 spaces as fallback
 */
export function detectIndentation() {
    try {
        const tsFilePath = join(process.cwd(), "automagical.config.ts")

        if (fs.existsSync(tsFilePath)) {
            const tsContents = fs.readFileSync(tsFilePath, "utf8")
            return detectIndent(tsContents) || { amount: 2, type: "space" }
        }

        return { amount: 2, type: "space" }
    } catch {
        // If file doesn't exist or can't be read, default to 2 spaces
        return { amount: 2, type: "space" }
    }
}
