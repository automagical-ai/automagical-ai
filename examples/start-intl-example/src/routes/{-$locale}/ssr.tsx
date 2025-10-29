import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/ssr")({
    component: RouteComponent
})

function RouteComponent() {
    return <main className="container mx-auto p-4">Hello "/-$locale/ssr"!</main>
}
