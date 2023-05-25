import { defineConfig } from 'vite'
import pkg from '../package.json'
import { paths } from './vite.common'

// use vite as cjs bundler
export default defineConfig(({ mode }) => ({
    build: {
        ssr: true,
        sourcemap: mode === 'development',
        emptyOutDir: false,
        rollupOptions: {
            input: paths.server,
            output: {
                dir: undefined, // must leave undefined explicitly
                file: paths.serverOutput,
            },
        },
    },
    ssr: {
        external: Object.keys(pkg.dependencies),
    },
}))
