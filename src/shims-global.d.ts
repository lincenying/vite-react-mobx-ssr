/// <reference types="vite/client" />

import type { IApiClient, IApiResponse, IApiServer } from '@/types'

declare global {
    interface Window {
        __PREFETCHED_STATE__?: Record<string, unknown>
        $$api: IApiClient
        $$lock: boolean
        $timeout: {
            [x: string]: number
        }
        __INITIAL_STATE__?: unknown
    }

    interface ImportMetaEnv {
        readonly VITE_SERVER_URL: string
        readonly VITE_API_BASE_URL: string
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv
    }

    /**
     * Null 或者 Undefined 或者 T
     */
    type Nullable<T> = T | null | undefined
    /**
     * 非 Null 类型
     */
    type NonNullable<T> = T extends null | undefined ? never : T
    /**
     * 数组<T> 或者 T
     */
    type Arrayable<T> = T | T[]
    /**
     * 键为字符串, 值为 T 的对象
     */
    type Objable<T = unknown> = Record<string, T>
    /**
     * Function
     */
    type Fn<T = void> = () => T
    /**
     * 任意函数
     */
    type AnyFn<T = unknown> = (...args: unknown[]) => T

    type PromiseFn<T = unknown> = (...args: unknown[]) => Promise<T>
    /**
     * Promise, or maybe not
     */
    type Awaitable<T> = T | PromiseLike<T>

    /** @deprecated 使用 IApiResponseLists */
    interface ResDataLists<T> {
        hasNext: number | boolean
        hasPrev: number | boolean
        total: number
        list: T[]
    }

    /** @deprecated 使用 IApiResponse */
    type ResData<T> = IApiResponse<T>

    /** @deprecated 使用 IApiClient */
    type ApiClient = IApiClient

    /** @deprecated 使用 IApiServer */
    type ApiServer = IApiServer
}

export {}
