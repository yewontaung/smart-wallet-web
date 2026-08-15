import { useCallback, useState } from "react";

export interface UseModalOptions {
    defaultOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

export function useModal(options: UseModalOptions = {}) {
    const { defaultOpen = false, onOpen, onClose } = options;
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const open = useCallback(() => {
        setIsOpen(true);
        onOpen?.();
    }, [onOpen]);

    const close = useCallback(() => {
        setIsOpen(false);
        onClose?.();
    }, [onClose]);

    const toggle = useCallback(() => {
        setIsOpen((prev) => {
            const next = !prev;
            if (next) onOpen?.();
            else onClose?.();
            return next;
        });
    }, [onOpen, onClose]);

    return { isOpen, open, close, toggle };
}