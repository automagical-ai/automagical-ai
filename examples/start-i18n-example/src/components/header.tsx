import { useParams } from "@tanstack/react-router"
import { Link } from "@/i18n/navigation"
import { routing } from "../i18n/routing"

export function Header() {
    const { locale } = useParams({ strict: false })
    const currentLocale = locale || routing.defaultLocale

    return (
        <header className="border-b sticky top-0 z-50 bg-background">
            <div className="container flex items-center mx-auto justify-between p-4">
                <div className="flex items-center gap-5">
                    <Link to="/">
                        <h1 className="text-lg font-bold">start-i18n demo</h1>
                    </Link>

                    <span className="border-r self-stretch" />

                    <Link to="/about" className="text-sm hover:underline">
                        About
                    </Link>
                </div>

                <div className="relative group">
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            if (!(e.target instanceof HTMLButtonElement)) return
                            if (e.target !== document.activeElement) return

                            e.preventDefault()
                            e.stopPropagation()
                            e.target.blur()
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
                                params={{
                                    locale: locale
                                }}
                                onClick={(e) => {
                                    ;(e.target as HTMLLinkElement).blur()
                                }}
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
