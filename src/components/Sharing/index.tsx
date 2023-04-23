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

    const copyURLToClipboard = () => {
        try {
            navigator.clipboard.writeText(shared).catch(() => {
                // TODO ERRor
            });
        } catch {
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
            <Modal.Body className='flex flex-col xs:flex-row items-center space-x-4'>
                <div className='flex w-7/12'>
                    <div className='flex w-fit'>
                        <QRCode
                            id={qrId}
                            value={shared ?? ''}
                            bgColor={'transparent'}
                            className='w-[228px] h-[228px] xs:w-full xs:h-full'
                            fgColor={theme() === 'dark' ? 'white' : 'black'}
                        />
                    </div>
                </div>
                <div className='w-5/12 space-y-5 justify-start'>
                    <span className='text-white text-md mt-4'>Access using this <Link className="text-blue-400 font-bold" url={shared}>url</Link></span>
                    
                    <button disabled={copyQr !== QrCopyState.default} type="button" onClick={copyQrToClipboard} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        { copyQr === QrCopyState.copying
                            ? <><SpinIcon className="inline mr-3"/> Copying...</>
                            : (copyQr === QrCopyState.copied
                                ? <><TickIcon className="inline mr-3"/> Copied!</>
                                : <>Copy QR image</>)}
                    </button>

                    <button type="button" onClick={copyURLToClipboard} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        Copy link
                    </button>

                    <button onClick={onStop} type="button" className="text-red-800 hover:text-white border-2 border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Stop sharing</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SharingModal