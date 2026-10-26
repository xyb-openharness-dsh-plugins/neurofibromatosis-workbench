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

/**
 * 开库：config.root 存在则用真目录，否则 :memory: 演示库（seedDemo 唯一源）。
 * 注意：mkdirSync(root, {recursive:true}) 在目录已存在时返回 undefined，不能把返回值当路径
 * （NF 0.1.4 坑：首装可用、重启必抛 ERR_INVALID_ARG_TYPE 导致 nf-main 激活失败）。
 */
function openStore(config) {
  const root = typeof config?.root === 'string' && config.root.trim() ? config.root : null
  if (root) mkdirSync(root, { recursive: true })
  const db = root ? openDatabase(join(root, 'nf-workbench.sqlite')) : openDatabase(':memory:')
  migrate(db)
  // 家族 M5 惯例：空库（真机初始态）注入演示数据（demo-data 唯一源），demo_meta 标记；
  // 已有真实数据（subjects 非空）则绝不触碰。
  const seeded = db.prepare('SELECT COUNT(*) AS n FROM subjects').get().n
  if (seeded === 0) seedDemo(db)
  return db
}

export function apply(ctx, config = {}) {
  if (!ctx.webServer?.register) throw new Error('Desktop webServer.register is unavailable')
  let db = null
  let openFailure = null
  try {
    db = openStore(config)
  } catch (error) {
    openFailure = error.message
    ctx.logger?.warn?.(`nf store unavailable: ${openFailure}`)
  }
  // cordis: ctx.effect(fn) 立即执行 fn，返回值才是 disposer。不能写成 () => { close(db) }（那会开库即关库）。
  if (db) ctx.effect(() => () => { try { close(db) } catch { /* 已关闭 */ } }, 'nf store')

  const json = (res, status, body) => {
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
    res.end(JSON.stringify(body))
  }

  // 交界守卫 + 禁裸 throw 的统一包装
  const fail = (res, error) => {
    ctx.logger?.warn?.(`nf api error: ${error?.message ?? error}`)
    if (!res.headersSent) json(res, 500, { error: '服务内部错误', code: 'INTERNAL' })
  }
  const guard = (handler, { needStore = true } = {}) => (req, res) => {
    try {
      if (typeof ctx.connection?.requestRejection !== 'function') return json(res, 503, { error: 'connection authentication capability unavailable' })
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) return json(res, rejection, { error: 'Authentication required' })
      if (needStore && !db) return json(res, 503, { error: '本机数据目录不可用', code: 'STORE_UNAVAILABLE', detail: openFailure })
      const out = handler(req, res)
      // 异步 handler 的 rejection 必须收口，否则逃逸成 unhandled rejection（DSH Desktop 会判 fatal load failure）
      if (out && typeof out.then === 'function') out.catch((error) => fail(res, error))
    } catch (error) {
      fail(res, error)
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
      json(res, 200, { ok: true, version: manifest.version, apiVersion: 'v1', degraded: !db, storeError: openFailure, capabilities: ['health', 'workbench', 'export', 'agent-context'] })
    }),
  }, { needStore: false }), 'nf health')

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
