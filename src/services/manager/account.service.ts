import { privateRequest } from "../../utils/api"
import type { AccountListItem } from "../../schemas/manager/outputs"
import type { AccountSearch } from "../../schemas/manager/searches"

export interface AccountListResponse {
    items: AccountListItem[]
    page: number
    size: number
    total: number
    pages: number
}

export interface AccountDetailResponse {
    userId: number
    fullName: string
    nickName?: string | null
    accountType: string
    accountStatus: string
    phoneNo: string
    createdAt: string
    approvedAt?: string | null
    approverId?: number | null
    approverFullName?: string | null
    currentBalance: number
    lastBalance: number
}

export async function getManagerAccounts(
    search: AccountSearch = {},
): Promise<AccountListResponse> {
    return privateRequest<AccountListResponse>(
        "/manager/accounts/",
        {
            method: "GET",
            params: {
                page: 1,
                size: 10,

                q: search.q,
                accountType: search.accountType,
                accountStatus: search.accountStatus,
                balanceFrom: search.balanceFrom,
                balanceTo: search.balanceTo,
                districtId: search.districtId,

                createdFrom: search.createdFrom
                    ? search.createdFrom.toISOString().split("T")[0]
                    : undefined,

                createdTo: search.createdTo
                    ? search.createdTo.toISOString().split("T")[0]
                    : undefined,
            },
        },
    )
}

export async function getManagerAccountDetail(
    accountId: string | number,
): Promise<AccountDetailResponse> {
    return privateRequest<AccountDetailResponse>(
        `/manager/accounts/${accountId}/`,
        {
            method: "GET",
        },
    )
}