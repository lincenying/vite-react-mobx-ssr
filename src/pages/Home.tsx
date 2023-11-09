import Button from 'antd/lib/button'
import { useStore } from '@/store'
import type { PrefetchContext } from '@/App'

export function prefetch(ctx: PrefetchContext, _type: 'server' | 'client') {
    return ctx.store.home.getArticleList({
        page: 1,
        path: ctx.req.originalUrl.split('?')[0],
    }, ctx.api)
}

const Home = observer(() => {
    const store = useStore('home')
    useMount(async () => {
        if (store.lists.data.length === 0)
            await store.getArticleList({ page: 1 })
    })

    const navigate = useNavigate()

    return (
        <div>
            <Button onClick={() => navigate('/about?key=about')} type="primary">About Button</Button>
            {
                store.lists.data.map((item) => {
                    return <div className="text-16px" key={item.c_id}>{ item.c_title}</div>
                })
            }
        </div>
    )
})

export default Home
