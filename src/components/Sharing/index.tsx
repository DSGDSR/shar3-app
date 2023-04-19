import QRCode from 'react-qr-code'
import { b64toBlob, svgString2Image } from '@utils'
import { useTheme } from '@hooks'
import { SpinIcon, TickIcon } from '@icons'
import { Modal } from 'flowbite-react'
import { useState } from 'react'
import Link from '@components/Link'

enum QrCopyState {
    default,
    copying,
    copied
}

const SharingModal = ({ shared, onStop }: any) => {
    const [copyQr, setCopyQr] = useState(QrCopyState.default)
    const {theme} = useTheme()
    const qrId = 'share-qr-id';

    const copyQrToClipboard = () => {
        setCopyQr(QrCopyState.copying)
        const svg = document.getElementById(qrId)
        if (svg) {
            try {
                const svgString = new XMLSerializer().serializeToString(svg)
                svgString2Image(svgString, async (pngData) => {
                    const blob = await b64toBlob(pngData)
                    navigator.clipboard.write([new ClipboardItem({
                        [blob.type]: blob
                    })]).then(() => {
                        setCopyQr(QrCopyState.copied)
                        setTimeout(() => setCopyQr(QrCopyState.default), 1500)
                    }).catch(() => {
                        setCopyQr(QrCopyState.default)
                        // TODO ERRor
                    });
                }, theme() === 'dark' ? '#000' : '#fff')
            } catch {
                setCopyQr(QrCopyState.default)
                // ERRROR TODO
            }
        } else {
            setCopyQr(QrCopyState.default)
            // ERRROR TODO
        }
    }

    return (
        <Modal
            show={!!shared}
            onClose={onStop}
            className="h-screen"
        >
            <Modal.Header>Sharing directory...</Modal.Header>
            <Modal.Body className='flex space-x-7'>
                <div className='flex w-1/2 flex-col items-center'>
                    <QRCode
                        id={qrId}
                        size={200}
                        value={shared ?? ''}
                        bgColor={'transparent'}
                        fgColor={theme() === 'dark' ? 'white' : 'black'}
                    />
                    <span className='text-white text-sm mt-5'>or clicking on this <Link className="text-blue-400 font-bold" url={shared}>url</Link></span>
                </div>
                <div className='w-1/2'>
                    <button disabled={copyQr !== QrCopyState.default} type="button" onClick={copyQrToClipboard} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        { copyQr === QrCopyState.copying
                            ? <><SpinIcon className="inline mr-3"/> Copying...</>
                            : (copyQr === QrCopyState.copied
                                ? <><TickIcon className="inline mr-3"/> Copied!</>
                                : <>Copy QR image</>)}
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex items-center justify-end p-6 space-x-2 rounded-b">
                    <button onClick={copyQrToClipboard} type="button" className="text-red-800 hover:text-white border-2 border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Copy</button>
                    <button onClick={onStop} type="button" className="text-red-800 hover:text-white border-2 border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Stop sharing</button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SharingModal