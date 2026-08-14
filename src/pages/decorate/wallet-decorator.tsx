import type { ReactNode } from "react";

export function WalletDecorator({children}:{children:ReactNode}) {
    return (
        <div>
            {children}
        </div>
    )
}