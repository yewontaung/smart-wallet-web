import type { TransactionDetail } from "../../schemas/shared/outputs";
import { privateRequest } from "../../utils/api";

export async function getTransactionById(trxId:string) {
    const result = await privateRequest<TransactionDetail>(`/wallet-user/transactions/${trxId}`)
    return result
}