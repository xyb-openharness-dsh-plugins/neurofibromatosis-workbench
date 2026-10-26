import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
// 客户端 register 的 version 必须与 package.json 一致（防漂移；NF 0.1.7 曾因引用未定义变量导致注册失败）
test('client VERSION 与 package.json 一致', () => {
  const root = join(import.meta.dirname, '..');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const src = readFileSync(join(root, 'lib/client.js'), 'utf8');
  const m = src.match(/const VERSION = ['"]([^'"]+)['"]/);
  if (!m) throw new Error('client.js 缺少 VERSION 常量');
  if (m[1] !== pkg.version) throw new Error(`漂移：client=${m[1]} pkg=${pkg.version}`);
});
