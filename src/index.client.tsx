import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StyleProvider } from '@ant-design/cssinjs'

import { createRoutes } from './routes'
import { createStore } from './store'

import { App, prefetch } from './App'
import type { PrefetchContext } from './App'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import './styles/index.scss'

const container = document.getElementById('root')

const store = createStore()
const routes = createRoutes()

if (window.__PREFETCHED_STATE__) {
    if (import.meta.env.DEV)
        console.log('prefetched state', window.__PREFETCHED_STATE__)

    // merge ssr prefetched data
    store.hydrate(window.__PREFETCHED_STATE__ as Obj)
    delete window.__PREFETCHED_STATE__
}
else {
    const ctx: PrefetchContext = {
        routes,
        store,
        req: { originalUrl: window.location.pathname },
        api: undefined,
        params: Object.fromEntries(
            new URLSearchParams(window.location.search),
        ),
    }
    // fallback to client prefetch
    prefetch(ctx, 'client').then(
        () => {},
        () => {},
    )
}

hydrateRoot(container!, (<StyleProvider hashPriority="high">
    <BrowserRouter>
        <App store={store} routes={routes}/>
    </BrowserRouter>
</StyleProvider>))
