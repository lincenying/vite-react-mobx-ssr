import fetch from 'isomorphic-fetch'
import { makeAutoObservable } from 'mobx'
import type { AppStore, PrefetchStore } from '..'

export interface HomeState {
    name: string
}

export class HomeStore implements PrefetchStore<HomeState> {
    name = ''

    root: AppStore

    constructor(root: AppStore) {
        makeAutoObservable(this)
        this.root = root
    }

    async fetchName() {
        console.log('fetchName')
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/name`)

        this.name = await res.text()
    }

    hydrate(state: HomeState): void {
        this.name = state.name
    }

    dehydra(): HomeState {
        return {
            name: this.name,
        }
    }
}
