import { useMemo } from "react"
import {
    AutoTranslate,
    type AutoTranslateProps
} from "../components/auto-translate"

export interface UseAutoTranslateOptions {
    namespace?: string
}

export interface UseAutoTranslateReturn {
    AutoTranslate: React.ComponentType<AutoTranslateProps>
}

export function useAutoTranslate({
    namespace
}: UseAutoTranslateOptions = {}): UseAutoTranslateReturn {
    const AutoTranslateWithNamespace = useMemo(() => {
        return function AutoTranslateWithNamespace(props: AutoTranslateProps) {
            return (
                <AutoTranslate
                    {...props}
                    namespace={props.namespace || namespace}
                />
            )
        }
    }, [namespace])

    return { AutoTranslate: AutoTranslateWithNamespace }
}
