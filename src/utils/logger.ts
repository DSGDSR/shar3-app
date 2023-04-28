const debugLog = (text: string): void => {
    console.warn(`%cDEBUG%c: ${text}'`, 'color:white;font-style:bold;background-color:orange;padding: 2px 4px 2px 4px;font-size:12px', null)
}

export const logger = {
    debug: debugLog
}