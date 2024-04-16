import { makeAutoObservable, runInAction } from 'mobx'
import type { AppStore, PrefetchStore } from '..'
import api from '@/api/index-client'
import type { Article, ArticleStore, ListConfig } from '@/types'

export class HomeStore implements PrefetchStore<ArticleStore> {
    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    root: AppStore

    hasNext = 0
    page = 1
    pathname = ''
    data: Article[] = []

    async getTopics(config: ListConfig, $api?: ApiServer | ApiClient) {
        $api = $api || api
        if (this.data.length > 0 && config.pathname === this.pathname && config.page === 1) {
            return
        }
        const { code, data } = await $api.get<ResDataLists<Article>>('/fetch/article/lists', { ...config, cache: true })

        if (data && code === 200) {
            let _data: Article[]
            if (config.page === 1) {
                _data = [...data.list]
            }
            else {
                _data = this.data.concat(data.list)
            }

            runInAction(() => {
                this.data = _data
                this.page = config.page || 1
                this.pathname = config.pathname || ''
            })
        }

        return 'success'
    }

    hydrate(state: ArticleStore): void {
        this.data = state.data
        this.page = state.page
        this.pathname = state.pathname || '/'
    }

    dehydra(): ArticleStore {
        return {
            data: this.data,
            page: this.page,
            pathname: this.pathname,
        }
    }
}
