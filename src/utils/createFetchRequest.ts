import type { Request, Response } from 'express'

/**
 * 将 Express 请求转换为 Fetch Request，供 createStaticHandler 使用
 */
export function createFetchRequest(req: Request, res: Response): globalThis.Request {
    const origin = `${req.protocol}://${req.get('host')}`
    const url = new URL(req.originalUrl || req.url, origin)

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
