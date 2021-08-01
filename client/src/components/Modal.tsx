import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean,
    children: ReactNode,
    onClose: () => void,
}

export default function Modal(props: ModalProps) {
    if (!props.isOpen) { return null; }
    return (
        <div className="modalBackdrop">
            <div className="modal">
                {props.children}
                <div className="footer">
                    <button onClick={props.onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}