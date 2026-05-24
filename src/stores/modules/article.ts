import type { AppStore, PrefetchStore } from '..'
import type { IApiConfig, IArticle, IArticleDetailState } from '@/types'
import { getArticleDetail } from '@/api/articleApi'
import api from '@/api/index-client'
import { makeAutoObservable, runInAction } from 'mobx'

export class ArticleStore implements PrefetchStore<IArticleDetailState> {
    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    root: AppStore

    isLoad = false
    pathname = ''
    data: IArticle = {} as IArticle

    async getArticle(config: IApiConfig, $api?: import('@/types/api').IApiClient | import('@/types/api').IApiServer) {
        $api = $api || api
        if (config.pathname === this.pathname) {
            return
        }
        this.isLoad = false
        const { code, data } = await getArticleDetail(config, $api)
        if (code === 200) {
            runInAction(() => {
                this.isLoad = true
                this.data = data
                this.pathname = config.pathname || ''
            })
        }

        return 'success'
    }

    hydrate(state: IArticleDetailState): void {
        this.data = state.data
        this.pathname = state.pathname || '/'
    }

    dehydrate(): IArticleDetailState {
        return {
            data: this.data,
            pathname: this.pathname,
        }
    }
}
