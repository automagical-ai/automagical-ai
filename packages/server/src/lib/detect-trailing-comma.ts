import fs from "fs"
import { join } from "path"

export type TrailingCommaPreference = "none" | "es5" | "all"

/**
 * Detects trailing comma preference from the literal text of `automagical.config.ts`.
 * - Returns "all" if a trailing comma is found before ")" (function params/calls)
 * - Else returns "es5" if a trailing comma is found before "}" or "]"
 * - Else returns "none"
 */
export function detectTrailingComma(): TrailingCommaPreference {
    try {
        const tsFilePath = join(process.cwd(), "automagical.config.ts")
        if (!fs.existsSync(tsFilePath)) return "none"

        const contents = fs.readFileSync(tsFilePath, "utf8")

        // Remove block and line comments
        const withoutComments = contents
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/(^|[^:])\/\/.*$/gm, "$1")

        // Remove string/template literals to avoid false positives inside strings
        const withoutStrings = withoutComments
            .replace(/'(?:[^'\\]|\\.)*'/g, "'")
            .replace(/"(?:[^"\\]|\\.)*"/g, '"')
            .replace(/`(?:[^`\\]|\\.)*`/g, "`")

        // Detect trailing comma before a closing paren: function call/params
        const hasTrailingInParens = /,(?:\s|\r?\n)*\)/.test(withoutStrings)
        if (hasTrailingInParens) return "all"

        // Detect trailing comma before a closing brace/bracket: objects/arrays
        const hasTrailingInBracesOrBrackets = /,(?:\s|\r?\n)*[}\]]/.test(
            withoutStrings
        )
        if (hasTrailingInBracesOrBrackets) return "es5"

        return "none"
    } catch {
        return "none"
    }
}
