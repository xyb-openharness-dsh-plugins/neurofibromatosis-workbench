import { test } from 'node:test';
import { mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// 回归：目录已存在时 openStore 仍可用（mkdirSync recursive 返回 undefined 的坑，NF 0.1.4 真机踩过）
test('同一 root 连续两次开库不抛（目录已存在）', async () => {
  const { openDatabase, migrate, close } = await import('../dsh/store.js');
  const root = mkdtempSync(join(tmpdir(), 'nf-root-'));
  const boot = () => {
    // 模拟 dsh/index.js openStore 逻辑（不引入 cordis 依赖）
    const { mkdirSync } = require('node:fs');
    mkdirSync(root, { recursive: true });
    const db = openDatabase(join(root, 'nf-workbench.sqlite'));
    migrate(db);
    return db;
  };
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const db1 = boot(); close(db1);
  const db2 = boot(); close(db2);
  if (!existsSync(join(root, 'nf-workbench.sqlite'))) throw new Error('库没建出来');
  rmSync(root, { recursive: true, force: true });
});
