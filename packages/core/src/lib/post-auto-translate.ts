import { $activeTranslations, $automagical } from "../automagical"
import { $fetch } from "./fetch"

export async function postAutoTranslate(tKey: string, message: string) {
    if ($activeTranslations.get().includes(tKey)) {
        return
    }

    const { baseURL } = $automagical.get()

    $activeTranslations.set([...$activeTranslations.get(), tKey])

    try {
        await $fetch(`${baseURL}/api/automagical/auto-translate`, {
            method: "POST",
            body: {
                key: tKey,
                message
            }
        })
    } catch (error) {
        console.error(error)

        $activeTranslations.set(
            $activeTranslations.get().filter((key) => key !== tKey)
        )

        throw error
    } finally {
        $activeTranslations.set(
            $activeTranslations.get().filter((key) => key !== tKey)
        )
    }
}
