import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { routing } from "./routing"

i18n.use(initReactI18next).init({
    resources: {},
    fallbackLng: routing.defaultLocale,
    supportedLngs: routing.locales
})

export { i18n }
