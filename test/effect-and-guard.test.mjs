import { test } from 'node:test';
// 回归：① ctx.effect 的 setup 语义（不能开库即关库）；② guard 收口 async rejection
test('effect setup 返回 disposer，不立即 close', async () => {
  let closed = 0;
  const db = { close() { closed++; } };
  // 模拟 cordis：effect(fn) 立即执行 fn，fn 返回 disposer
  const effect = (fn) => { const disposer = fn(); return disposer; };
  const disposer = effect(() => () => { try { db.close(); } catch {} });
  if (closed !== 0) throw new Error('setup 阶段不应 close');
  disposer();
  if (closed !== 1) throw new Error('dispose 时应 close 一次');
});
test('guard 捕获 async rejection，不逃逸', async () => {
  let captured = null;
  const fail = (err) => { captured = err; };
  const guard = (handler) => (req, res) => {
    try {
      const out = handler(req, res);
      if (out && typeof out.then === 'function') out.catch((e) => fail(e));
    } catch (e) { fail(e); }
  };
  guard(async () => { throw new Error('database is not open'); })({}, {});
  await new Promise(r => setTimeout(r, 10));
  if (!captured) throw new Error('rejection 没有被收口');
});
