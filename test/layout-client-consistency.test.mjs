import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { PANEL } from '../lib/layout.js';
test('lib/client.js 面板参数与 lib/layout.js PANEL 一致（面板参数单一来源）', () => {
  const src0 = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
  const cm = src0.match(/const CUSTOM_FRAME = (true|false)/);
  const bw = src0.match(/BUSINESS_WIDTH = Number\('([\d.]+)'\)/);
  const bs = src0.match(/BUSINESS_SIDE = '([a-z]+)'/);
  if (!cm || !bw || !bs) throw new Error('client.js 缺少面板参数字面量');
  if (bs[1] !== PANEL.businessSide || Number(bw[1]) !== PANEL.businessWidth || cm[1] !== String(PANEL.customFrame)) {
    throw new Error(`漂移：client=${bs[1]}/${bw[1]}/${cm[1]} layout=${PANEL.businessSide}/${PANEL.businessWidth}/${PANEL.customFrame}`);
  }
});
