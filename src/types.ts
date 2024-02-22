export interface anyArray {
    [index: number]: any
}

export type Fn = (...args: any[]) => void

export interface ListConfig {
    hasNext?: number | boolean
    hasPrev?: number | boolean
    pathname?: string
    page: number
    [propName: string]: any
}

export interface ApiConfig {
    id?: string
    page?: number
    pathname?: string
    from?: string
    limit?: number
}

export interface Article {
    c_id: string
    c_title: string
    c_content: string
}

export interface ArticleStore extends ListConfig {
    data: Article[]
}

export interface ArticleStoreItem {
    data: Article
    pathname?: string
    [propName: string]: any
}
