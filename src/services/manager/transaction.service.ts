import { privateRequest } from "../../utils/api"

export interface TransactionWallet {
    walletId: number
    userId: number
    phoneNo: string
    fullName: string
    accountType: string
}

export interface ManagerTransaction {
    trxId: string
    amount: number
    status: string
    note: string | null
    operation: string
    receiverWallet: TransactionWallet
    senderWallet: TransactionWallet
    createdAt: string
    updatedAt: string
}

export interface TransactionListResponse {
    items: ManagerTransaction[]
    page: number
    size: number
    total: number
    pages: number
}

export async function getManagerTransactions(): Promise<TransactionListResponse> {
    return privateRequest<TransactionListResponse>(
        "/manager/transactions/",
        {
            method: "GET",
            params: {
                page: 1,
                size: 10,
            },
        },
    )
}