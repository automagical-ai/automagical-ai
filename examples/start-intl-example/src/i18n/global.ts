// import type messages from "@/../messages/en.json"

import type { routing } from "@/i18n/routing"

declare module "use-intl" {
    interface AppConfig {
        Locale: (typeof routing.locales)[number]
        Messages: {
            root: typeof import("../../messages/en/root.json")
            index: typeof import("../../messages/en/index.json")
            about: typeof import("../../messages/en/about.json")
        }
    }
}
