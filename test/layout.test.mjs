import { test } from 'node:test';
import { PANEL, AGENT_PANE, clampAgentRatio, businessPanePx, assertPanelConfig } from '../lib/layout.js';
test('PANEL 参数在宿主区间内且自检通过', () => {
  const p = assertPanelConfig();
  if (p.length) throw new Error(p.join('; '));
  if (PANEL.businessWidth < 0.25 || PANEL.businessWidth >= 0.7) throw new Error('businessWidth 越界');
});
test('clampAgentRatio 夹到 25%–45%', () => {
  if (clampAgentRatio(0.9) !== 0.45) throw new Error('上界');
  if (clampAgentRatio(0.1) !== 0.25) throw new Error('下界');
  if (clampAgentRatio('x') !== AGENT_PANE.def) throw new Error('非数字回默认');
});
test('businessPanePx: 1440×0.65=936', () => {
  if (businessPanePx(1440) !== 936) throw new Error('像素换算');
});
