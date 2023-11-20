import type { Request, Response } from 'express'
import { Route, Routes } from 'react-router-dom'

import type { AppRoutes } from './routes'
import type { AppStore } from './store'
import { RootContext } from './store'

export function App({ store, routes }: { readonly store: AppStore; readonly routes: AppRoutes }) {
    return (
        <RootContext.Provider value={store}>
            <Routes>
                {
                    routes.map(({ path, component: RouteComp }) => (
                        <Route
                            element={<RouteComp />}
                            key={path}
                            path={path}
                        />
                    ))
                }
            </Routes>
        </RootContext.Provider>
    )
}

export interface RenderContext {
    req: Request
    res: Response
    template: string
    html?: string
    routes?: AppRoutes
    store?: AppStore
    api?: ApiServer | ApiClient
    params?: ObjT<string>
}

export type PrefetchContext = Omit<
    Required<RenderContext>,
    'req' | 'res' | 'template' | 'html' | 'api'
> & { req: { originalUrl: string }; api?: ApiServer | ApiClient }

export function prefetch(ctx: PrefetchContext, type: 'server' | 'client') {
    const matched = ctx.routes.filter((each) => {
        return each.path === ctx.req.originalUrl.split('?')[0]
    })

    const ps: Promise<void>[] = []

    matched.forEach((route) => {
        if (typeof route.prefetch === 'function')
            ps.push(route.prefetch(ctx, type))
    })

    return Promise.all(ps)
}
