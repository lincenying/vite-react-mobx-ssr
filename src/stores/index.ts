import { createContext } from 'react'
import { ArticleStore } from './modules/article'
import { HomeStore } from './modules/topics'

export interface PrefetchStore<State> {
    // 合并SSR预取数据
    hydrate: (state: State) => void
    // 提供SSR预取数据
    dehydra: () => State | undefined
}

type PickKeys<T> = {
    [K in keyof T]: T[K] extends PrefetchStore<any> ? K : never
}[keyof T]

export class AppStore {
    topics: HomeStore
    article: ArticleStore

    constructor() {
        this.topics = new HomeStore(this)
        this.article = new ArticleStore(this)
    }

    hydrate(data: Record<string, unknown>) {
        Object.keys(data).forEach((key) => {
            const k = key as PickKeys<AppStore>

            if (import.meta.env.DEV) {
                console.info(`hydrate ${k}`)
            }
            if (this[k]) {
                this[k]?.hydrate?.(data[k] as any)
            }
        })
    }

    dehydra() {
        type Data = Record<PickKeys<AppStore>, unknown>
        const data: Partial<Data> = {}

        Object.keys(this).forEach((key) => {
            const k = key as PickKeys<AppStore>

            data[k] = this[k]?.dehydra?.()
        })

        return data as Data
    }
}

const appStore = new AppStore()

export const createStore = () => appStore

export const RootContext = createContext<AppStore>(appStore)

export function useStore<T extends keyof AppStore>(key: T): AppStore[T] {
    const root = useContext(RootContext)

    return root[key]
}
