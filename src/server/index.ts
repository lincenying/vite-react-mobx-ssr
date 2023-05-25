import path from 'node:path'
import fs from 'node:fs'
import express from 'express'

type RenderFn = (...args: any[]) => Promise<{ html: string }>

// hypothesis: client assets to be in the same directory
export async function createServer() {
    const server = express()

    // const { render } = require(path.join(__dirname, 'index.server.js'))
    const indexServer = (await import(path.join(__dirname, 'index.server.js'))) as { render: RenderFn }
    const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')

    server.use(express.static(__dirname, {
        index: false,
    }))

    server.get(/^\/api\//, (_, res) => {
        res.send('react and vite!')
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    server.get('*', async (req, res) => {
        const { html } = await indexServer.render({ req, res, template })

        res.setHeader('Content-Type', 'text/html')
        res.end(html)
    })

    return server
}

const port = 3000

createServer()
    .then((server) => {
        server.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    })
    .catch(console.error)
