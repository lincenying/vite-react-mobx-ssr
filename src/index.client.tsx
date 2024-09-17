import type { PrefetchContext } from './App'
import { hydrateRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'
import { App, prefetch } from './App'

import { createRoutes } from './routes'
import { createStore } from './stores'

import 'uno.css'
import './styles/index.scss'

const container = document.getElementById('root')

const store = createStore()
const routes = createRoutes()

if (window.__PREFETCHED_STATE__) {
    if (import.meta.env.DEV) {
        console.log('prefetched state', window.__PREFETCHED_STATE__)
    }

    // 合并SSR预取数据
    store.hydrate(window.__PREFETCHED_STATE__ as Objable)
    delete window.__PREFETCHED_STATE__
}
else {
    const ctx: PrefetchContext = {
        routes,
        store,
        req: { originalUrl: window.location.pathname },
        api: undefined,
        params: Object.fromEntries(new URLSearchParams(window.location.search)),
    }
    // 回退到客户端预取
    prefetch(ctx, 'client').then(
        () => {},
        () => {},
    )
}

hydrateRoot(
    container!,
    <BrowserRouter>
        <App routes={routes} store={store} />
    </BrowserRouter>,
)
