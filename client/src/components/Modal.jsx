import React from 'react'
import '../styles/modal.css'

export const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;
    
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}
