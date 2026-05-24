import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { ConfigProvider } from '@/antd'
import { PageContainer } from '@/components/PageContainer'
import { antdTheme } from '@/styles/antd-theme'

export interface IMainLayoutProps {
    readonly children?: ReactNode
}

/**
 * 主布局：Ant Design 主题 + 页面容器
 */
export const MainLayout = observer(({ children }: IMainLayoutProps) => {
    return (
        <ConfigProvider theme={antdTheme}>
            <PageContainer>
                {children ?? <Outlet />}
            </PageContainer>
        </ConfigProvider>
    )
})
