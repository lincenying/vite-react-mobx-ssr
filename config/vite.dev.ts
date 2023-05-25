import fs from 'node:fs'
import type { ViteDevServer } from 'vite'
import { defineConfig } from 'vite'
import { viteMockServe } from '@lincy/vite-plugin-mock'

import base, { paths } from './vite.common'

// function devMock() {
//     return {
//         name: 'dev-api-mock',
//         configureServer(vite: ViteDevServer) {
//             const { logger } = vite.config

//             vite.middlewares.use((req, res, next) => {
//                 if (/^\/api\//.test(req.originalUrl!)) {
//                     logger.info(`mock ${req.originalUrl!}`)

//                     res.end('vite dev')
//                 }
//                 else {
//                     next()
//                 }
//             })
//         },
//     }
// }

function devSSR() {
    return {
        name: 'dev-ssr',
        configureServer(vite: ViteDevServer) {
            const { logger } = vite.config
            const templateHtml = fs.readFileSync(paths.template, 'utf-8')

            // 缺点是不能调试完整服务端代码，只能调试服务端同构应用的部分
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            return () => vite.middlewares.use(async (req, res, next) => {
                try {
                    const { render } = (await vite.ssrLoadModule(paths.serverEntry)) as { render: AnyFn }
                    const template = await vite.transformIndexHtml(req.originalUrl!, templateHtml)
                    const { html } = (await render({ req, res, template })) as Obj

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

export default defineConfig((c) => {
    const config = base(c)
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
                    target: 'https://api.mmxiaowu.com',
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, '/api'),
                },
            },
        },
        plugins: [
            ...(config.plugins || []),
            viteMockServe({
                mockPath: 'mock',
                enable: c.command === 'serve' && localMock,
                logger: true,
            }),
            devSSR(),
        ],
    }
})
