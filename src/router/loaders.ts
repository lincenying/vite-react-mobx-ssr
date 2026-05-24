import type { AppStore } from '@/stores'
import type { IApiClient, IApiServer } from '@/types/api'
import type { LoaderFunctionArgs } from 'react-router'

/**
 * 首页路由 loader：预取文章列表
 */
export function createHomeLoader(store: AppStore, api?: IApiClient | IApiServer) {
    return async ({ request }: LoaderFunctionArgs) => {
        const url = new URL(request.url)
        await store.topics.getTopics(
            {
                page: 1,
                limit: 20,
                pathname: url.pathname,
            },
            api,
        )
        return null
    }
}

/**
 * 文章详情路由 loader：预取文章内容
 */
export function createArticleLoader(store: AppStore, api?: IApiClient | IApiServer) {
    return async ({ request, params }: LoaderFunctionArgs) => {
        const url = new URL(request.url)
        await store.article.getArticle(
            {
                id: params.id,
                pathname: url.pathname + url.search,
            },
            api,
        )
        return null
    }
}
