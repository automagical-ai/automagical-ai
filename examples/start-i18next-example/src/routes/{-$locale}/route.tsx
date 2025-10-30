import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Header } from "@/components/header"
import { localeDetection } from "@/i18n/detection"

export const Route = createFileRoute("/{-$locale}")({
    beforeLoad: async (context) => {
        const locale = localeDetection(context)

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
