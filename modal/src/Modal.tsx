import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal ({isOpen, onClose, children}:ModalProps) {

    const downOnOverlay = useRef<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if(!isOpen) return;
        function handleKeyDown(e) {
            if(e.key === 'Escape'){
                onClose();
            }
        } 
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    },[isOpen, onClose])

    useEffect(() => {
        if(!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        modalRef.current?.focus();
        return () => previouslyFocused?.focus();
    }, [isOpen])

    if(!isOpen) return null;


    function handleOverlayClick(e) {
        if(downOnOverlay.current && e.target === e.currentTarget) {
            onClose();
        }
    }

    function handleOverlayMouseDown(e) {
        downOnOverlay.current = e.target === e.currentTarget;
    }

    function handleTabKey(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key !== 'Tab') return;

        const modal = modalRef.current;
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(FOCUSABLE);

        // Nothing to focus inside: keep focus where it is
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
            // Shift+Tab on the first element (or the modal box itself) wraps to the last
            if (active === first || active === modal) {
                e.preventDefault();
                last.focus();
            }
        } else if (active === last) {
            // Tab on the last element wraps to the first
            e.preventDefault();
            first.focus();
        }
    }

    return createPortal(
        <div className="overlay" onMouseDown={handleOverlayMouseDown} onClick={handleOverlayClick}>
            <div className="modal" role='dialog' aria-modal='true' ref={modalRef} tabIndex={-1} aria-label="modal aria" onKeyDown={handleTabKey}>
                <button className="close-btn" onClick={onClose} aria-label="Close">x</button>
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal