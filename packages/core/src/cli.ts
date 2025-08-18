#!/usr/bin/env node

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
} else {
    console.error(`Unknown command: ${command}`)
    console.log("")
    console.log("Usage: automagical <command>")
    console.log("")
    console.log("Commands:")
    console.log("  sync    Sync translations")
    process.exit(1)
}
