import { privateRequest } from "../../utils/api"

export interface ManagerListItem {
    userId: number
    fullName: string
    nickName: string | null
    profileUrl: string | null
    role: string
    isDisable: boolean
    phoneNo: string
    createdAt: string
}

export interface ManagerListResponse {
    items: ManagerListItem[]
    page: number
    size: number
    total: number
    pages: number
}

export interface ManagerSearch {
    q?: string
    role?: string
    isDisable?: boolean
    createdFrom?: string
    createdTo?: string
    page?: number
    size?: number
}

export async function getManagers(
    search: ManagerSearch = {},
): Promise<ManagerListResponse> {
    return privateRequest<ManagerListResponse>(
        "/manager/managers/",
        {
            method: "GET",
            params: {
                q: search.q || undefined,
                role: search.role || undefined,
                is_disable: search.isDisable,
                created_from: search.createdFrom || undefined,
                created_to: search.createdTo || undefined,
                page: search.page ?? 1,
                size: search.size ?? 10,
            },
        },
    )
}