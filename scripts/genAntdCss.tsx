import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { extractStyle } from '@lincy/static-style-extract'
import * as antd from '../src/antd'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function doExtraStyle() {
    const baseDir = path.resolve(__dirname, '../public/static/css')

    const dir = 'antd'

    const outputCssPath = path.join(baseDir, dir)

    if (!fs.existsSync(outputCssPath))
        fs.mkdirSync(outputCssPath, { recursive: true })

    const css = extractStyle(undefined, antd)

    const md5 = createHash('md5')
    const hash = md5.update(css).digest('hex')
    const fileName = `antd.min.${hash.substring(0, 8)}.css`
    const fullpath = path.join(outputCssPath, fileName)

    const res = `/static/css/${dir}/${fileName}`

    if (!fs.existsSync(fullpath)) {
        fs.rmSync(outputCssPath, { recursive: true, force: true })
        fs.mkdirSync(outputCssPath, { recursive: true })
        fs.writeFileSync(fullpath, css)
    }

    return res
}
