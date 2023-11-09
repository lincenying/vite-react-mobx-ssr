export interface anyArray {
    [index: number]: any
}

export type Fn = (...args: any[]) => void

export interface ListConfig {
    hasNext?: number | boolean
    hasPrev?: number | boolean
    path?: string
    page: number
    [propName: string]: any
}

export interface ApiConfig {
    id?: string
    page?: number
    path?: string
    from?: string
    limit?: number
}

export interface Article {
    c_id: string
    c_title: string
    c_content: string
}

export interface ArticleStoreList extends ListConfig {
    data: Article[]
}

export interface ArticleStoreItem {
    data: Nullable<Article>
    path?: string
    [propName: string]: any
}
export interface ArticleStore {
    lists: ArticleStoreList
    item: ArticleStoreItem
}
