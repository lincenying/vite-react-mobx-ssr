import type { IApiResponse } from '@/types'
import type { IApiServer } from '@/types/api'
import axios, { type AxiosRequestHeaders } from 'axios'
import md5 from 'md5'
import qs from 'qs'
import config from './config-server'

function objToStr(cookies: Record<string, string | number | boolean>) {
    if (!cookies) {
        return ''
    }
    let cookie = ''
    Object.keys(cookies).forEach((item) => {
        cookie += `${item}=${cookies[item]}; `
    })
    return cookie
}

export default {}

export function api(cookies: Record<string, string>): IApiServer {
    return {
        cookies,
        api: axios.create({
            baseURL: config.api,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'cookie': objToStr(cookies),
            },
            timeout: config.timeout,
        }),
        getCookies() {
            return this.cookies
        },
        async post<T>(url: string, data: Record<string, unknown>, headers: Record<string, unknown> = {}): Promise<IApiResponse<T>> {
            const cookieData = this.getCookies() || {}
            const username = cookieData.username || ''
            const key = md5(url + JSON.stringify(data) + username)
            if (config.cached && data.cache && config.cached.has(key)) {
                const cached = config.cached.get(key) as { data: IApiResponse<unknown> } | undefined
                return Promise.resolve(cached?.data as IApiResponse<T>)
            }
            const res = await this.api({
                method: 'post',
                url,
                data: qs.stringify(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    ...headers,
                } as AxiosRequestHeaders,
            })
            if (config.cached && data.cache) {
                config.cached.set(key, res)
            }
            return res?.data as IApiResponse<T>
        },
        async get<T>(url: string, params: Record<string, unknown>, headers: Record<string, unknown> = {}): Promise<IApiResponse<T>> {
            const cookieData = this.getCookies() || {}
            const username = cookieData.username || ''
            const key = md5(url + JSON.stringify(params) + username)
            if (config.cached && params.cache && config.cached.has(key)) {
                const res = config.cached.get(key) as { data: IApiResponse<unknown> } | undefined
                return Promise.resolve(res?.data as IApiResponse<T>)
            }
            return this.api({
                method: 'get',
                url,
                params,
                headers: {
                    ...headers,
                } as AxiosRequestHeaders,
            }).then((res) => {
                if (config.cached && params.cache) {
                    config.cached.set(key, res)
                }
                return res?.data as IApiResponse<T>
            })
        },
    }
}
