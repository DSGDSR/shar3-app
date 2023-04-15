import { ThemeMode } from '@shared';
import { useThemeMode } from 'flowbite-react';

export default () => {
    const [mode, setMode] = useThemeMode()

    const theme = (): ThemeMode => {
        return document.documentElement.classList.contains('dark')
            ? 'dark' : 'light'
    } 

    const setTheme = (mode: ThemeMode) => {
        setMode(mode)
        if (mode === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return {
        theme,
        setTheme
    }
};