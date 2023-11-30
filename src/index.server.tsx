import serializeJavascript from 'serialize-javascript'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { doExtraStyle } from '../scripts/genAntdCss'
import { createStore } from './store'
import { createRoutes } from './routes'
import { api } from './api/index-server'

import { App, prefetch } from './App'

import type { RenderContext } from './App'

// see index.html
const APP_HTML = '<!--app-html-->'
const APP_STATE = '<!--app-state-->'
const APP_STYLE = '<!--app-style-->'

const serialize = (state: Record<string, unknown> | undefined) => `<script>;window.__PREFETCHED_STATE__=${serializeJavascript(state)};</script>`

export async function render(context: RenderContext) {
    const ctx = context as Required<RenderContext>
    const { req } = ctx

    const store = createStore()
    const routes = createRoutes()

    ctx.store = store
    ctx.routes = routes
    ctx.api = api(req && req.cookies)
    ctx.params = Object.fromEntries(
        new URLSearchParams(req.originalUrl.replace('/?', '?')),
    )

    const success = await prefetch(ctx, 'server').catch((e) => {
        console.error(e)
        return false
    })

    const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.originalUrl}>
            <App
                routes={routes}
                store={store}
            />
        </StaticRouter>,
    )

    // state avaliable now
    const state = success ? store.dehydra() : undefined

    ctx.html = ctx.template
        .replace(APP_HTML, html)
        .replace(APP_STATE, serialize(state))

    if (!import.meta.env.DEV) {
        const style = doExtraStyle()
        ctx.html = ctx.html.replace(APP_STYLE, `<link rel="stylesheet" href="${style}" />`)
    }

    return ctx
}
