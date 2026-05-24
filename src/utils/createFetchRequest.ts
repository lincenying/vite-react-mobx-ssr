import type { IncomingHttpHeaders } from 'node:http'

/** Vite Connect / Express 均可满足的 SSR 请求形状 */
export interface ISSRRequest {
    method?: string
    url?: string
    originalUrl?: string
    headers: IncomingHttpHeaders
    body?: unknown
    cookies?: Record<string, string>
    protocol?: string
    get?: (name: string) => string | undefined
}

/** Vite Connect / Express 均可满足的 SSR 响应形状 */
export interface ISSRResponse {
    on: (event: 'close', listener: () => void) => void
    status?: (code: number) => ISSRResponse
    set?: (name: string, value: string) => void
    setHeader?: (name: string, value: string | number | readonly string[]) => void
    statusCode?: number
    end?: (data?: unknown) => void
}

/**
 * 读取请求 Host（兼容 Express req.get 与 Connect headers）
 */
function getRequestHost(req: ISSRRequest): string {
    const fromExpress = req.get?.('host')
    if (fromExpress)
        return fromExpress

    const fromHeader = req.headers.host
    if (typeof fromHeader === 'string')
        return fromHeader

    return 'localhost'
}

/**
 * 读取请求协议（兼容 Express req.protocol 与 x-forwarded-proto）
 */
function getRequestProtocol(req: ISSRRequest): string {
    if (req.protocol)
        return req.protocol

    const forwarded = req.headers['x-forwarded-proto']
    if (typeof forwarded === 'string')
        return forwarded.split(',')[0].trim()

    if (Array.isArray(forwarded) && forwarded[0])
        return forwarded[0].split(',')[0].trim()

    return 'http'
}

/**
 * 读取请求路径
 */
function getRequestPath(req: ISSRRequest): string {
    return req.originalUrl || req.url || '/'
}

/**
 * 解析 Cookie（兼容 Express req.cookies 与原始 Cookie 头）
 */
export function getRequestCookies(req: ISSRRequest): Record<string, string> {
    if (req.cookies)
        return req.cookies

    const cookieHeader = req.headers.cookie
    if (!cookieHeader)
        return {}

    return Object.fromEntries(
        cookieHeader
            .split(';')
            .map((item) => {
                const [key, ...valueParts] = item.trim().split('=')
                if (!key)
                    return ['', '']

                return [key, decodeURIComponent(valueParts.join('='))]
            })
            .filter(([key]) => key),
    )
}

/**
 * 写入重定向响应（兼容 Express 与 Connect）
 */
export function setRedirectResponse(res: ISSRResponse, status: number, location: string): void {
    if (res.status && res.set) {
        res.status(status)
        res.set('Location', location)
    }
    else {
        res.statusCode = status
        res.setHeader?.('Location', location)
    }

    res.end?.()
}

/**
 * 将 SSR 请求转换为 Fetch Request，供 createStaticHandler 使用
 */
export function createFetchRequest(req: ISSRRequest, res: ISSRResponse): globalThis.Request {
    const origin = `${getRequestProtocol(req)}://${getRequestHost(req)}`
    const url = new URL(getRequestPath(req), origin)

    const controller = new AbortController()
    res.on('close', () => controller.abort())

    const headers = new Headers()

    for (const [key, values] of Object.entries(req.headers)) {
        if (values) {
            if (Array.isArray(values)) {
                for (const value of values) {
                    headers.append(key, value)
                }
            }
            else {
                headers.set(key, values)
            }
        }
    }

    const init: RequestInit = {
        method: req.method,
        headers,
        signal: controller.signal,
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body as BodyInit
    }

    return new globalThis.Request(url.href, init)
}
