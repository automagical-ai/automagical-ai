/**
 * Initial visibility script
 * This runs before React hydration to prevent FOUC (Flash of Unstyled Content)
 *
 * Placeholders:
 * - __INITIAL_VISIBILITY__: The initial visibility state
 */

const routing = {
    locale: "__LOCALE",
    locales: "__ROUTING_LOCALES__".split(","),
    defaultLocale: "__ROUTING_DEFAULT_LOCALE__",
    localePrefix: "__ROUTING_LOCALE_PREFIX__",
    localeCookie: "__ROUTING_LOCALE_COOKIE__",
    localeDetection: Boolean("__ROUTING_LOCALE_DETECTION__")
}

// Set HTML visibility
document.documentElement.style.visibility = "__INITIAL_VISIBILITY__"
