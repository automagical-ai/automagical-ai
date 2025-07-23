/**
 * Deletes a nested key from an object using dot notation
 * @example
 * const obj = { user: { name: "John", age: 30 } }
 * deepDelete(obj, "user.name") // { user: { age: 30 } }
 */
export function deepDelete(obj: Record<string, unknown>, path: string): void {
    const keys = path.split(".")
    let current = obj

    // Navigate to the parent object containing the key to delete
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key] || typeof current[key] !== "object") {
            // If any part of the path doesn't exist, there's nothing to delete
            return
        }
        current = current[key] as Record<string, unknown>
    }

    // Delete the key from its parent
    const lastKey = keys[keys.length - 1]
    delete current[lastKey]

    // Clean up empty parent objects (optional)
    if (Object.keys(current).length === 0 && keys.length > 1) {
        deepDelete(obj, keys.slice(0, -1).join("."))
    }
}
