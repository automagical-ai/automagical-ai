import { routeHandler } from "@automagical-ai/server"

import automagicalConfig from "@/../automagical.config"

export default routeHandler(automagicalConfig, {
    apiUrl: "http://localhost:3000"
})
