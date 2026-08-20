import type { PageResult } from "../../schemas/outputs"
import type { TransactionLogListItem } from "../../schemas/shared/outputs"
import type { WalletBalance } from "../../schemas/wallet/output"
import { privateRequest } from "../../utils/api"

export async function getMyTransactionLogs() {
    const result = await privateRequest<PageResult<TransactionLogListItem>>(
        "/wallet-user/me/transaction-logs",
    )
    return result
}

export async function getMyBalance() {
    const result = await privateRequest<WalletBalance>("/wallet-user/me/balance")

    return result
}