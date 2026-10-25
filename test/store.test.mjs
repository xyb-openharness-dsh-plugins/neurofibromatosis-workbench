import { test } from 'node:test';
import { openDatabase, migrate, close } from '../dsh/store.js';
test('迁移幂等：连跑两遍 executed 第二次为空', () => {
  const db = openDatabase(':memory:');
  const r1 = migrate(db);
  const r2 = migrate(db);
  if (r2.executed.length !== 0) throw new Error('第二遍不应再执行迁移');
  close(db);
});
