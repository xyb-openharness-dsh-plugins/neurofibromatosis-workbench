import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// 真机包必须带 demo-data 唯一源文件（0.1.13 装机踩坑：缺失导致 openStore 降级、界面全空）
test('files 包含 demo-data 且 dsh/demo.js 引用它', () => {
  const root = join(import.meta.dirname, '..');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const need = 'prototypes/v0.1/demo-data.js';
  if (!pkg.files.includes(need)) throw new Error('package.json files 缺 ' + need);
  if (!existsSync(join(root, need))) throw new Error('文件不存在');
  const demo = readFileSync(join(root, 'dsh/demo.js'), 'utf8');
  if (!demo.includes("prototypes/v0.1/demo-data.js")) throw new Error('dsh/demo.js 未引用 demo-data 唯一源');
});
