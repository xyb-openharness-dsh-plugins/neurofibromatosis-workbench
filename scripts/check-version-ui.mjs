#!/usr/bin/env node
/**
 * 界面版本一致性：唯一来源是仓库根目录的 VERSION。
 *
 * 界面有两份（prototypes/v0.1 是原型源，public/ 是随包发出的界面），
 * 两边的版本字面量都必须与 VERSION 一致 —— 否则「关于」弹窗、页脚、标题会各说各话
 * （小纤宝 0.1.17 之前界面写死 v0.1.0，装机后看起来像旧版）。
 *
 * 用法：
 *   node scripts/check-version-ui.mjs          只校验（不一致退出 1）
 *   node scripts/check-version-ui.mjs --write  就地同步
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const version = readFileSync(join(root, 'VERSION'), 'utf8').trim()
const write = process.argv.includes('--write')

const TARGETS = [
  ['prototypes/v0.1/index.html', 'html'],
  ['public/index.html', 'html'],
  ['prototypes/v0.1/demo-data.js', 'demo'],
  ['public/demo-data.js', 'demo'],
]

const SEMVER = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?`
const HTML_VER = new RegExp(`v${SEMVER}`, 'g')
const DEMO_VER = new RegExp(`(version:\\s*['"])${SEMVER}(['"])`)

let bad = 0
let checked = 0
for (const [rel, kind] of TARGETS) {
  const file = join(root, rel)
  if (!existsSync(file)) {
    if (rel.startsWith('public/')) {
      console.error(`✗ 缺少随包界面文件 ${rel}（UI 必须随包发出）`)
      bad++
    }
    continue
  }
  checked++
  const before = readFileSync(file, 'utf8')
  const after = kind === 'html'
    ? before.replace(HTML_VER, `v${version}`)
    : before.replace(DEMO_VER, `$1${version}$2`)
  if (after === before) continue
  if (write) {
    writeFileSync(file, after)
    console.log(`✎ 已同步 ${rel} → ${version}`)
  } else {
    console.error(`✗ ${rel} 的版本字面量与 VERSION（${version}）不一致；运行 node scripts/check-version-ui.mjs --write`)
    bad++
  }
}

if (bad) process.exit(1)

/* 随包界面 public/ 是 prototypes/v0.1 的副本：两份必须逐字节一致，
   否则「原型上改好了、装进去还是旧界面」会无声发生。 */
const PAIRS = ['index.html', 'app.js', 'demo-data.js', 'style.css', 'primer.css', 'primer-data.js', 'primer.js']
for (const name of PAIRS) {
  const src = join(root, 'prototypes/v0.1', name)
  const dst = join(root, 'public', name)
  if (!existsSync(src) || !existsSync(dst)) {
    console.error(`✗ 界面文件缺失：${!existsSync(src) ? `prototypes/v0.1/${name}` : `public/${name}`}`)
    bad++
    continue
  }
  if (readFileSync(src).equals(readFileSync(dst))) continue
  if (write) {
    copyFileSync(src, dst)
    console.log(`✎ 已同步 public/${name} ← prototypes/v0.1/${name}`)
  } else {
    console.error(`✗ public/${name} 与 prototypes/v0.1/${name} 不一致；运行 node scripts/check-version-ui.mjs --write`)
    bad++
  }
}

if (bad) process.exit(1)
console.log(`✓ 界面版本与两份界面文件一致：${version}（检查 ${checked}/${TARGETS.length} 个版本目标 + ${PAIRS.length} 个同步项）`)
