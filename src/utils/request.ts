import type { AxiosResponse } from 'axios'
import type { IApiResponse } from '@/types'
import { message } from 'antd'
import axios from 'axios'
import qs from 'qs'
import { getApiBaseUrl } from './env'

const REQUEST_TIMEOUT = 30000

export const httpClient = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: REQUEST_TIMEOUT,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
})

httpClient.interceptors.request.use(
    config => config,
    error => Promise.reject(error),
)

httpClient.interceptors.response.use(
    response => response,
    (error) => {
        const response = {
            config: error.config,
            data: null,
            headers: error.config?.headers,
            status: error.code,
            statusText: error.message,
            request: error.request,
        } as AxiosResponse

        return Promise.resolve(response)
    },
)

/**
 * 检查 HTTP 状态码并转换为业务响应
 */
export function checkHttpStatus<T>(response: AxiosResponse): IApiResponse<T> {
    if (response.status === 200 || response.status === 304) {
        return response.data as IApiResponse<T>
    }

    if (response.status === 401) {
        return {
            code: 401,
            message: '您还没有登录, 或者登录超时!',
            data: response.statusText as T,
            info: response.statusText,
        }
    }

    return {
        code: -404,
        message: `接口返回数据错误, 错误代码: ${response.status || '未知'}`,
        data: response.statusText as T,
        info: response.statusText,
    }
}

/**
 * 检查业务状态码并处理跳转/提示
 */
export function checkBusinessCode<T>(data: IApiResponse<T>): IApiResponse<T> {
    if (data.code === -500) {
        window.location.href = '/backend'
    }
    else if (data.code === -400) {
        window.location.href = '/'
    }
    else if (typeof window !== 'undefined' && data.code !== 200 && data.code !== 401) {
        message.error(data.message)
    }

    return data
}

/**
 * 统一请求封装
 */
export const request = {
    async get<T>(url: string, params: Record<string, unknown> = {}): Promise<IApiResponse<T>> {
        const response = await httpClient.get(url, { params })
        return checkBusinessCode(checkHttpStatus<T>(response))
    },
    async post<T>(url: string, data: Record<string, unknown> = {}): Promise<IApiResponse<T>> {
        const response = await httpClient.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
        return checkBusinessCode(checkHttpStatus<T>(response))
    },
}
