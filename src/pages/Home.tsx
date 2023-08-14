import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'

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
            await store.getArticleList()
    })

    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => navigate('/about?key=about')}>about</button>
            {
                store.lists.data.map((item) => {
                    return <div key={item.c_id}>{ item.c_title}</div>
                })
            }
        </div>
    )
})

export default Home
