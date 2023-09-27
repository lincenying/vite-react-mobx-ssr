import { readFile } from 'node:fs/promises'

import lincy from '@lincy/eslint-config'
import plugin from '@unocss/eslint-plugin'

import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'

const autoImport = JSON.parse(
    await readFile(new URL('./.eslintrc-auto-import.json', import.meta.url)),
)

const config = lincy(
    {
        vue: false,
    },
    {
        plugins: {
            '@unocss': plugin,
        },
        rules: {
            ...plugin.configs.recommended.rules,
            '@unocss/order': 'off',
        },
    },
    {
        files: [
            '**/*.?([cm])[jt]s?(x)',
        ],
        settings: {
            react: {
                version: '17.0',
            },
        },
        plugins: {
            'react': pluginReact,
            'react-hooks': pluginReactHooks,
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            'jsx-quotes': ['error', 'prefer-double'],
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        languageOptions: {
            globals: {
                ...autoImport.globals,
            },
        },
    },
    {
        ignores: [
            '**/assets',
            '**/static',
        ],
    },
)

export default config
