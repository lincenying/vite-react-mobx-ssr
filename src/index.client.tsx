import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { createAppRouter } from '@/router'
import { createStore, type AppStore } from '@/stores'

import 'uno.css'
import './styles/index.scss'

if (!window.$timeout) {
    window.$timeout = {}
}

const container = document.getElementById('root')

const store = createStore()

type DehydratedState = ReturnType<AppStore['dehydrate']>

if (window.__PREFETCHED_STATE__) {
    if (import.meta.env.DEV) {
        console.log('prefetched state', window.__PREFETCHED_STATE__)
    }

    store.hydrate(window.__PREFETCHED_STATE__ as DehydratedState)
    delete window.__PREFETCHED_STATE__
}

const router = createAppRouter(store)

hydrateRoot(
    container!,
    <RouterProvider router={router} />,
)
