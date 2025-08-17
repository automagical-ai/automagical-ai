import { routeHandler } from "@automagical-ai/server"

import automagicalConfig from "@/../automagical.json"

export default routeHandler(automagicalConfig, {
    apiUrl: "http://localhost:3000"
})
