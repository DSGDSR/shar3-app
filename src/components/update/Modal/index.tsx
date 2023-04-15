import React, { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './modal.module.css'
import { CrossIcon } from '@icons'

const ModalTemplate: React.FC<React.PropsWithChildren<{
  title?: ReactNode
  footer?: ReactNode
  cancelText?: string
  okText?: string
  onCancel?: () => void
  onOk?: () => void
  width?: number
}>> = props => {
  const {
    title,
    children,
    footer,
    cancelText = 'Cancel',
    okText = 'OK',
    onCancel,
    onOk,
    width = 530,
  } = props

  return (
    <div className={styles.modal}>
      <div className='modal-mask' />
      <div className='modal-warp'>
        <div className='modal-content' style={{ width }}>
          <div className='modal-header'>
            <div className='modal-header-text'>{title}</div>
            <span
              className='modal-close'
              onClick={onCancel}
            >
              <CrossIcon/>
            </span>
          </div>
          <div className='modal-body'>{children}</div>
          {typeof footer !== 'undefined' ? (
            <div className='modal-footer'>
              <button onClick={onCancel}>{cancelText}</button>
              <button onClick={onOk}>{okText}</button>
            </div>
          ) : footer}
        </div>
      </div>
    </div>
  )
}

const Modal = (props: Parameters<typeof ModalTemplate>[0] & { open: boolean }) => {
  const { open, ...omit } = props

  return createPortal(
    open ? ModalTemplate(omit) : null,
    document.body,
  )
}

export default Modal
