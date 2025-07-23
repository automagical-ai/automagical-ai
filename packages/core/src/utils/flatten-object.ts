/**
 * Flattens a nested object into a list of dot-notation keys
 * @example
 * flattenObject({ "user": { "name": "John", "address": { "city": "NY" } } })
 * // ["user.name", "user.address.city"]
 */
export function flattenObject(obj: Record<string, unknown>, prefix = ""): string[] {
    return Object.keys(obj).reduce<string[]>((acc, key) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key

        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            // For nested objects, recursively flatten
            acc.push(...flattenObject(obj[key] as Record<string, unknown>, prefixedKey))
        } else {
            // For primitive values, just add the key
            acc.push(prefixedKey)
        }

        return acc
    }, [])
}
