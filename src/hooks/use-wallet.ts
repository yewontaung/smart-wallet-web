import { createContext, useContext } from "react"

export type WalletContextValue = {
    accountId:number,
    walletId:number,
    phoneNo:string,
    currentBalance:number,
}

export const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export const useWallet = () => {
    const context = useContext(WalletContext)
    if (!context) throw new Error("useWallet must be used within WalletProvider");
    return context
}
