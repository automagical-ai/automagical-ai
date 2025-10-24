import { type LinkProps, Link as TanStackLink } from "@tanstack/react-router"
import { useLocale } from "use-intl"

import { routing } from "./routing"

type LocaleTo<T> = T extends `/{-$locale}${infer Rest}`
    ? Rest extends ""
        ? "/"
        : Rest
    : T

type LocaleLinkProps = Omit<LinkProps, "to"> & {
    to: LocaleTo<LinkProps["to"]>
}

export function Link({ to, params, ...props }: LocaleLinkProps) {
    const locale = useLocale()

    const shouldIncludeLocale =
        routing.localePrefix === "as-needed"
            ? locale !== routing.defaultLocale
            : true

    const localizedTo = (
        to?.startsWith("/") ? `/{-$locale}${to}` : to
    ) as LinkProps["to"]

    const mergedParams =
        typeof params === "object"
            ? shouldIncludeLocale
                ? { locale, ...params }
                : { locale: "", ...params }
            : shouldIncludeLocale
              ? { locale }
              : { locale: "" }

    return <TanStackLink to={localizedTo} params={mergedParams} {...props} />
}
