import { createIsomorphicFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import { routing } from "./routing"

const i18nCookieName = "START_LOCALE"

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {},
        fallbackLng: routing.defaultLocale,
        supportedLngs: routing.locales,
        detection: {
            order: ["cookie"],
            lookupCookie: i18nCookieName,
            caches: ["cookie"],
            cookieMinutes: 60 * 24 * 365
        },
        interpolation: {
            escapeValue: false
        }
    })

export const setSSRLanguage = createIsomorphicFn().server(async () => {
    const locale = getCookie(i18nCookieName)
    await i18n.changeLanguage(locale || routing.defaultLocale)
})

export default i18n
