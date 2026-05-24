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
    [K in keyof T]: T[K] extends PrefetchStore<infer _> ? K : never
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
        if (data.topics) {
            if (import.meta.env.DEV) {
                console.info('hydrate topics')
            }
            this.topics.hydrate(data.topics)
        }
        if (data.article) {
            if (import.meta.env.DEV) {
                console.info('hydrate article')
            }
            this.article.hydrate(data.article)
        }
    }

    dehydrate(): DehydratedState {
        return {
            topics: this.topics.dehydrate(),
            article: this.article.dehydrate(),
        }
    }
}

const appStore = new AppStore()

export const createStore = () => appStore

export const RootContext = createContext<AppStore>(appStore)

export function useStore<T extends keyof AppStore>(key: T): AppStore[T] {
    const root = useContext(RootContext)

    return root[key]
}
