import { privateRequest } from "../../utils/api"

export interface BusinessRequestOwner {
    userId: number
    fullName: string
    profileUrl: string | null
}

export interface BusinessRequestListItem {
    requestId: number
    qualifiedName: string
    description: string
    businessType: string
    status: string
    bannerUrl: string | null
    requestedAt: string
    owner: BusinessRequestOwner
}

export interface BusinessRequestListResponse {
    items: BusinessRequestListItem[]
    page: number
    size: number
    total: number
    pages: number
}

export interface BusinessRequestSearch {
    q?: string
    businessType?: string
    page?: number
    size?: number
}

export interface ModificationResult {
    resultItem: number
    isSuccess: boolean
    message: string
}

export async function getBusinessRequests(
    search: BusinessRequestSearch = {},
): Promise<BusinessRequestListResponse> {
    return privateRequest<BusinessRequestListResponse>(
        "/manager/business-requests/",
        {
            method: "GET",
            params: {
                page: search.page ?? 1,
                size: search.size ?? 10,
                q: search.q || undefined,
                businessType: search.businessType || undefined,
            },
        },
    )
}

export async function approveBusinessRequest(
    requestId: number,
): Promise<ModificationResult> {
    return privateRequest<ModificationResult>(
        `/manager/business-requests/${requestId}/approve`,
        {
            method: "POST",
        },
    )
}

export async function rejectBusinessRequest(
    requestId: number,
    remark: string,
): Promise<ModificationResult> {
    return privateRequest<ModificationResult>(
        `/manager/business-requests/${requestId}/reject`,
        {
            method: "PUT",
            body: {
                remark,
            },
        },
    )
}