import type { AppStore, PrefetchStore } from '..'
import type { ApiConfig, Article, ArticleStoreItem } from '~/types'
import { makeAutoObservable, runInAction } from 'mobx'
import api from '@/api/index-client'

export class ArticleStore implements PrefetchStore<ArticleStoreItem> {
    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    root: AppStore

    isLoad = false
    pathname = ''
    data: Article = {} as Article

    async getArticle(config: ApiConfig, $api?: ApiServer | ApiClient) {
        $api = $api || api
        if (config.pathname === this.pathname) {
            return
        }
        this.isLoad = false
        const { code, data } = await $api.get<Article>(`/fetch/article/detail`, config)
        if (code === 200) {
            // 在async/await函数中, 赋值需要在runInAction中
            runInAction(() => {
                this.isLoad = true
                this.data = data
                this.pathname = config.pathname || ''
            })
        }

        return 'success'
    }

    hydrate(state: ArticleStoreItem): void {
        this.data = state.data
        this.pathname = state.pathname || '/'
    }

    dehydra(): ArticleStoreItem {
        return {
            data: this.data,
            pathname: this.pathname,
        }
    }
}
