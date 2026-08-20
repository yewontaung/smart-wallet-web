import type { SendMoneyForm } from "../../schemas/wallet/inputs";
import type { ActionResult, ReceiverProfile } from "../../schemas/wallet/output";
import type { ReceiverSearch } from "../../schemas/wallet/searches";
import { privateRequest } from "../../utils/api";

export async function searchReceiver(search:ReceiverSearch) {
    const result = await privateRequest<ReceiverProfile>(
        "/wallet-user/action/receiver",
        {
            params: search
        }
    )

    return result
}

export async function transferMoney(form:SendMoneyForm) {
    const result = await privateRequest<ActionResult>(
        "/wallet-user/action/transfer",
        {
            method: "POST",
            body: form,
        }
    )
    return result
}