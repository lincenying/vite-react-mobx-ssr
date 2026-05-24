import type { Request, Response } from 'express'

export interface IRenderContext {
    req: Request
    res: Response
    template: string
    html?: string
}
