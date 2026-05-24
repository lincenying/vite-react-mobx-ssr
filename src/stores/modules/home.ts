import type { AppStore, PrefetchStore } from '..'
import type { IApiClient, IApiServer, IArticle, IArticleListState, IListConfig } from '@/types'
import { makeAutoObservable, runInAction } from 'mobx'
import { getArticleList } from '@/api/articleApi'
import api from '@/api/index-client'

export class HomeStore implements PrefetchStore<IArticleListState> {
    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    root: AppStore

    hasNext = 0
    page = 1
    pathname = ''
    data: IArticle[] = []

    async getTopics(config: IListConfig, $api: IApiClient | IApiServer = api) {
        if (
            this.data.length > 0
            && config.pathname === this.pathname
            && config.page === 1
        ) {
            return
        }
        const { code, data } = await getArticleList(config, $api)

        if (data && code === 200) {
            let _data: IArticle[]
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

    hydrate(state: IArticleListState): void {
        this.data = state.data
        this.page = state.page
        this.pathname = state.pathname || '/'
    }

    dehydrate(): IArticleListState {
        return {
            data: this.data,
            page: this.page,
            pathname: this.pathname,
        }
    }
}
