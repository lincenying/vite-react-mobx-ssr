import legacy from '@vitejs/plugin-legacy'

import { defineConfig } from 'vite'
import baseConfig from './vite.config'

export default defineConfig((configEnv) => {
    const config = baseConfig(configEnv)
    return {
        ...config,
        build: {
            sourcemap: false,
        },
        plugins: [
            ...(config.plugins || []),
            legacy(),
        ],
    }
})
