import type { PrefetchContext } from '@/App'

import { Link } from 'react-router'
import { Button, List, Spin } from '@/antd'
import { useAutoScroll } from '~/composables'

export function prefetch(ctx: PrefetchContext, _type: 'server' | 'client') {
    return ctx.store.topics.getTopics(
        {
            page: 1,
            limit: 20,
            pathname: ctx.req.originalUrl.split('?')[0],
        },
        ctx.api,
    )
}

const Home = observer(() => {
    const location = useLocation()
    const pathname = location.pathname

    const topics = useStore('topics')

    const firstPathname = useRef(pathname)
    const [showMoreBtn, setShowMoreBtn] = useState(true)

    useMount(() => {
        console.log('topics componentDidMount')
        console.log(topics.pathname, location.pathname)
        if (topics.pathname !== location.pathname) {
            topics.getTopics({ page: 1, limit: 20, pathname })
        }

        document.title = 'M.M.M 小屋'
    })

    useUpdateEffect(() => {
        console.log('topics componentDidUpdate')
        console.log(firstPathname.current, pathname)
    }, [pathname])

    const handleLoadMore = async () => {
        setShowMoreBtn(false)
        await topics.getTopics({ page: topics.page + 1, limit: 20, pathname })
        setShowMoreBtn(true)
    }

    useAutoScroll('list')

    const { data } = topics

    return (
        <div className="main">
            <List
                dataSource={data}
                itemLayout="horizontal"
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta title={
                            <Link className="li-name" to={`/article/${item.c_id}`}>{item.c_title}</Link>
                        }
                        />
                    </List.Item>
                )}
            />

            <ul>
                <li className="page">
                    {showMoreBtn ? <Button onClick={handleLoadMore} type="primary">加载下一页</Button> : <Spin /> }
                </li>
            </ul>
        </div>
    )
})

export default Home
