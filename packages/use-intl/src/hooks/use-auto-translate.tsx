import {
    AutoTranslate,
    type AutoTranslateProps
} from "../components/auto-translate"

export interface UseAutoTranslateOptions {
    namespace?: string
}

const stableComponents = new Map<string | undefined, typeof AutoTranslate>()

export function useAutoTranslate({ namespace }: UseAutoTranslateOptions = {}) {
    if (!stableComponents.has(namespace)) {
        const AutoTranslateWithNamespace = (props: AutoTranslateProps) => (
            <AutoTranslate
                {...props}
                namespace={props.namespace || namespace}
            />
        )

        stableComponents.set(namespace, AutoTranslateWithNamespace)
    }

    return {
        AutoTranslate: stableComponents.get(namespace)!
    }
}
