import legacy from '@vitejs/plugin-legacy'

import { defineConfig } from 'vite'
import baseConfig from './vite.config'

export default defineConfig((configEnv) => {
    const config = baseConfig(configEnv)
    return {
        ...config,
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    manualChunks(id: string) {
                        // 处理css分块
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                        if (id.includes('__uno.css')) {
                            return 'unocss'
                        }
                    },
                },
            },
        },
        plugins: [
            ...(config.plugins || []),
            legacy(),
        ],
    }
})
