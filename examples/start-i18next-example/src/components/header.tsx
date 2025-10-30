import { useParams } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Link } from "@/i18n/navigation"
import { routing } from "../i18n/routing"

export function Header() {
    const { locale } = useParams({ strict: false })
    const currentLocale = locale || routing.defaultLocale
    const { t } = useTranslation("root")

    return (
        <header className="border-b sticky top-0 z-50 bg-background">
            <div className="container flex items-center mx-auto justify-between p-4">
                <div className="flex items-center gap-5">
                    <Link to="/">
                        <h1 className="text-lg font-bold">start-i18n</h1>
                    </Link>

                    <span className="border-r self-stretch" />

                    <Link to="/about" className="text-sm hover:underline">
                        {t("about")}
                    </Link>
                </div>

                <div className="relative group">
                    <button
                        tabIndex={0}
                        type="button"
                        onMouseDown={(e) => {
                            if (e.target !== document.activeElement) return

                            e.preventDefault()
                            e.stopPropagation()
                            e.target instanceof HTMLElement && e.target.blur()
                        }}
                    >
                        {currentLocale}

                        <span className="-mt-1.5 -me-0.5">⌄</span>
                    </button>

                    <div className="hidden group-focus-within:block mt-1 border absolute bg-background">
                        {routing.locales.map((locale) => (
                            <Link
                                key={locale}
                                to="/"
                                params={{ locale: locale }}
                                onClick={(e) =>
                                    e.target instanceof HTMLElement &&
                                    e.target.blur()
                                }
                            >
                                <button
                                    tabIndex={-1}
                                    type="button"
                                    className="w-full border-none"
                                >
                                    {locale}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}
