import type { PageResult } from "../../schemas/outputs"
import type { TransactionLogListItem } from "../../schemas/shared/outputs"
import type { WalletBalance } from "../../schemas/wallet/output"
import { privateRequest } from "../../utils/api"


// API Function
export async function getMyTransactionLogs(page = 1, size = 10, search = "") {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (search) params.append("search", search);

  const result = await privateRequest<PageResult<TransactionLogListItem>>(
    `/wallet-user/me/transaction-logs?${params.toString()}`,{
    method: "GET",
  });
  return result;
}


export async function getMyBalance() {
    const result = await privateRequest<WalletBalance>("/wallet-user/me/balance")

    return result
}