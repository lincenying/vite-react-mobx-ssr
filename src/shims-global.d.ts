/// <reference types="vite/client" />

declare interface Window {
    __PREFETCHED_STATE__: any
}

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

/**
 * Null 或者 Undefined 或者 T
 */
declare type Nullable<T> = T | null | undefined
/**
 * 非 Null 类型
 */
declare type NonNullable<T> = T extends null | undefined ? never : T
/**
 * 数组<T> 或者 T
 */
declare type Arrayable<T> = T | T[]
/**
 * 键为字符串, 值为 Any 的对象
 */
declare type Objable<T = any> = Record<string, T>
/**
 * Function
 */
declare type Fn<T = void> = () => T
/**
 * 任意函数
 */
declare type AnyFn<T = any> = (...args: any[]) => T

declare type PromiseFn<T = any> = (...args: any[]) => Promise<T>
/**
 * Promise, or maybe not
 */
declare type Awaitable<T> = T | PromiseLike<T>

declare interface ResDataLists<T> {
    hasNext: number | boolean
    hasPrev: number | boolean
    total: number
    list: T[]
}

/**
 * 接口返回模板
 * ```
 * {
    data: T
    code: number
    message: string
    info?: string
 * }
 * ```
 */
declare interface ResData<T> {
    data: T
    code: number
    message: string
    info?: string
    [propName: string]: any
}

declare interface ApiClient {
    get<T = void>(url: string, params: Objable, headers?: Objable): Promise<ResData<T>>
    post<T = void>(url: string, data: Objable, headers?: Objable): Promise<ResData<T>>
    file<T = void>(url: string, data: Objable, headers?: Objable): Promise<ResData<T>>
}

declare interface ApiServer {
    get<T = void>(url: string, params: Objable, headers?: Objable): Promise<ResData<T>>
    post<T = void>(url: string, data: Objable, headers?: Objable): Promise<ResData<T>>
    cookies: Objable<string>
    api: import('axios').AxiosInstance
    getCookies: () => Objable<string>
}

declare interface asyncDataConfig {
    store: import('pinia').Pinia
    route: import('vue-router').RouteLocationNormalized
    api?: UnfAble<ApiServer>
}

declare interface Window {
    $$api: ApiClient
    $$lock: boolean
    __INITIAL_STATE__: any
}
