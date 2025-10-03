import { useRef } from "react";

export default function useDebounce() {
    const debounceTimeOut = useRef<NodeJS.Timeout | null>(null)

    const debounce = (callback: () => void, delay: number) => {
        if (debounceTimeOut.current) clearTimeout(debounceTimeOut.current)

        debounceTimeOut.current = setTimeout(() => {
            callback()
            debounceTimeOut.current = null
        }, delay)
    }

    return debounce
}