import type { PrefetchContext } from '@/App'
import { Card, Spin } from '@/antd'

export function prefetch(ctx: PrefetchContext, _type: 'server' | 'client') {
    return ctx.store.article.getArticle(
        {
            id: ctx.params.id,
            pathname: ctx.req.originalUrl,
        },
        ctx.api,
    )
}

function PageArticle() {
    const navigate = useNavigate()

    const location = useLocation()
    const pathname = useMemo(() => location.pathname + location.search, [location])
    const params = useParams()

    const { id } = params

    const article = useStore('article')

    const firstPathname = useRef(pathname)

    useEffect(() => {
        if (article.pathname !== pathname)
            article.getArticle({ id, pathname })
    }, [article, id, pathname])

    useMount(() => {
        console.log('article componentDidMount')
        window.scrollTo(0, 0)
    })

    useUpdateEffect(() => {
        console.log('article componentDidUpdate')
        console.log(firstPathname.current, pathname)
    }, [pathname])

    useUpdateEffect(() => {
        document.title = article.data.c_title
    }, [article.pathname])

    const { data } = article

    return (
        <div className="main">
            <Spin
                delay={100}
                size="large"
                spinning={article.pathname !== pathname}
            >
                <Card
                    bordered={false}
                    title={data.c_title}
                    extra={(
                        <a onClick={() => navigate(-1)}>后退</a>
                    )}
                >
                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: data.c_content }}
                    />
                </Card>
            </Spin>
        </div>
    )
}
export default observer(PageArticle)
