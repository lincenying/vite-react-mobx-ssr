import type { IRenderContext } from './App'
import ReactDOMServer from 'react-dom/server'
import {
    createStaticHandler,
    createStaticRouter,
    StaticRouterProvider,
} from 'react-router'
import serializeJavascript from 'serialize-javascript'
import { api } from './api/index-server'
import { createAppRoutes } from '@/router'
import { createStore } from '@/stores'
import { createFetchRequest, getRequestCookies, setRedirectResponse } from '@/utils/createFetchRequest'

const APP_HTML = '<!--app-html-->'
const APP_STATE = '<!--app-state-->'

const serialize = (state: ReturnType<ReturnType<typeof createStore>['dehydrate']> | undefined) =>
    `<script>;window.__PREFETCHED_STATE__=${serializeJavascript(state)};</script>`

export async function render(context: IRenderContext) {
    const { req, res, template } = context

    const store = createStore()
    const serverApi = api(getRequestCookies(req))
    const routes = createAppRoutes(store, serverApi)

    const { query, dataRoutes } = createStaticHandler(routes)
    const fetchRequest = createFetchRequest(req, res)
    const handlerContext = await query(fetchRequest)

    if (handlerContext instanceof Response) {
        setRedirectResponse(res, handlerContext.status, handlerContext.headers.get('Location') || '/')
        return context
    }

    const router = createStaticRouter(dataRoutes, handlerContext)

    const html = ReactDOMServer.renderToString(
        <StaticRouterProvider router={router} context={handlerContext} />,
    )

    const state = store.dehydrate()

    context.html = template.replace(APP_HTML, html).replace(APP_STATE, serialize(state))

    return context
}
