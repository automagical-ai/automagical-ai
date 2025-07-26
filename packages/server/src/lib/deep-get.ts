/**
 * Gets a value from a nested object using dot notation
 * @example
 * const obj = { user: { name: "John" } }
 * deepGet(obj, "user.name") // "John"
 * deepGet(obj, "user.age") // undefined
 */
export function deepGet(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split(".")
    let current: unknown = obj

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        if (current === undefined || current === null || typeof current !== "object") {
            return undefined
        }

        // Safe to cast here as we've checked it's an object
        current = (current as Record<string, unknown>)[key]

        if (i === keys.length - 1) {
            return current
        }
    }

    return undefined
}
