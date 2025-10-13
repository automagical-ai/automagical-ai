import { $automagical } from "../automagical"
import { $fetch } from "./fetch"

export async function deleteTranslation(tKey: string) {
    const { baseURL } = $automagical.get()

    await $fetch(`${baseURL}/api/automagical/translations?key=${tKey}`, {
        method: "DELETE"
    })
}
