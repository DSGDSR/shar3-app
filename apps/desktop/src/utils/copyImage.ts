import { ThemeMode } from "@shared"
import { b64toBlob, svgString2Image } from "./base64"

export const copyQrToClipboard = (id: string, theme: () => ThemeMode): Promise<string> => {
    return new Promise((resolve, reject) => {
        const svg = document.getElementById(id)
        if (svg) {
            try {
                const svgString = new XMLSerializer().serializeToString(svg)
                svgString2Image(svgString, async (pngData) => {
                    const blob = await b64toBlob(pngData)
                    navigator.clipboard.write([new ClipboardItem({
                        [blob.type]: blob
                    })]).then(() => {
                        resolve('generic.qr_copied.success')
                    }).catch((err) => {
                        reject('generic.qr_copied.error') // log event
                    });
                }, theme() === 'dark' ? '#000' : '#fff')
            } catch (err) {
                reject('generic.qr_copied.error') // log event
            }
        } else {
            reject('generic.qr_copied.error') // log event
        }
    })
}