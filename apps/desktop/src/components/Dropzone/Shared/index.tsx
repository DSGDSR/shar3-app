import QRCode from 'react-qr-code'
import { Tooltip } from 'flowbite-react'
import StopShare from "../StopShare"
import { useTheme } from "@hooks"
import { ipcRenderer } from 'electron'
import { copyQrToClipboard, copyURLToClipboard } from '@utils'
import { WhatsappIcon, TelegramIcon, EmailIcon } from '@icons'
import { Translator } from '@shared'
import Link from '@components/Link'
import { toast } from 'sonner'
import Button from '@components/Button'

interface SharedProps {
    onStop: () => void
    shared: string
    T: Translator
}

const iconClasses = 'duration-200 ease inline-flex items-center mr-1.5 transition p-2.5 rounded-md text-white bg-secondary hover:bg-secondaryHover'

const Shared = ({ shared, onStop, T }: SharedProps) => {
    const { theme } = useTheme()
    const qrId = 'share-qr-id';

    const copyToast = (promise: Promise<string>, loading: string) => toast.promise(promise, {
        loading: T(loading),
        success: (success) => T(success),
        error: (error) => T(error),
    });

    return <div className="flex w-full h-full items-center justify-center py-8 px-9 gap-9 sm:gap-12">
        <div className='flex h-full items-center w-1/2'>
            <Tooltip content={T('generic.navigate_url')} placement='bottom' arrow={false}>
                <QRCode
                    id={qrId}
                    value={shared ?? ''}
                    size={null as any}
                    bgColor={'transparent'}
                    className='w-full h-full rounded-md cursor-pointer'
                    onClick={() => ipcRenderer.invoke('open-link', shared)}
                    fgColor={theme() === 'dark' ? '#b6c0ce' : '#3a4049'}
                />
            </Tooltip>
        </div>    
        <div className='flex flex-col text-gray-900 dark:text-gray-300 text-sm sm:text-base w-1/2 justify-center h-full'>
            <Button onClick={() => copyToast(copyURLToClipboard(shared), 'generic.url_copied.loading')} className="mb-2.5 sm:mb-3.5">
                {T('generic.copy_url')}
            </Button>
            <Button onClick={() => copyToast(copyQrToClipboard(qrId, theme), 'generic.qr_copied.loading')} className="mb-6 sm:mb-8">
                {T('generic.copy_image')}
            </Button>

            <span className='mb-2.5 block'>{T('generic.share')}</span>
            <div className="sharing-buttons flex flex-wrap">
                <Link href={`https://wa.me/?text=${T('generic.share_url')}%20%0D%0A%0D%0A${shared}`} aria-label="Share on Whatsapp" draggable="false" className={iconClasses}>
                    <WhatsappIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                </Link>
                <Link href={`https://telegram.me/share/url?text=${T('generic.share_url')}&amp;url=${shared}`} aria-label="Share on Telegram" draggable="false" className={iconClasses}>
                    <TelegramIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                </Link>
                <Link href={`mailto:?subject=${T('generic.share_mail_subject')}&body=${T('generic.share_url')}%20%0D%0A%0D%0A${shared}`} aria-label="Share by Email" draggable="false" className={iconClasses}>
                    <EmailIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
                </Link>
            </div>
        </div>
        <StopShare onStop={onStop} T={T}/>
    </div>
}

export default Shared