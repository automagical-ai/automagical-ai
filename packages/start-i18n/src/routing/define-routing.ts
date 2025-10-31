import type { RoutingConfig } from "./config"
import type { LocalePrefixMode, Locales, Pathnames } from "./types"

export default function defineRouting<
    const AppLocales extends Locales,
    const AppLocalePrefixMode extends LocalePrefixMode = "always",
    const AppPathnames extends Pathnames<AppLocales> = never
>(config: RoutingConfig<AppLocales, AppLocalePrefixMode, AppPathnames>) {
    return config
}
