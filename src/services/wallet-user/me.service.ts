import type { PageResult } from "../../schemas/outputs"
import type { TransactionLogListItem } from "../../schemas/shared/outputs"
import { privateRequest } from "../../utils/api"

export async function getMyTransactionLogs() {
    const result = await privateRequest<PageResult<TransactionLogListItem>>(
        "/wallet-user/me/transaction-logs",
    )
    return result
}