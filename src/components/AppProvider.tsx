import type { AppStore } from '@/stores'
import { RootContext } from '@/stores'
import { Outlet } from 'react-router'

export interface IAppProviderProps {
    readonly store: AppStore
}

/**
 * 应用根 Provider，注入 MobX Store 上下文
 */
export function AppProvider({ store }: IAppProviderProps) {
    return (
        <RootContext.Provider value={store}>
            <Outlet />
        </RootContext.Provider>
    )
}
