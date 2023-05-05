import { useState, useCallback } from "react";

function useDebounce<T extends unknown[]>(callback: (...args: T) => void, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((...args: T) => {
        if (timer)
            clearTimeout(timer);

        setTimer(setTimeout(() => callback(...args), delay));
    }, [callback, delay, timer]);

    return debouncedCallback;
}

export default useDebounce;
