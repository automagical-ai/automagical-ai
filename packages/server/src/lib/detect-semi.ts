import fs from "fs"
import { join } from "path"

/**
 * Detects whether semicolons are used in `automagical.config.ts`.
 * Does not resolve any tooling config; inspects the file text directly.
 * Falls back to false (no semicolons) if the file is missing or ambiguous,
 * to preserve existing behavior.
 */
export function detectSemi(): boolean {
    try {
        const tsFilePath = join(process.cwd(), "automagical.config.ts")

        if (!fs.existsSync(tsFilePath)) {
            return false
        }

        const contents = fs.readFileSync(tsFilePath, "utf8")

        // Remove block and line comments
        const withoutComments = contents
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/.*$/gm, "$1")

        // Remove string literals (single, double, backtick) to avoid counting semicolons inside strings
        const withoutStrings = withoutComments
            .replace(/'(?:[^'\\]|\\.)*'/g, "'")
            .replace(/"(?:[^"\\]|\\.)*"/g, '"')
            .replace(/`(?:[^`\\]|\\.)*`/g, "`")

        // Count semicolons that appear at end-of-line (most indicative of style)
        const endOfLineSemicolons =
            withoutStrings.match(/;[ \t]*(?:\r?\n|$)/g) || []

        if (endOfLineSemicolons.length > 0) {
            return true
        }

        // Otherwise assume no semicolons
        return false
    } catch {
        return false
    }
}
