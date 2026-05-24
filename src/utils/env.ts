/**
 * 读取 API 基础路径
 */
export function getApiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || '/api/'
}

/**
 * 读取服务端 API 域名
 */
export function getServerApiDomain(): string {
    return import.meta.env.VITE_SERVER_URL || 'https://php.mmxiaowu.com'
}
