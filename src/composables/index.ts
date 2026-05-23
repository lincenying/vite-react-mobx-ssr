import ls from 'store2'

export function useAutoScroll(key: string) {
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

        window.addEventListener('scroll', handleScroll) // 添加滚动事件监听

        return () => {
            window.removeEventListener('scroll', handleScroll) // 组件卸载时移除事件监听
        }
    }, [])
}
