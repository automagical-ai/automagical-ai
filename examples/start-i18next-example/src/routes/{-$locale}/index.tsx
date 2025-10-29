import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/")({
    component: Home
})

function Home() {
    return (
        <main className="container mx-auto p-4">
            <h1>Hello World</h1>
        </main>
    )
}
