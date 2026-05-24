/**
 * 全局统一 API 响应类型
 */
export interface IApiResponse<T = unknown> {
    code: number
    message: string
    data: T
    info?: string
}

export interface IApiResponseLists<T> {
    hasNext: number | boolean
    hasPrev: number | boolean
    total: number
    list: T[]
}

export interface IApiClient {
    get: <T = void>(url: string, params: Record<string, unknown>, headers?: Record<string, unknown>) => Promise<IApiResponse<T>>
    post: <T = void>(url: string, data: Record<string, unknown>, headers?: Record<string, unknown>) => Promise<IApiResponse<T>>
    file: <T = void>(url: string, data: Record<string, unknown>, headers?: Record<string, unknown>) => Promise<IApiResponse<T>>
}

export interface IApiServer {
    get: <T = void>(url: string, params: Record<string, unknown>, headers?: Record<string, unknown>) => Promise<IApiResponse<T>>
    post: <T = void>(url: string, data: Record<string, unknown>, headers?: Record<string, unknown>) => Promise<IApiResponse<T>>
    cookies: Record<string, string>
    api: import('axios').AxiosInstance
    getCookies: () => Record<string, string>
}
