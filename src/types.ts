export interface anyArray {
    [index: number]: any
}

export type Fn = (...args: any[]) => void

export interface ApiConfig {
    id?: string
    page?: number
    path?: string
    from?: string
    limit?: number
}

export interface GlobalStore {
    globalLoading: boolean
    routerLoading: boolean
    ISDEV: boolean
    ISPRE: boolean
    ISPROD: boolean
    cookies: Obj
}

export interface ListConfig {
    hasNext?: number
    hasPrev?: number
    path?: string
    page: number
    [propName: string]: any
}

export interface Article {
    c_id: string
    c_title: string
    c_content: string
}

interface ArticleStoreList extends ListConfig {
    data: Article[]
}
export interface ArticleStore {
    lists: ArticleStoreList
    item: {
        data: Nullable<Article>
        path?: string
        [propName: string]: any
    }
}
