import { makeAutoObservable, runInAction } from 'mobx'
import type { AppStore, PrefetchStore } from '..'
import api from '@/api/index-client'
import type { Article, ArticleStore } from '@/types'

export interface HomeState {
    state: ArticleStore
}

export class HomeStore implements PrefetchStore<HomeState> {
    state: ArticleStore = {
        lists: {
            data: [],
            hasNext: 0,
            page: 1,
            path: '',
        },
        item: {
            data: null,
            path: '',
            isLoad: false,
        },
    }

    root: AppStore

    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    async getArticleList(config: Obj = {}, $api?: ApiServer | ApiClient) {
        $api = $api || api
        if (this.state.lists.data.length > 0 && config.path === this.state.lists.path && config.page === 1)
            return
        const { code, data } = await $api.get<ResDataLists<Article>>('article/lists', { ...config, cache: true, perPage: 30 })

        if (data && code === 200) {
            let _data: Article[]
            if (config.page === 1)
                _data = [...data.data]
            else
                _data = this.state.lists.data.concat(data.data)

            runInAction(() => {
                this.state.lists = {
                    data: _data,
                    hasNext: data.current_page < data.last_page ? 0 : 1,
                    hasPrev: data.current_page > 1 ? 1 : 0,
                    page: data.current_page,
                    path: config.path,
                }
            })
        }

        return 'success'
    }

    hydrate(state: HomeState): void {
        this.state = state.state
    }

    dehydra(): HomeState {
        return {
            state: this.state,
        }
    }
}
