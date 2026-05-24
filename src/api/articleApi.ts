import type { IApiConfig, IApiResponse, IApiResponseLists, IArticle, IListConfig } from '@/types'
import type { IApiClient, IApiServer } from '@/types/api'

/**
 * 获取文章列表
 */
export async function getArticleList(
    config: IListConfig,
    api: IApiClient | IApiServer,
): Promise<IApiResponse<IApiResponseLists<IArticle>>> {
    return api.get<IApiResponseLists<IArticle>>('/fetch/article/lists', { ...config, cache: true })
}

/**
 * 获取文章详情
 */
export async function getArticleDetail(
    config: IApiConfig,
    api: IApiClient | IApiServer,
): Promise<IApiResponse<IArticle>> {
    return api.get<IArticle>('/fetch/article/detail', { ...config })
}
