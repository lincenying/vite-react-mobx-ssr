import type { AppStore } from '@/stores'
import type { IApiClient, IApiServer } from '@/types/api'
import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppProvider } from '@/components/AppProvider'
import { MainLayout } from '@/layouts/MainLayout'
import Article from '@/pages/Article'
import Home from '@/pages/Home'
import { createArticleLoader, createHomeLoader } from './loaders'

/**
 * 创建应用路由表
 */
export function createAppRoutes(store: AppStore, api?: IApiClient | IApiServer): RouteObject[] {
    return [
        {
            element: <AppProvider store={store} />,
            children: [
                {
                    element: <MainLayout />,
                    children: [
                        {
                            index: true,
                            element: <Home />,
                            loader: createHomeLoader(store, api),
                        },
                        {
                            path: 'article/:id',
                            element: <Article />,
                            loader: createArticleLoader(store, api),
                        },
                    ],
                },
            ],
        },
    ]
}

/**
 * 创建 Browser Router 实例
 */
export function createAppRouter(store: AppStore, api?: IApiClient | IApiServer) {
    return createBrowserRouter(createAppRoutes(store, api))
}

export type AppRoutes = ReturnType<typeof createAppRoutes>
