import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Header } from "@/components/header"
import { localeMiddleware } from "@/i18n/middleware"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (context) => {
        const locale = localeMiddleware(context)

        return {
            locale
        }
    },
    component: LocaleLayoutComponent
})

function LocaleLayoutComponent() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
