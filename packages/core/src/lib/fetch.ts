import { createFetch } from "@better-fetch/fetch"

export const $fetch = createFetch({
    retry: {
        type: "linear",
        attempts: 3,
        delay: 1000
    },
    throw: true
})
