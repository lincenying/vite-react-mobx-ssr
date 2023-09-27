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
            <button onClick={() => navigate('/?key=home')}>home</button>
            <div>
                <button onClick={() => store.increment()}>{store.count}</button>
            </div>
        </div>
    )
})

export default About
