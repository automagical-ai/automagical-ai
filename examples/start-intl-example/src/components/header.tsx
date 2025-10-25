import { useRouter } from "@tanstack/react-router"
import { useTranslations } from "use-intl"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export function Header() {
    const { navigate } = useRouter()
    const t = useTranslations()

    return (
        <>
            <div className="p-2 flex gap-2 text-lg justify-between">
                <div className="flex gap-2 text-lg">
                    <Link
                        to="/"
                        activeProps={{
                            className: "font-bold"
                        }}
                        activeOptions={{ exact: true }}
                    >
                        {t("home_page")}
                    </Link>

                    <Link
                        to="/about"
                        activeProps={{
                            className: "font-bold"
                        }}
                    >
                        {t("about_page")}
                    </Link>
                </div>

                <div className="flex gap-2 text-lg">
                    {routing.locales.map((locale) => (
                        <button
                            key={locale}
                            type="button"
                            onClick={() => {
                                navigate({
                                    to: "/{-$locale}",
                                    params: { locale }
                                })
                            }}
                            data-active-locale={true}
                            className="rounded p-1 px-2 border border-gray-300 cursor-pointer data-[active-locale=true]:bg-gray-500 data-[active-locale=true]:text-white"
                        >
                            {locale}
                        </button>
                    ))}
                </div>
            </div>

            <hr />
        </>
    )
}
