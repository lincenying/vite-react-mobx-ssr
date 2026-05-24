import axios from 'axios'
import { checkBusinessCode, checkHttpStatus, request } from '@/utils/request'

type API = () => import('@/types/api').IApiClient

/**
 * axios Api 封装
 */
const _api: API = () => ({
    async file<T = void>(url: string, data: Record<string, unknown>) {
        const response = await axios({
            method: 'post',
            url,
            data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        const res = checkHttpStatus<T>(response)
        return checkBusinessCode<T>(res)
    },
    async post(url, data) {
        return request.post(url, data)
    },
    async get(url, params) {
        return request.get(url, params)
    },
})

export default _api()
