/* 面板布局参数（NF 版）。
 *
 * DSH 分栏合同的唯一入参来源：客户端 register、构建注入与包级检查都读它，
 * 别处不许再写一份 0.65（也别写它的补数 0.35）。
 *
 * v0.1.0 开发版用标准分栏（customFrame=false）：宿主只认 businessSide/businessWidth
 * 两个注册参数，服务侧没有拖宽/收起接口。AI 会话档位（AGENT_PANE，20 号 25%–45%）
 * 记在这里供页面内自绘会话栏与将来升级 customFrame 使用，当前不驱动宿主。
 * 升级路径见 cervical 0.2+ 的 customFrame 实装（家族已踩过 0.1.0 标准分栏的坑）。
 */
export const PANEL = Object.freeze({
  businessSide: 'left',
  businessWidth: 0.65,
  customFrame: false,
});

/** 宿主允许的 businessWidth 区间（宿主 client.js 强校验，越界直接抛错） */
export const HOST_LIMITS = Object.freeze({ min: 0.25, max: 0.7 });

/** AI 会话面板宽度档位（占工作区比例，25%–45%，20 号基线；当前仅页面内使用） */
export const AGENT_PANE = Object.freeze({
  def: 0.35,
  default: 0.35,
  min: 0.25,
  max: 0.45,
  step: 24,
  ratioStep: 0.02,
  presets: Object.freeze({ narrow: 0.25, std: 0.35, wide: 0.45 }),
});

/** 把比例夹到 AGENT_PANE 区间；非数字一律回默认值。 */
export function clampAgentRatio(ratio) {
  const r = Number(ratio);
  if (!Number.isFinite(r)) return AGENT_PANE.def;
  return Math.min(AGENT_PANE.max, Math.max(AGENT_PANE.min, r));
}

/** 业务区像素宽度：宿主给的比例 × 窗口宽度。1440 → 936，1280 → 832。 */
export function businessPanePx(windowWidth, width = PANEL.businessWidth) {
  if (!Number.isFinite(windowWidth) || windowWidth <= 0) throw new TypeError('windowWidth 必须是正数');
  if (!Number.isFinite(width) || width <= 0) throw new TypeError('width 必须是正数');
  return Math.round(windowWidth * width);
}

/** 自检：返回问题清单，空数组表示合法。参数可注入，便于单测覆盖越界情形。 */
export function assertPanelConfig(config = PANEL, agent = AGENT_PANE) {
  const problems = [];
  if (!config || typeof config !== 'object') return ['面板配置必须是对象'];
  if (!['left', 'right'].includes(config.businessSide)) problems.push(`businessSide 只能是 left/right，当前 ${config.businessSide}`);
  if (typeof config.customFrame !== 'boolean') problems.push(`customFrame 必须是布尔值，当前 ${config.customFrame}`);
  const w = config.businessWidth;
  if (!(typeof w === 'number' && Number.isFinite(w) && w >= HOST_LIMITS.min && w <= HOST_LIMITS.max)) {
    problems.push(`businessWidth 必须在 ${HOST_LIMITS.min}–${HOST_LIMITS.max} 之间，当前 ${w}`);
  } else if (w === HOST_LIMITS.max) {
    problems.push('businessWidth 不得取上限 0.7：会把会话区压到 0.3 以下');
  }
  if (agent && typeof agent === 'object') {
    const { def, min, max } = agent;
    if (!(min < max)) problems.push(`AGENT_PANE.min(${min}) 必须小于 max(${max})`);
    if (!(def >= min && def <= max)) problems.push(`AGENT_PANE.def(${def}) 必须落在 ${min}–${max} 内`);
  }
  return problems;
}
