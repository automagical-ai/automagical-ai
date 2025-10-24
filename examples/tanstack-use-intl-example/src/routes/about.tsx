import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
    component: RouteComponent
})

function RouteComponent() {
    return <div>{`m.about_message()`}</div>
}
