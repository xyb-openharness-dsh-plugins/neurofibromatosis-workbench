## 0.1.20（2026-11-11，AI 对话面板激活修复）

- 会话判定改用宿主归属 `ownedSession()`（`ownsSession(currentSession())`），不再用 `Boolean(conversation)`（customFrame 下没会话也会传隐藏容器 → 判断恒为真 → 点了没反应）。
- 创建路径改 `service.newSession(workspaceId)`，工作区取 `service.defaultWorkspace?.()?.workspaceId`；无可用工作区时由宿主提示选目录；不再用 `ensureSession({})`。
- 取消目录选择不留空会话并提示可重试；创建失败在工作台内显示原因；订阅会话变化触发重渲染；草稿仍只填不发。
- 版本与生成物同步 0.1.20；新增 `scripts/check-agent-pane-contract.mjs` 入 check 链。
- **界面加载与真机点击待人工**（需退出重开 DSH Desktop 后新建会话走查）。

## 0.1.19 — 2026-10-28（装机白屏修复：prefix 路由带尾斜杠）

- **根因**：`dsh/index.js` 把带尾斜杠的 `UI_PREFIX`（`/api/nf/ui/`）直接注册给宿主 prefix 路由。
  宿主 `dsh-host-webserver` 的命中判据是 `pathname === prefix || pathname.startsWith(prefix + '/')`，
  于是 `/api/nf/ui/` 本身能命中，`/api/nf/ui/app.js`、`style.css`、`demo-data.js` 全部命不中，
  落到宿主兜底（回 index.html）→ 浏览器把 HTML 当 JS/CSS 解析（`Unexpected token '<'`）→ **装机后业务区整片空白**。
  本地 dev-server 挂在根上，永远看不见这一条，所以 check/test 全绿也会翻车。
- **修法**：新增 `UI_ROUTE = UI_PREFIX.replace(/\/+$/, '')` 专供 `webServer.register`；`createStaticHandler`
  改用 `stripMountPrefix()`，带/不带尾斜杠两种形态都认（宿主不重写 `req.url`）。
  iframe 入口仍是 `UI_PREFIX`（带斜杠），对外 URL 不变。
- **回归**：新增 `test/ui-route.test.mjs`（5 条：注册形态、宿主命中判据、前缀剥离、子资源 200、不回退 HTML），
  其中一条用宿主源码的判据反证「带尾斜杠注册时 app.js 命不中」。`npm run check` / `npm test` 均退出 0。
- 实测（宿主同源桩件）：修前 `/api/nf/ui/` 200、`/api/nf/ui/app.js` 404；修后页面与子资源全部 200，
  真 Chrome 渲染出完整看板（DOM 187 KB，正文 765 字）。

## 0.1.17 — 2026-10-27

- 36 号 v2 引入（指南可点 + 状态卡）：原型顶栏「?」整页浮窗四段（定义 → 医学资料规范和指南情况 → 治疗全景 → 发展趋势），数据源 `prototypes/v0.1/primer-data.js`，内容取自 README / docs/SOURCES.md / docs/CLINICAL-DATA.md，不写判定、不复制指南条文。
- 看板首卡补病程状态卡四件（eyebrow / 锚点派生天数 / 现状行 / 出口按钮排）；本仓 demo 无锚点日，天数显示「待初始化」并指向三步初始化，不手填。
- 装机层同步：`dsh/index.js` 的 `/api/nf/ui/` 白名单登记 primer 三件套，`package.json.files` 随包发出；漏登记即装机后 404。
- 链接：3 条可验证 OK（中国政府网 2025 版通知页、协和 2023 版期刊全文页、WHO WRH 2021 出版页）；4 项未取得可验证原件（N02 2021 儿童规范、GenTURIS 2022、NMPA 司美替尼公告、自采 364 条登记快照）均如实 `nolink + note`，未编 URL。
- 新增 `scripts/check-primer-links.mjs` 并接入 `npm run check`；新增 `scripts/probe-disease-primer.mjs`（P1–P9 + E0）。

## 0.1.15/0.1.16 — 2026-10-27

- 界面架构对齐家族 Desktop 模式（小泌宝/乳腺癌）：customFrame 客户端 + iframe 承载原型 UI（/api/nf/ui/），原生 AI 会话（顶栏按钮+可拖 25–45%+收起不丢会话）+ nf:agent-draft 草稿桥；弃用手写 React 版（解决菜单对比度、文字堆积，界面与已签认原型逐字符一致）。
- 0.1.16 修复 imports 缺失导致的条目静默不加载（批量替换必须 assert）。

## 0.1.14 — 2026-10-27

- 修复真机界面全空：npm files 缺 prototypes/v0.1/demo-data.js（demo 唯一源）致 openStore 降级。真机空库自动注入演示数据（demo_meta 标记、真实数据绝不覆盖），顶栏/看板「演示数据」横幅；demo-bundle 回归测试 20/20。

## 0.1.12 — 2026-10-27

- 修复打开工作台即报"请检查该工作台是否已正确安装"：真机空库下客户端渲染崩溃（subject 等空集合未兜底）。客户端全面空安全 + 空档案引导卡；空库读模型回归测试（18/18）。

## 0.1.11 — 2026-10-26

- 修复"工作台不出现"的最终两处：①客户端 register 引用未定义变量 healthVersion（改为顶层 VERSION + 一致性测试）；②宿主市场层 `.dsh-market/state.json` 的 disabled 列表需解除（本次手工解除并验证）。
- 实测：health 200、client 进 boot graph、known-providers icon 🧬/version 0.1.11。

## 0.1.6 — 2026-10-26

- 修复 dsh-desktop fatal load failure（真凶）：`ctx.effect(() => { close(db) })` 在 apply 阶段立即关库 → 查询抛 "database is not open" → unhandled rejection → 宿主判 fatal 并自动禁用插件。改为 setup 返回 disposer；guard 收口 async rejection；回归测试 16/16。

## 0.1.5 — 2026-10-26

- 修复重启后工作台不出现：openStore 误用 mkdirSync(recursive) 返回值（目录已存在时 undefined）导致激活抛错；开库失败降级 503/health degraded，不裸 throw；新增 store-root 回归测试（14/14 绿）。

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
