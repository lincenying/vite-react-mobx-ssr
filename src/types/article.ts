export interface IArticle {
    c_id: string
    c_title: string
    c_content: string
}

export interface IListConfig {
    hasNext?: number | boolean
    hasPrev?: number | boolean
    pathname?: string
    page: number
    limit?: number
    cache?: boolean
}

export interface IApiConfig {
    id?: string
    page?: number
    pathname?: string
    from?: string
    limit?: number
}

/** 首页列表 SSR 状态快照 */
export interface IArticleListState extends IListConfig {
    data: IArticle[]
}

/** 文章详情 SSR 状态快照 */
export interface IArticleDetailState {
    data: IArticle
    pathname?: string
}
