import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
// 判读列断言：schema 全部迁移中不得出现 diagnosis/risk_level 类判定列（家族红线，M3 口径）
const banned = [/diagnosis/i, /risk_level/i, /malignan\w*_risk/i, /prognosis/i, /relapse_risk/i, /recur_risk/i];
test('schema 无判读类判定列', () => {
  const dir = join(import.meta.dirname, '..', 'schema');
  for (const f of readdirSync(dir).filter(f => f.endsWith('.sql'))) {
    const sql = readFileSync(join(dir, f), 'utf8');
    const cols = [...sql.matchAll(/^\s*([a-z_0-9]+)\s+(?:TEXT|INTEGER|REAL)/gim)].map(m => m[1]);
    for (const col of cols) for (const b of banned) {
      if (b.test(col)) throw new Error(`${f}: 判读列 ${col}`);
    }
  }
});
