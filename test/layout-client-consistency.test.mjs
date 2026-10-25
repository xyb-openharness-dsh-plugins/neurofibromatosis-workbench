import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { PANEL } from '../lib/layout.js';
test('lib/client.js register 参数与 lib/layout.js PANEL 一致（面板参数单一来源）', () => {
  const src = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  const m = src.match(/const PANEL = \{ businessSide: '(\w+)', businessWidth: ([\d.]+), customFrame: (true|false) \}/);
  if (!m) throw new Error('client.js 找不到 PANEL 字面量');
  if (m[1] !== PANEL.businessSide || Number(m[2]) !== PANEL.businessWidth || m[3] !== String(PANEL.customFrame)) {
    throw new Error(`漂移：client=${m[1]}/${m[2]}/${m[3]} layout=${PANEL.businessSide}/${PANEL.businessWidth}/${PANEL.customFrame}`);
  }
});
