import type { ViteDevServer } from 'vite'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

import baseConfig, { paths } from './vite.config'

function devSSR() {
    return {
        name: 'dev-ssr',
        configureServer(vite: ViteDevServer) {
            const { logger } = vite.config
            const templateHtml = fs.readFileSync(paths.template, 'utf-8')

            // 缺点是不能调试完整服务端代码，只能调试服务端同构应用的部分
            return () =>
                vite.middlewares.use(async (req, res, next) => {
                    try {
                        const { render } = await vite.ssrLoadModule(paths.serverEntry)
                        const template = await vite.transformIndexHtml(req.originalUrl!, templateHtml)
                        const { html } = await render({ req, res, template })

                        res.end(html)
                    }
                    catch (e: unknown) {
                        if (e instanceof Error) {
                            vite.ssrFixStacktrace(e)
                            const errorMessage = e.stack ?? e.message
                            logger.error(errorMessage)
                            next()
                        }
                    }
                })
        },
    }
}

export default defineConfig((configEnv) => {
    const config = baseConfig(configEnv)
    const localMock = true
    return {
        ...config,
        server: {
            port: 7778,
            host: '0.0.0.0',
            hot: true,
            disableHostCheck: true,
            proxy: {
                '/api': {
                    target: 'https://php.mmxiaowu.com',
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, '/api'),
                },
            },
        },
        plugins: [
            ...(config.plugins || []),
            viteMockServe({
                mockPath: 'mock',
                enable: configEnv.command === 'serve' && localMock,
                logger: true,
            }),
            devSSR(),
        ],
        optimizeDeps: {
            include: [
                'react-router',
            ],
        },
        ssr: {
            noExternal: [
                'react-router',
            ],
        },
    }
})
