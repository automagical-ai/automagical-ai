import type { AutomagicalConfig } from "@automagical-ai/core"
import fs from "fs"
import { stringify } from "javascript-stringify"
import { join } from "path"
import prettier from "prettier"
import { detectIndentation } from "./detect-indentation"
import { detectQuotes } from "./detect-quotes"
import { detectSemi } from "./detect-semi"
import { detectTrailingComma } from "./detect-trailing-comma"

/**
 * Saves the AutomagicalConfig to automagical.config.ts while preserving indentation
 * @param config The configuration to save
 */
export async function saveConfig(config: AutomagicalConfig) {
    try {
        const indentation = detectIndentation()
        const quotes = detectQuotes()
        const semi = detectSemi()
        const trailingComma = detectTrailingComma()
        const filePath = join(process.cwd(), "automagical.config.ts")

        // Normalize and reorder properties to ensure updatedAt is always at the bottom
        const { updatedAt, ...restConfig } = config
        const normalizedUpdatedAt =
            typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt
        const orderedConfig = {
            ...restConfig,
            updatedAt: normalizedUpdatedAt
        }

        const header = `import type { AutomagicalConfig } from "@automagical-ai/core"\n\n`
        const objectLiteral = stringify(orderedConfig, null, indentation.amount)
        const body = `const automagicalConfig = ${objectLiteral} as const satisfies AutomagicalConfig\n\nexport default automagicalConfig\n`

        const formatted = await prettier.format(`${header}${body}`, {
            parser: "typescript",
            tabWidth: indentation.amount,
            useTabs: indentation.type === "tab",
            singleQuote: quotes === "single",
            semi,
            trailingComma
        })

        fs.writeFileSync(filePath, formatted)
    } catch (error) {
        console.error(error)
        throw new Error("Failed to save automagical.config.ts config file")
    }
}
