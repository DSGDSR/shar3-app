import { Locale, ThemeMode } from '../types';

export interface Settings {
    locale: Locale
    publicShare: boolean
    theme: ThemeMode
    auth: {
        enabled: boolean
        username: string
        password: string
    } | null
    shortcuts: boolean
}