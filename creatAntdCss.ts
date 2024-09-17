import { createHash } from 'node:crypto'

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractStyle } from '@lincy/static-style-extract'
import * as antd from './src/antd'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function doExtraStyle() {
    const outputCssPath = path.resolve(__dirname, './dist/static/css')

    if (!fs.existsSync(outputCssPath)) {
        fs.mkdirSync(outputCssPath, { recursive: true })
    }

    const css = extractStyle(undefined, antd)

    const md5 = createHash('md5')
    const hash = md5.update(css).digest('hex')
    const fileName = `antd.min.${hash.substring(0, 8)}.css`
    const fullpath = path.join(outputCssPath, fileName)

    const res = `/static/css/${fileName}`

    if (!fs.existsSync(fullpath)) {
        fs.rmSync(outputCssPath, { recursive: true, force: true })
        fs.mkdirSync(outputCssPath, { recursive: true })
        fs.writeFileSync(fullpath, css)
    }

    return res
}

const href = doExtraStyle()

let html = fs.readFileSync('./dist/index.html', 'utf-8')

html = html.replace('<!--app-style-->', `<link rel="stylesheet" href="${href}" />`)

fs.writeFileSync('./dist/index.html', html)
