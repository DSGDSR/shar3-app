import { ThemeMode } from '../types';

export interface Settings {
    publicShare: boolean
    theme: ThemeMode
    auth: {
        enabled: boolean
        username: string
        password: string
    } | null
    shortcuts: boolean
}