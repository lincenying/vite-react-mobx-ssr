import serializeJavascript from 'serialize-javascript'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { createStore } from './stores'
import { createRoutes } from './routes'
import { api } from './api/index-server'

import { App, prefetch } from './App'

import type { RenderContext } from './App'

// see index.html
const APP_HTML = '<!--app-html-->'
const APP_STATE = '<!--app-state-->'

const serialize = (state: Record<string, unknown> | undefined) => `<script>;window.__PREFETCHED_STATE__=${serializeJavascript(state)};</script>`

export async function render(context: RenderContext) {
    const ctx = context as Required<RenderContext>
    const { req } = ctx

    const store = createStore()
    const routes = createRoutes()

    ctx.store = store
    ctx.routes = routes
    ctx.api = api(req && req.cookies)
    ctx.params = Object.fromEntries(new URLSearchParams(req.originalUrl.split('?')[1]))

    const success = await prefetch(ctx, 'server').catch((e) => {
        console.error(e)
        return false
    })

    const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.originalUrl}>
            <App routes={routes} store={store} />
        </StaticRouter>,
    )

    // 状态现在可用
    const state = success ? store.dehydra() : undefined

    ctx.html = ctx.template.replace(APP_HTML, html).replace(APP_STATE, serialize(state))

    return ctx
}
