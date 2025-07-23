/**
 * Sets a value in a nested object using dot notation
 * @example
 * const obj = {}
 * deepSet(obj, "user.name", "John") // { user: { name: "John" } }
 */
export function deepSet(obj: Record<string, unknown>, path: string, value: string): void {
    const keys = path.split(".")
    let current = obj as Record<string, unknown>

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]

        if (!current[key] || typeof current[key] !== "object") {
            current[key] = {}
        }

        current = current[key] as Record<string, unknown>
    }

    current[keys[keys.length - 1]] = value
}
