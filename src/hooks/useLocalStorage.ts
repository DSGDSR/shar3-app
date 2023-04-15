import { useEffect, useState } from 'react';

export default <T = any>(key: string, defaultValue: T) => {
    const getValue = (): T => {
        try {
            const saved = localStorage.getItem(key)
            if (saved !== null) {
                return JSON.parse(saved)
            }
            return defaultValue
        } catch {
            return defaultValue
        }
    }

    const [value, setValue] = useState<T>(getValue)

    useEffect(() => {
        const rawValue = JSON.stringify(value)
        localStorage.setItem(key, rawValue)
    }, [key, value])

    return {value, setValue, getValue}
};