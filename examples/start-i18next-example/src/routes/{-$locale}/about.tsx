import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/about")({
    component: About
})

function About() {
    return (
        <main className="container mx-auto p-4">
            <h1>About</h1>
        </main>
    )
}
