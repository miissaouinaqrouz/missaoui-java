import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localVisitorRegister()],
})

function localVisitorRegister(): Plugin {
  return {
    name: 'local-visitor-register',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/register', async (request: IncomingMessage, response: ServerResponse) => {
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          const body = await readRequestBody(request)
          const firstName = cleanName(body.firstName)
          const lastName = cleanName(body.lastName)

          if (!firstName || !lastName) {
            response.statusCode = 400
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ error: 'firstName and lastName are required' }))
            return
          }

          const visitorsFile = path.resolve(process.cwd(), 'data', 'visitors.json')
          await fs.mkdir(path.dirname(visitorsFile), { recursive: true })

          const visitors = await readVisitors(visitorsFile)
          visitors.push({
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            registeredAt: new Date().toISOString(),
            source: 'local-dev',
          })

          await fs.writeFile(visitorsFile, `${JSON.stringify(visitors, null, 2)}\n`)

          response.statusCode = 201
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ ok: true, count: visitors.length }))
        } catch (error) {
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Registration failed' }))
        }
      })
    },
  }
}

async function readRequestBody(request: NodeJS.ReadableStream) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

async function readVisitors(file: string) {
  try {
    const raw = await fs.readFile(file, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function cleanName(value: unknown) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
}
