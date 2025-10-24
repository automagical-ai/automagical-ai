import handler from "@tanstack/react-start/server-entry"
import { paraglideMiddleware } from "./paraglide/server.js"

export default {
    fetch(req: Request): Promise<Response> {
        return paraglideMiddleware(req, ({ request, locale }) => {
            console.log("locale", locale)
            if (locale === "en") {
                return handler.fetch(
                    new Request(request.url.replace("/en", ""), request)
                )
            }

            return handler.fetch(request)
        })
    }
}
