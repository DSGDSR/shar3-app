const UNITS: Record<string, number> = {
    year  : 24 * 60 * 60 * 1000 * 365,
    month : 24 * 60 * 60 * 1000 * 365/12,
    day   : 24 * 60 * 60 * 1000,
    hour  : 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000
}

const DEFAULTS: {
    locale: string
    options: Intl.RelativeTimeFormatOptions
} = {
    locale: 'en',
    options: { numeric: 'auto' }
}

export class RelativeTime {
    private rtf: Intl.RelativeTimeFormat;

    constructor(settings?: {
        locale: string | string[] | undefined
        options: Intl.RelativeTimeFormatOptions | undefined
    }) {
        settings = {
          locale: settings?.locale || DEFAULTS.locale,
          options: {...DEFAULTS.options, ...settings?.options}
        }
    
        this.rtf = new Intl.RelativeTimeFormat(settings.locale, settings.options)
    }

    from (d1: Date, d2?: Date) {
        const elapsed = d1.getTime() - (d2 || new Date()).getTime()
  
        // "Math.abs" accounts for both "past" & "future" scenarios
        for (let u in Object.keys(UNITS))
          if (Math.abs(elapsed) > UNITS[u] || u == 'second')
            return this.rtf.format(Math.round(elapsed/UNITS[u]), u as Intl.RelativeTimeFormatUnit)
    }
}
