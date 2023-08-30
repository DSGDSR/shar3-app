type TParams = {
    count?: number;
    [key: string]: any;
}

export type Translator = (key: string, params?: TParams) => string

export type Locale = 'en' | 'es' | 'de' | 'fr'