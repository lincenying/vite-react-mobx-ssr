import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Card, Spin } from '@/antd'
import { useStore } from '@/stores'

const PageArticle = observer(() => {
    const navigate = useNavigate()

    const location = useLocation()
    const pathname = useMemo(() => location.pathname + location.search, [location])
    const params = useParams()

    const { id } = params

    const article = useStore('article')

    const firstPathname = useRef(pathname)

    useEffect(() => {
        if (window.$timeout.list)
            clearTimeout(window.$timeout.list)
    }, [])

    useEffect(() => {
        if (article.pathname !== pathname) {
            article.getArticle({ id, pathname })
        }
    }, [article, id, pathname])

    useEffect(() => {
        if (firstPathname.current !== pathname) {
            firstPathname.current = pathname
        }
    }, [pathname])

    useEffect(() => {
        if (article.data.c_title) {
            document.title = article.data.c_title
        }
    }, [article.data.c_title, article.pathname])

    const { data } = article

    useAutoScroll('article')

    return (
        <Spin
            delay={100}
            size="large"
            spinning={article.pathname !== pathname}
        >
            <Card
                variant="outlined"
                title={data.c_title}
                extra={(
                    <div>
                        <a className="cursor-pointer text-blue-600" onClick={() => navigate('/')}>首页</a>
                        {' '}
                        <a className="cursor-pointer text-blue-600" onClick={() => navigate(-1)}>后退</a>
                    </div>
                )}
            >
                <div
                    className="break-words article-content"
                    dangerouslySetInnerHTML={{ __html: data.c_content }}
                />
            </Card>
        </Spin>
    )
})

export default PageArticle
