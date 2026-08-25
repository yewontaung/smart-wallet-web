import { privateRequest } from "../../utils/api"

export interface BusinessOwner {
    userId: number
    fullName: string
    profileUrl: string | null
}

export interface BusinessApprover {
    approverId: number
    approvedAt: string
    approverFullName: string
}

export interface BusinessListItem {
    businessId: number
    qualifiedName: string
    bannerUrl: string | null
    description: string | null
    businessType: string
    createdAt: string
    status: string
    owner: BusinessOwner
    approver: BusinessApprover | null
}

export interface BusinessListResponse {
    items: BusinessListItem[]
    page: number
    size: number
    total: number
    pages: number
}

export interface BusinessSearch {
    q?: string
    businessType?: string
    createdFrom?: string
    createdTo?: string
    page?: number
    size?: number
}

export async function getManagerBusinesses(
    search: BusinessSearch = {},
): Promise<BusinessListResponse> {
    return privateRequest<BusinessListResponse>(
        "/manager/businesses/",
        {
            method: "GET",
            params: {
                page: search.page ?? 1,
                size: search.size ?? 10,
                q: search.q || undefined,
                businessType: search.businessType || undefined,
                createdFrom: search.createdFrom || undefined,
                createdTo: search.createdTo || undefined,
            },
        },
    )
}