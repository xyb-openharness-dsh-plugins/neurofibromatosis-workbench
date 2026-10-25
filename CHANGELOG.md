## 0.1.4 — 2026-10-25

- 临床试验页视觉对齐 biliary v0.2：右上符合度盒（弃进度条）、条件独立描边盒+圆形徽标、档案事实卡格、导出这次对照；开发版 client 同步（含 cond_text JSON 结构化条件）。

## 0.1.3 — 2026-10-25

- 原型六轮返工定稿同步进开发版：breast 口径指标卡墙（9 指标 4 组/原位 3D 翻转/较前次箭头/sparkline 背面）、一图秀左栏（范围 chips+分组勾选即时更新+显示开关+每线自身范围缩放+图例全期区间+记录点 pin）、临床试验 biliary 口径（档案事实卡/三态待确认/粗筛分档/硬性单列/收藏与加问题清单）、全页「和AI讨论 ↗」携带本页上下文（34 号 agent-draft）。
- schema/0002_trial_meta.sql：trials 加 source_url/kind/registered/flag（冻结合同已追加 sha256）。
- 修复：读模型 trial 聚合字段名不匹配（条件散架）、种子瘤体引用映射错位（T-01 序列为空）。
- 真机：0.1.3 已装入 ~/.dsh-classic/profiles/desktop（依赖+bundles 双登记），宿主 21:04 重启后自动建库并应用 0001+0002 迁移；界面加载仍待用户新建会话确认。

# 变更记录

## v0.1.2 · 2026-10-25

- 修复装机激活错误：dsh/index.js 误用 ctx.config（cannot get property "config" without inject），改为 apply(ctx, config) 由 cordis 注入；升版重装。
- v0.1.1 · 2026-10-25：M5 开发版（API 四路由/读模型/客户端 9 页）；package files 补 schema/（否则安装后迁移失败）。
- v0.1.0 · 2026-10-25：M0–M4 首版（脚手架 + 原型四件套 + schema/0001 冻结 + 临床试验库 364 条）。

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.0 — 2026-10-25

- 由社区脚手架 dsh-wb-cli@1.5.7 (c0bcc5d+dirty) 初始化，仅有注册骨架与健康接口，无业务功能。
