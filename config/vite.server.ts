import { defineConfig } from 'vite'
import pkg from '../package.json'
import { paths } from './vite.common'

// use vite as cjs bundler
export default defineConfig(() => ({
    build: {
        ssr: true,
        sourcemap: false,
        emptyOutDir: false,
        rollupOptions: {
            input: paths.server,
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    ssr: {
        external: Object.keys(pkg.dependencies),
    },
}))
