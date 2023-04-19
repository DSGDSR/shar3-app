import { TParams } from 'talkr'

export type Translator = (key: string, params?: TParams) => string

export type Locale = 'en' | 'es' | 'de'