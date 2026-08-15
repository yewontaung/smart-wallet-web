import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
    title?: string;
    children: React.ReactNode;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    className?: string;
    id?: string;
}

export function Modal({
    isOpen,
    onClose,
    onOpen,
    title,
    children,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    className = "",
    id = "modal",
}: ModalProps) {
    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            wasOpenRef.current = true;
            onOpen?.();
            window.dispatchEvent(new CustomEvent("modal:open", { detail: { id } }));
        } else if (!isOpen && wasOpenRef.current) {
            wasOpenRef.current = false;
            window.dispatchEvent(new CustomEvent("modal:close", { detail: { id } }));
        }
    }, [isOpen, onOpen, id]);

    useEffect(() => {
        if (!isOpen || !closeOnEsc) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeOnEsc, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? `${id}-title` : undefined}
        >
            {/* Overlay — solid dim, no blur */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Panel — flat, solid surface, no glass */}
            <div
                className={`relative w-full md:w-1/3 max-h-[85vh] overflow-y-auto
                            rounded-2xl border border-white/10 bg-neutral-900
                            text-white shadow-xl
                            p-5 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {(title) && (
                    <div className="flex items-center justify-between mb-4">
                        {title ? (
                            <h4 id={`${id}-title`} className="text-xl font-semibold">
                                {title}
                            </h4>
                        ) : (
                            <span />
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="rounded-full p-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <XIcon size={18} />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>,
        document.body
    );
}