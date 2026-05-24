import type { AppStore } from '@/stores'
import { Outlet } from 'react-router'
import { RootContext } from '@/stores'

export interface IAppProviderProps {
    readonly store: AppStore
}

/**
 * 应用根 Provider，注入 MobX Store 上下文
 */
export const AppProvider = observer(({ store }: IAppProviderProps) => {
    return (
        <RootContext.Provider value={store}>
            <Outlet />
        </RootContext.Provider>
    )
})
