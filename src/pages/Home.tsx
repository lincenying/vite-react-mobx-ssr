import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Button, Spin } from '@/antd'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { useStore } from '@/stores'

const Home = observer(() => {
    const location = useLocation()
    const pathname = location.pathname

    const topics = useStore('topics')

    const firstPathname = useRef(pathname)
    const [showMoreBtn, setShowMoreBtn] = useState(true)

    useEffect(() => {
        document.title = 'M.M.M 小屋'

        if (topics.pathname !== location.pathname) {
            topics.getTopics({ page: 1, limit: 20, pathname })
        }
    }, [location.pathname, pathname, topics])

    useEffect(() => {
        if (firstPathname.current !== pathname) {
            firstPathname.current = pathname
        }
    }, [pathname])

    const handleLoadMore = async () => {
        setShowMoreBtn(false)
        await topics.getTopics({ page: topics.page + 1, limit: 20, pathname })
        setShowMoreBtn(true)
    }

    useAutoScroll('list')

    const { data } = topics

    return (
        <ul className="list-none p-0 m-0">
            {
                data.map(item => (
                    <li key={item.c_id} className="py-2.5 list-none">
                        <Link
                            className="inline-block pl-2.5 text-blue-600 hover:underline"
                            to={`/article/${item.c_id}`}
                        >
                            {item.c_title}
                        </Link>
                    </li>
                ))
            }
            <li className="h-8 text-center list-none">
                {showMoreBtn ? <Button onClick={handleLoadMore} type="primary">加载下一页</Button> : <Spin />}
            </li>
        </ul>
    )
})

export default Home
