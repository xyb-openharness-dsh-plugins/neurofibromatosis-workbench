import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// 真机包必须带 demo-data 唯一源文件（0.1.13 装机踩坑：缺失导致 openStore 降级、界面全空）
// 2026-10-27：界面提升为 public/（随包发出），demo 种子改为读 public/demo-data.js。
test('files 包含 public/demo-data 且 dsh/demo.js 引用它', () => {
  const root = join(import.meta.dirname, '..');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const need = 'public/demo-data.js';
  if (!pkg.files.includes('public')) throw new Error('package.json files 缺 public（界面与 demo 数据都不随包）');
  if (!existsSync(join(root, need))) throw new Error('文件不存在: ' + need);
  const demo = readFileSync(join(root, 'dsh/demo.js'), 'utf8');
  if (!demo.includes(need)) throw new Error('dsh/demo.js 未引用 demo-data 唯一源');
});
