import { LRUCache } from 'lru-cache'
import { getServerApiDomain } from '@/utils/env'

const needCached = false
const cached = needCached ? new LRUCache<string, unknown>({
    max: 1000,
}) : null

const config = {
    api: `${getServerApiDomain()}/api/`,
    port: 8080,
    timeout: 30000,
    cached,
    cachedItem: {},
}

export default config
