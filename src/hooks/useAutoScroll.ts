import ls from 'store2'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * 记住并恢复页面滚动位置
 */
export function useAutoScroll(key: string): void {
    const location = useLocation()
    const pathname = location.pathname

    useEffect(() => {
        const handleScroll = () => {
            if (window.$timeout[key])
                clearTimeout(window.$timeout[key])

            window.$timeout[key] = window.setTimeout(() => {
                ls.set(`scroll_path_${pathname}`, window.scrollY)
            }, 200)
        }

        const scrollY = ls.get(`scroll_path_${pathname}`) || 0
        window.scrollTo(0, scrollY)
        ls.set(`scroll_path_${pathname}`, 0)

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [key, pathname])
}
