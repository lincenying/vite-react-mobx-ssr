import { createContext, useContext } from 'react'
import { ArticleStore } from './modules/article'
import { HomeStore } from './modules/home'

export interface PrefetchStore<State> {
    /** 合并 SSR 预取数据 */
    hydrate: (state: State) => void
    /** 提供 SSR 预取数据 */
    dehydrate: () => State | undefined
}

type PickKeys<T> = {
    [K in keyof T]: T[K] extends PrefetchStore<unknown> ? K : never
}[keyof T]

type DehydratedState = {
    [K in PickKeys<AppStore>]?: AppStore[K] extends PrefetchStore<infer S> ? S : never
}

export class AppStore {
    topics: HomeStore
    article: ArticleStore

    constructor() {
        this.topics = new HomeStore(this)
        this.article = new ArticleStore(this)
    }

    hydrate(data: DehydratedState) {
        (Object.keys(data) as PickKeys<AppStore>[]).forEach((key) => {
            if (import.meta.env.DEV) {
                console.info(`hydrate ${key}`)
            }
            const state = data[key]
            if (state && this[key]) {
                this[key]?.hydrate?.(state)
            }
        })
    }

    dehydrate(): DehydratedState {
        const data: DehydratedState = {}

        (Object.keys(this) as PickKeys<AppStore>[]).forEach((key) => {
            data[key] = this[key]?.dehydrate?.()
        })

        return data
    }
}

const appStore = new AppStore()

export const createStore = () => appStore

export const RootContext = createContext<AppStore>(appStore)

export function useStore<T extends keyof AppStore>(key: T): AppStore[T] {
    const root = useContext(RootContext)

    return root[key]
}
