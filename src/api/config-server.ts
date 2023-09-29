import { LRUCache } from 'lru-cache'

import apiDomain from './url.js'

const needCached = false
const cached = needCached ? new LRUCache<string, any>({
    max: 1000,
}) : null

const config = {
    api: `${apiDomain}/api/`,
    port: 8080,
    timeout: 30000,
    cached,
    cachedItem: {},
}

export default config
