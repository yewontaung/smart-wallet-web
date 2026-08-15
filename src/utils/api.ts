const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: RequestOptions["params"]): string {
    const url = new URL(
        path.startsWith("http") ? path : `${API_BASE_URL}${path}`,
        path.startsWith("http") ? undefined : window.location.origin
    );

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
}

async function parseResponse<T>(res: Response): Promise<T> {
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
        const message =
            isJson && data && typeof data === "object" && "message" in data
                ? String((data as { message: unknown }).message)
                : res.statusText || "Request failed";
        throw new ApiError(message, res.status, data);
    }

    return data as T;
}

function buildInit(options: RequestOptions, extraHeaders: HeadersInit = {}): RequestInit {
    const { body, headers, ...rest } = options;

    return {
        ...rest,
        headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...extraHeaders,
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    };
}

/**
 * For endpoints that don't require authentication
 * e.g. login, register, public profile lookup, package listing
 */
export async function publicRequest<T = unknown>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const url = buildUrl(path, options.params);
    const res = await fetch(url, buildInit(options));
    return parseResponse<T>(res);
}

/**
 * For endpoints that require the auth token.
 * Auto-attaches Authorization header, and on 401 clears
 * the session and redirects to /login.
 */
export async function privateRequest<T = unknown>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const token = sessionStorage.getItem("auth_token");

    const url = buildUrl(path, options.params);
    const res = await fetch(
        url,
        buildInit(options, token ? { Authorization: `Bearer ${token}` } : {})
    );

    if (res.status === 401) {
        sessionStorage.removeItem("auth_token");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
        throw new ApiError("Session expired", 401);
    }

    return parseResponse<T>(res);
}