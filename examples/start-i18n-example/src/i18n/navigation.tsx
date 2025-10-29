import {
    type LinkProps,
    Link as TanStackLink,
    useParams
} from "@tanstack/react-router"
import type { ComponentPropsWithRef } from "react"
import { routing } from "./routing"

type LocaleTo<T> = T extends `/{-$locale}${infer Rest}`
    ? Rest extends ""
        ? "/"
        : Rest
    : T

type LocaleLinkProps = ComponentPropsWithRef<"a"> &
    Omit<LinkProps, "to"> & {
        to: LocaleTo<LinkProps["to"]>
    }

export function Link({ to, params, ...props }: LocaleLinkProps) {
    let { locale } = useParams({ strict: false })

    locale = locale || routing.defaultLocale

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
