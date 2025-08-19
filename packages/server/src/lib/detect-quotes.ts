import fs from "fs"
import { join } from "path"

/**
 * Detects whether the project (based on `automagical.config.ts`) prefers single or double quotes.
 * Does not resolve any Prettier config; inspects the file text directly.
 * Falls back to double quotes if the file is missing or ambiguous.
 */
export function detectQuotes(): "single" | "double" {
    try {
        const tsFilePath = join(process.cwd(), "automagical.config.ts")

        if (!fs.existsSync(tsFilePath)) {
            return "double"
        }

        const contents = fs.readFileSync(tsFilePath, "utf8")

        // Strip block and line comments to avoid counting quotes inside comments
        const withoutComments = contents
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/.*$/gm, "$1")

        // Count string literals delimited by single vs double quotes (ignoring escaped quotes)
        const singleMatches = withoutComments.match(/'(?:[^'\\]|\\.)*'/g) || []
        const doubleMatches = withoutComments.match(/"(?:[^"\\]|\\.)*"/g) || []

        if (singleMatches.length > doubleMatches.length) {
            return "single"
        }

        if (doubleMatches.length > singleMatches.length) {
            return "double"
        }

        // Ambiguous or none found → default to Prettier's default (double quotes)
        return "double"
    } catch {
        return "double"
    }
}
