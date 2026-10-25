/**
 * 小纤宝 FibroPal · 服务入口。
 *
 * apiBase 契约（定稿）：
 * - 交界守卫：每个 handler 先过 ctx.connection.requestRejection(req)（未认证 401），
 *   且任何 handler 不许裸 throw——统一 try/catch 成 JSON 错误（500 + code），否则宿主进程崩；
 * - 双形态：同一组路由同时服务 Desktop（webServer.register）与本地开发（dev-server
 *   复用同一组 handler 语义），双形态回归由 test/api-contract.test.mjs 覆盖；
 * - 路径前缀一律 /api/nf/。
 */
import Schema from '@deepseek-ai/schemastery'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { openDatabase, migrate, close } from './store.js'
import { seedDemo } from './demo.js'
import { readWorkbench, readExport, agentContext } from './readmodels.js'

export const name = 'nf-main'
export const inject = ['webServer', 'connection']
export const Config = Schema.object({})
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

/** 开库：config.root 存在则用真目录，否则 :memory: 演示库（seedDemo 唯一源）。 */
function openStore(config) {
  const root = typeof config?.root === 'string' && config.root.trim() ? config.root : null
  const db = root
    ? openDatabase(join(mkdirSync(root, { recursive: true }), 'nf-workbench.sqlite'))
    : openDatabase(':memory:')
  migrate(db)
  if (!root) seedDemo(db)
  return db
}

export function apply(ctx, config = {}) {
  if (!ctx.webServer?.register) throw new Error('Desktop webServer.register is unavailable')
  const db = openStore(config)
  ctx.effect(() => { close(db) }, 'nf store')

  const json = (res, status, body) => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
    res.end(JSON.stringify(body))
  }

  // 交界守卫 + 禁裸 throw 的统一包装
  const guard = (handler) => (req, res) => {
    try {
      if (typeof ctx.connection?.requestRejection !== 'function') return json(res, 503, { error: 'connection authentication capability unavailable' })
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) return json(res, rejection, { error: 'Authentication required' })
      handler(req, res)
    } catch (error) {
      ctx.logger?.warn?.(`nf api error: ${error.message}`)
      json(res, 500, { error: '服务内部错误', code: 'INTERNAL' })
    }
  }

  const readBody = (req) => new Promise((resolve) => {
    let raw = ''
    req.on('data', (c) => { raw += c })
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch { resolve({}) } })
  })

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/nf/health',
    handler: guard((req, res) => {
      if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
      json(res, 200, { ok: true, version: manifest.version, apiVersion: 'v1', capabilities: ['health', 'workbench', 'export', 'agent-context'] })
    }),
  }), 'nf health')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/nf/workbench',
    handler: guard(async (req, res) => {
      if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' })
      const url = new URL(req.url, 'http://local')
      const geneticsOpen = url.searchParams.get('genetics') === '1'
      json(res, 200, readWorkbench(db, { geneticsOpen }))
    }),
  }), 'nf workbench')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/nf/export',
    handler: guard(async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
      const body = await readBody(req)
      json(res, 200, { text: readExport(db, { geneticsOpen: body.genetics === 1 }) })
    }),
  }), 'nf export')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/nf/agent-context',
    handler: guard(async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })
      const body = await readBody(req)
      json(res, 200, agentContext(db, { geneticsOpen: body.genetics === 1 }))
    }),
  }), 'nf agent-context')
}
