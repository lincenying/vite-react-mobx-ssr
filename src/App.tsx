import type { ISSRRequest, ISSRResponse } from '@/utils/createFetchRequest'

export interface IRenderContext {
    req: ISSRRequest
    res: ISSRResponse
    template: string
    html?: string
}
