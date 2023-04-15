import Modal from '@components/Modal'
import QRCode from 'react-qr-code'
import { b64toBlob, svgString2Image } from '@utils'
import { useTheme } from '@hooks'

const SharingModal = ({ shared, onStop }: any) => {
    const { theme } = useTheme()
    const qrId = 'share-qr-id';

    const copyQrToClipboard = () => {
        const svg = document.getElementById(qrId)
        if (svg) {
            try {
                const svgString = new XMLSerializer().serializeToString(svg)
                svgString2Image(svgString, async (pngData) => {
                    console.log(pngData)
                    const blob = await b64toBlob(pngData)
                    navigator.clipboard.write([new ClipboardItem({
                        [blob.type]: blob
                    }), new ClipboardItem({
                        ['plain/text']: 'asd'
                    })]);
                    console.log('copied')
                }, theme() === 'dark' ? '#000' : '#fff')
            } catch {
                // ERRROR TODO
            }
        } else {
            // ERRROR TODO
        }
    }

    return (
        <Modal
            hidden={!!shared}
            title='Sharing directory...'
            body={<>
                { shared && <QRCode
                    className="mx-auto"
                    id={qrId}
                    size={200}
                    value={shared}
                    bgColor={'transparent'}
                    fgColor={theme() === 'dark' ? 'white' : 'black'}
                /> }
            </>}
            footer={<>
                <div className="flex items-center justify-end p-6 space-x-2 rounded-b">
                    <button onClick={copyQrToClipboard} type="button" className="text-red-800 hover:text-white border-2 border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Copy</button>
                    <button onClick={onStop} type="button" className="text-red-800 hover:text-white border-2 border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Stop sharing</button>
                </div>
            </>}
            onClose={onStop}
        />
    )
}

export default SharingModal