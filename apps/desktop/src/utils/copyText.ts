export const copyURLToClipboard = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            navigator.clipboard.writeText(url)
                .then(() => resolve('generic.url_copied.success'))
                .catch((err) => {
                    // log err
                    reject('generic.url_copied.error')
                });
        } catch (err) {
            // log err
            reject('generic.url_copied.error')
        }
    })
}