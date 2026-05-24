import type { ReactNode } from 'react'

export interface IPageContainerProps {
    readonly children: ReactNode
}

/**
 * 页面内容容器
 */
export function PageContainer({ children }: IPageContainerProps) {
    return (
        <div className="block w-full max-w-4xl min-h-[calc(100vh-40px)] p-5 mx-auto bg-white shadow-md">
            {children}
        </div>
    )
}
