import { defineConfig } from 'vite'
import baseConfig, { paths } from './vite.config'

export default defineConfig((configEnv) => {
    const config = baseConfig(configEnv)

    return {
        ...config,
        build: {
            ...config.build,
            ssr: paths.serverEntry,
        },
    }
})
