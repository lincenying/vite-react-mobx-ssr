import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'

import { useStore } from '@/store'
import type { PrefetchContext } from '@/App'

export const prefetch = (ctx: PrefetchContext) => ctx.store.home.fetchName()

const Home = observer(() => {
    const store = useStore('home')
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useMount(async () => {
        if (!store.name)
            await store.fetchName()
    })

    const hello = `hello ${store.name}`
    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => navigate('/about')}>about</button>
            <div>{hello}</div>
        </div>
    )
})

export default Home
