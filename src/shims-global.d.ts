/* eslint-disable @typescript-eslint/no-explicit-any */
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


/* eslint-disable no-unused-vars */

/**
 * Null 或者 T
 */
declare type Nullable<T> = T | null
/**
 * 非 Null 类型
 */
declare type NonNullable<T> = T extends null | undefined ? never : T
/**
 * Undefined 或者 T
 */
declare type UnfAble<T> = T | undefined
/**
 * 键为字符串, 值为 Any 的对象
 */
declare type Obj = Record<string, any>

/**
 * 键为字符串, 值为 T 的对象
 */
declare type ObjT<T> = Record<string, T>

declare type AnyFn = (...args: any[]) => any;
declare type PromiseFn = (...args: any[]) => Promise<void>;


declare interface ResDataLists<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
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
declare interface ResponseData<T> {
    data: T
    code: number
    message: string
    info?: string
    [propName: string]: any
}
declare interface ApiClient {
    get<T = void>(url: string, params: Obj, headers?: Obj): Promise<ResponseData<T>>
    post<T = void>(url: string, data: Obj, headers?: Obj): Promise<ResponseData<T>>
    file<T = void>(url: string, data: Obj, headers?: Obj): Promise<ResponseData<T>>
}

declare interface ApiServer {
    get<T = void>(url: string, params: Obj, headers?: Obj): Promise<ResponseData<T>>
    post<T = void>(url: string, data: Obj, headers?: Obj): Promise<ResponseData<T>>
    cookies: ObjT<string>
    api: import('axios').AxiosInstance
    getCookies: () => ObjT<string>
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
