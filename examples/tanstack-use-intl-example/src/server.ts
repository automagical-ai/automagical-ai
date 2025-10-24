import handler from "@tanstack/react-start/server-entry"

export default {
    fetch(request: Request) {
        // const url = new URL(request.url)

        // if (url.pathname.startsWith("/en")) {
        //     const newPath = url.pathname.replace(/^\/en/, "") || "/"
        //     const redirectUrl = new URL(newPath + url.search, url.origin)
        //     return Response.redirect(redirectUrl.toString(), 302)
        // }

        return handler.fetch(request)
    }
}
