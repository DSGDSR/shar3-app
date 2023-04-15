import {CrossIcon} from "@icons";

interface ModalProps {
    id?: string;
    hidden: boolean;
    title: string;
    body: any;
    footer: any;
    onClose: () => void;
}

const Modal = ({id, hidden, title, body, footer, onClose}: ModalProps) => {
    return <>
        <div
            id={`${id}-modal`}
            data-modal-backdrop="static"
            aria-hidden="true"
            className={(hidden ? '' : 'hidden') + ' fixed top-0 left-0 right-0 z-50 w-full p-6 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full bg-[rgba(0,0,0,0.5)]'}
        >
            <div className="relative w-full max-w-2xl max-h-full shadow mx-auto !top-0 !transform-none" style={{
                top: '50%',
                transform: 'translateY(-50%)'
            }}>
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button onClick={onClose} data-modal-hide={`${id}-modal`} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <CrossIcon/>
                        </button>
                    </div>
            
                    <div className="p-6 space-y-6 mx-auto max-h-[85vh] overflow-y-auto">
                        {body}
                    </div>

                    {footer}
                </div>
            </div>
        </div>
    </>
}

export default Modal