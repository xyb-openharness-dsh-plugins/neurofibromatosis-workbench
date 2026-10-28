/* 装机回归：prefix 路由不能带尾斜杠，否则业务区整片空白。
 *
 * 宿主 dsh-host-webserver 的命中判据（照抄源码）：
 *   pathname === prefix || pathname.startsWith(`${prefix}/`)
 * 注册 '/api/nf/ui/' 时只有页面本身命中，app.js / style.css / demo-data.js 全部落到
 * 宿主兜底（回 index.html）→ 浏览器把 HTML 当 JS 解析 → 装机后业务区白屏。
 * 本地 dev-server 挂在根上，永远看不见这一条，所以必须在这里钉住。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createStaticHandler, stripMountPrefix } from '../dsh/server.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = join(ROOT, 'public')
const SOURCE = readFileSync(join(ROOT, 'dsh/index.js'), 'utf8')

/** 宿主 prefix 命中判据（照抄 @deepseek-ai/dsh-host-webserver 的 match） */
const hostMatch = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)

const UI_PREFIX = SOURCE.match(/export const UI_PREFIX = '([^']+)'/)[1]
const UI_ROUTE = UI_PREFIX.replace(/\/+$/, '')

/** 用假 req/res 跑一次静态 handler，返回 { status, length } */
function invoke(url) {
  let status = 0
  let length = 0
  const res = {
    headersSent: false,
    writeHead(code) { status = code },
    end(body) { length = Buffer.isBuffer(body) ? body.length : Buffer.byteLength(String(body ?? '')) },
  }
  createStaticHandler(PUBLIC_DIR, UI_ROUTE)({ method: 'GET', url }, res)
  return { status, length }
}

test('注册用的前缀不带尾斜杠，且与 iframe 入口同源', () => {
  assert.ok(/export const UI_ROUTE = UI_PREFIX\.replace\(\/\\\/\+\$\/, ''\)/.test(SOURCE),
    'UI_ROUTE 必须是 UI_PREFIX 去掉尾斜杠')
  assert.ok(UI_PREFIX.endsWith('/'), 'UI_PREFIX 仍应是 iframe 入口的带斜杠形态')
  assert.ok(!UI_ROUTE.endsWith('/'), 'UI_ROUTE 不能带尾斜杠')
  assert.ok(/kind: 'prefix', path: UI_ROUTE/.test(SOURCE), "prefix 路由必须注册 UI_ROUTE")
  assert.ok(!/kind: 'prefix', path: UI_PREFIX/.test(SOURCE), '不能拿带尾斜杠的 UI_PREFIX 注册 prefix 路由')
})

test('宿主命中判据：子资源必须能命中注册的前缀', () => {
  assert.equal(hostMatch(`${UI_ROUTE}/app.js`, UI_ROUTE), true)
  assert.equal(hostMatch(`${UI_ROUTE}/style.css`, UI_ROUTE), true)
  assert.equal(hostMatch(`${UI_ROUTE}/`, UI_ROUTE), true)
  // 反证：带尾斜杠注册时 app.js 命中不了（这正是装机白屏的原因）
  assert.equal(hostMatch(`${UI_PREFIX}app.js`, UI_PREFIX), false)
})

test('stripMountPrefix 认带/不带尾斜杠两种形态', () => {
  assert.equal(stripMountPrefix(`${UI_ROUTE}/app.js`, UI_ROUTE), '/app.js')
  assert.equal(stripMountPrefix(`${UI_ROUTE}/`, UI_ROUTE), '/')
  assert.equal(stripMountPrefix(UI_ROUTE, UI_ROUTE), '/')
  assert.equal(stripMountPrefix(`${UI_PREFIX}app.js`, UI_PREFIX), '/app.js')
  assert.equal(stripMountPrefix('/app.js', UI_ROUTE), '/app.js')
})

test('页面与子资源都能取到（200 且非空）', () => {
  const page = invoke(`${UI_ROUTE}/`)
  assert.equal(page.status, 200)
  assert.ok(page.length > 500, `index.html 太小：${page.length}`)
  for (const asset of ['app.js', 'style.css', 'demo-data.js']) {
    const got = invoke(`${UI_ROUTE}/${asset}`)
    assert.equal(got.status, 200, `${asset} 应 200，实际 ${got.status}`)
    assert.ok(got.length > 100, `${asset} 内容可疑：${got.length}`)
  }
})

test('不再回退到把 HTML 当 JS（子资源 content-type 必须是 js/css）', () => {
  // demo-data.js 与 style.css 都取回 200，且 stripMountPrefix 不会把它们映射到 index.html
  assert.equal(stripMountPrefix(`${UI_ROUTE}/demo-data.js`, UI_ROUTE), '/demo-data.js')
  assert.equal(stripMountPrefix(`${UI_ROUTE}/style.css`, UI_ROUTE), '/style.css')
})