import type { LocalePrefixMode, Pathnames, RoutingConfig } from "../routing"
import type { Locales } from "../routing/types"

export default function createIntlMiddleware<
    const AppLocales extends Locales,
    const AppLocalePrefixMode extends LocalePrefixMode = "always",
    const AppPathnames extends Pathnames<AppLocales> = never
>(routing: RoutingConfig<AppLocales, AppLocalePrefixMode, AppPathnames>) {}
