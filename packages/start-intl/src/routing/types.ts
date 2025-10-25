// We intentionally don't use `Locale` here to avoid a circular reference
// when `routing` is used to initialize the `Locale` type.
export type Locales = ReadonlyArray<string>

export type LocalePrefixMode = "always" | "as-needed" | "never"

type Pathname = string

export type LocalePrefixes<AppLocales extends Locales> = Partial<
    Record<AppLocales[number], Pathname>
>

export type LocalePrefixConfigVerbose<
    AppLocales extends Locales,
    AppLocalePrefixMode extends LocalePrefixMode
> = AppLocalePrefixMode extends "always"
    ? {
          mode: "always"
          prefixes?: LocalePrefixes<AppLocales>
      }
    : AppLocalePrefixMode extends "as-needed"
      ? {
            mode: "as-needed"
            prefixes?: LocalePrefixes<AppLocales>
        }
      : {
            mode: "never"
        }

export type LocalePrefix<
    AppLocales extends Locales = [],
    AppLocalePrefixMode extends LocalePrefixMode = "always"
> =
    | AppLocalePrefixMode
    | LocalePrefixConfigVerbose<AppLocales, AppLocalePrefixMode>

export type Pathnames<AppLocales extends Locales> = Record<
    Pathname,
    Partial<Record<AppLocales[number], Pathname>> | Pathname
>
