import { useState, useEffect } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(() => {
        const storedValue = sessionStorage.getItem(key);
        if (storedValue !== null) {
            try {
                return JSON.parse(storedValue);
            } catch (e) {
                return defaultValue;
            }
        }
        return defaultValue;
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState] as const;
}
