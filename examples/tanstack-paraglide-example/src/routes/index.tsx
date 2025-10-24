import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: IndexPage })

function IndexPage() {
    return (
        <main className="container mx-auto my-24 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Hello, World!</h1>
        </main>
    )
}
