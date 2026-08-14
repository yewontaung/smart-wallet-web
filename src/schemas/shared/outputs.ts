export type TransactionStatus = ""
export type WalletUserType = ""
export type TransactionType = "Income" | "Expence"

export type WalletInfo = {
    walletId:number
    userId:number
    phoneNo:string
    fullName:string
    accountType?:WalletUserType    
}

export type TransactionListItem = {
    trxId: string
    amount: number
    status: TransactionStatus
    note?: string
    operation: string

    receiverWallet: WalletInfo
    senderWallet: WalletInfo

    createdAt: string
    updatedAt: string
}

export type TransactionLogListItem = {
    logId:string
    trxId:string
    trxType:TransactionType
    amount:number
    status:TransactionStatus
    note?:string
    operation:string

    userId:string
    walletinfo:WalletInfo
    createdAt:string
}