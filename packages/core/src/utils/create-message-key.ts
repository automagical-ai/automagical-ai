import { createHash } from "node:crypto"

export function createMessageKey(message: string) {
    // Convert to lowercase and replace non-alphanumeric characters with hyphens
    let formatted = message
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    if (formatted.length > 24) {
        // Truncate at the last complete word within the length limit
        const lastHyphenIndex = formatted.lastIndexOf("-", 24)
        formatted =
            lastHyphenIndex > 0
                ? formatted.substring(0, lastHyphenIndex)
                : formatted.substring(0, 24).replace(/-+$/g, "")
    }

    // Generate a random hash to ensure uniqueness
    const hash = createHash("sha256")
        .update(message)
        .digest("hex")
        .substring(0, 6)
    return `${formatted}-v:${hash}`
}
