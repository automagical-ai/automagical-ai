#!/usr/bin/env tsx

import path from "path"

async function main() {
    const args = process.argv.slice(2)
    const command = args[0]

    if (!command) {
        console.log("Usage: automagical <command>")
        console.log("")
        console.log("Commands:")
        console.log("  sync    Sync translations")
        process.exit(1)
    }

    if (command === "sync") {
        console.log("sync")

        // Load test.ts from the consumer project's root directory
        const testFilePath = path.join(process.cwd(), "automagical.config.ts")
        try {
            const testModule = await import(testFilePath)
            console.log(testModule.default || testModule)
        } catch (error) {
            console.error(`Failed to load test.ts from ${testFilePath}:`, error)
        }
    } else {
        console.error(`Unknown command: ${command}`)
        console.log("")
        console.log("Usage: automagical <command>")
        console.log("")
        console.log("Commands:")
        console.log("  sync    Sync translations")
        process.exit(1)
    }
}

// Run the main function
main().catch((error) => {
    console.error("Unexpected error:", error)
    process.exit(1)
})
