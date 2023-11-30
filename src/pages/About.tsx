import { Button } from '@/antd'
import { useStore } from '@/store'

const About = observer(() => {
    const store = useStore('about')
    const location = useLocation()
    const params = useParams()
    const [query] = useSearchParams()
    console.log(location, params, query.get('key'))
    const navigate = useNavigate()

    return (
        <div>
            <Button onClick={() => navigate('/?key=home')}>Home</Button>
            <div>
                <Button onClick={() => store.increment()}>{store.count}</Button>
            </div>
        </div>
    )
})

export default About
