import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import postcssNormalize from 'postcss-normalize'
import flexbugsFixes from 'postcss-flexbugs-fixes'

import { type ConfigEnv, defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const paths = {
    src: path.resolve(__dirname, '.', 'src'),
    dist: path.resolve(__dirname, '..', 'dist'),
    template: path.resolve(__dirname, '.', 'index.html'),
    server: path.resolve(__dirname, '.', 'src/server.ts'), // 服务端代码入口
    serverEntry: path.resolve(__dirname, '.', 'src/index.server.tsx'), // 服务端同构应用入口
    serverOutput: path.resolve(__dirname, '.', 'dist/server.js'),
}

export default defineConfig(({ mode }: ConfigEnv) => ({
    build: {
        sourcemap: true,
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            '@': paths.src,
        },
    },
    legacy: {
        proxySsrExternalModules: true,
    },
    css: {
        postcss: {
            plugins: [
                flexbugsFixes,
                postcssNormalize(),
            ],
        },
        devSourcemap: mode === 'development',
    },
    plugins: [
        react(),
        AutoImport({
            eslintrc: {
                enabled: true,
            },
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.md$/, // .md
            ],
            imports: [
                'react',
                'react-router-dom',
                'ahooks',
                {
                    'mobx-react-lite': ['observer'],
                },
            ],
            dts: 'src/auto-imports.d.ts',
            dirs: [
                'src/stores/**',
                'src/composables',
            ],

            resolvers: [],
            defaultExportByFilename: false,
            vueTemplate: false,
        }),
        UnoCSS(),
    ],
}))
