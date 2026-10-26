# DEV-PLAN · 小纤宝 FibroPal

## 里程碑（M0–M9，闸口不跳）
- M0 ✅ 2026-10-25：认领 issue #41（claimed）；建仓 clone；dsh-wb-cli init（336 文件）；cordis.patch.yml 补 config.root: !!js dshHomePath('neurofibromatosis-workbench')；文档 9 件原创；check staticPass=true（实测）。
- M1 ⏳：三路调研（医学 10 主题指南 PDF 核数 / 用户研究 0 访谈如实 / 家族对比 vs cervical+breast）→ DIFF-MATRIX 一级重名率实测（≤70%）→ SPEC/USER-RESEARCH/INTERACTION-DESIGN 全量（28 号 IP1）。【G1 签认；用户未应答则按推荐项继续，留痕"签认待补"】
- M2 ⏳：原型 demo 唯一源 + 四件套；治疗线 32 号折叠卡；窄宽 30 号；HVT X1–X4；SVG chart + Fritsch–Carlson；AI 按钮 xxx:agent-draft；独立评审（P0=0 修复留痕）；README 实渲截图 ≥4 张 + 折叠两态。【G2】
- M3 ⏳：schema/0001 + freeze-contract sha256 + 判读列断言。【G3】
- M4 ⏳：fetch-nf-trials（MCP stdio 四通道）→ 四件套；manifest=jsonl=sqlite；FAILED 如实记"未查过"。
- M5 ✅ 2026-10-25（部分 ⏳ 如实标注）：七步移植落位——①store（开库/迁移/幂等，移植自家族底本）②readmodels（ORDER BY rowid/in_use/分节标题/私密三出口/分类不进趋势）③demo 种子（唯一源=prototypes/v0.1/demo-data.js）④API 四路由（health/workbench/export/agent-context；交界守卫+禁裸 throw+apiBase=/api/nf/）⑤客户端 Panel（9 页 React，3D 翻转卡/Fritsch–Carlson 趋势/折叠卡/一图秀指标选择/试验匹配）⑥lib/layout.js 面板参数单一来源（customFrame=false 记录升级路径）+lib/version.js 生成。check 全绿实测：npm run check PASS（含 smoke-activate 桩件激活）、npm test 13/13、dsh-wb-cli check staticPass=true。⏳ 未实现如实：MinerU 六部件（仅设置入口占位）；customFrame 自绘会话栏（0.2 升级）；HVT X1–X4 待交互路径文档签认后复测。【V1 签认待补】
- M5-旧文案备份 ⏳：七步移植（含宿主接线件/MinerU 六部件/apiBase 契约/test 五套/check 全绿/HVT 一致性）。【V1】
- M6 ✅ 2026-10-25：0.1.1 装机（双登记+corepack pnpm）→ 真机 boot 报 ctx.config 未注入（如实留痕 LESSONS L26）→ 修复升版 0.1.2 → pack（files 补 schema/，四要素对照 tgz ✅）→ 双登记重装 → SIGTERM 旧实例后宿主换新进程（16:56:32 起）。⏳ 界面加载待用户打开窗口/新建会话确认（渲染侧日志未产出，与 head-neck 先例同口径）；真机截图刷新 README 待界面确认后执行。【V2/V3 装机层完成、界面层待确认】
- M7 ✅：tag v0.1.2 + GitHub Release（附 tgz+sha256）+ CHANGELOG 发版段。
- M8 ✅：BACKLOG 状态行回填 PR #46（pull 最新 main 后只改状态列+§0 计数）。
- M9 ✅ 2026-10-25：starter 回收 LESSONS L26/L27 + 检查器待实施⑤⑥ + templates/FLIP-METRIC-CARD.md + ZERO-TO-DEV 挂钩 + starter CHANGELOG（commit 8f23443）；starter check 通过、npm test 39/40（1 失败为既有问题，stash 验证非本次引入，已登记待实施⑥）。
- M6-旧文案备份 ⏳：升版→pack→06 号四要素对照→corepack pnpm 装→bundles 登记→重启新建会话→真机走查→README 真机截图。【V2/V3】
- M7 ⏳：tag + Release（tgz+sha256）+ CHANGELOG。
- M8 ⏳：BACKLOG 状态行回填（31 号，PR 前 pull main）。
- M9 ⏳：经验收敛回流（DEV-REQUIREMENTS 追补 / starter LESSONS / 编号文档 / 检查器待实施清单 / starter CHANGELOG）+ 回流后 start/check-starter + npm test。

## 留痕
- 2026-10-25 M0 完成；开工前一轮提问（服务主体/病程/MinerU/品牌）用户未应答，按推荐项执行（DEV-REQUIREMENTS §五）。G1 起各闸口若仍无应答，同样按推荐项继续并逐条留痕"签认待补"。

- G2 ✅ 2026-10-25：用户确认原型定稿（六轮返工后，原话见 PROTOTYPE-REVIEW 用户确认节）。

## 2026-10-26 安装位置纠错（用户反馈：安装位置错误导致 DSH 崩溃）
- 0.1.2–0.1.4 三轮装错位置：装进了 DeepSeek Harness（Agent 宿主）的 `~/.dsh-classic/profiles/desktop`（因宿主 argv 指向那里），工作台 bundle 应装 **DSH Desktop.app** 的 `~/Library/Application Support/dsh-desktop/harness/profiles/web`。
- 已纠正：classic 目录移除登记并 pnpm 清理、误建数据目录删除；0.1.4 按本地惯例（tggz 拷入 profile 目录 + file: 依赖 + bundles 登记）装入 web profile；DSH Desktop 06:04 重启无崩溃，node_modules 链接 0.1.4 就位。
- starter LESSONS 反向条目已修正（147fe6b 的错误方向 → d1c31c6）。
- 界面加载：待用户在 DSH Desktop 打开小纤宝确认（web profile 与 CML/发作性睡病/CLL 兄弟工作台同列）。

## 2026-10-26 0.1.5：重启后工作台不出现的根因与修复（用户反馈）
- 根因：dsh/index.js `openStore` 把 `mkdirSync(root, {recursive:true})` 的返回值当路径传给 `join()`——目录首次不存在时返回新建路径（首装可用），**目录已存在时返回 undefined**，于是每次重启 `nf-main` 按 ERR_INVALID_ARG_TYPE 激活失败，工作台不注册、界面不出现（harness.log 里可见 `nf-main ... TypeError`）。
- 修复：mkdir 与 path 拼接分离；开库失败降级为 503 + health 返回 degraded/storeError（禁裸 throw 契约）；新增回归测试 test/store-root.test.mjs（同一 root 连开两次）。0.1.5 已装入 web profile 并重启，本次启动段无 nf-main 错误。
- 教训（回流 starter）：① mkdirSync recursive 的返回值不可当路径；② 安装是否"生效"要看 harness.log 本次运行段里有没有 `<plugin-id>` 的错误行，"Harness is ready" 不代表每个 bundle 都激活；③ verify-desktop-load 的"宿主已加载"判据（数据目录/清单）与"界面能看到"是两回事。

## 2026-10-26 工作台仍不出现的第二层原因：Desktop 自动禁用
- 06:35 那次激活崩溃后，DSH Desktop **自动在 profile `cordis.patch.yml` 写入 `- id: nf-main / disabled: true`**（并留 `cordis.patch.yml.pre-disable-nf-main-20261026-0635` 备份；package.json 同步留 `.pre-neurofib-workbench-disable-20261026-0635`）。此后纵使代码修好，条目仍被禁用→列表不出现；host 启动段也因此"干净无错"（根本没加载）。
- 处置：删除禁用行（先备份 `cordis.patch.yml.bak-nf-reenable-*`），确认 YAML 7 条无 nf-main，重启 DSH Desktop——12:34 启动段无 nf-main 错误、未再次出现 disable 备份。
- 判据升级（回流）：查"工作台不出现"要按顺序 ①profile patch 有无 `- id: <plugin> disabled: true` ②本次运行段有无 `<plugin-id>` error ③node_modules 版本与 bundles 登记 ④人眼。

## 2026-10-26 0.1.6：dsh-desktop fatal load failure 的真凶（ctx.effect 语义）
- 日志证据（12:33:48 段）：`unhandled rejection: Error: database is not open` → `dsh: fatal load failure: Error: database is not open` → 应用进入 `plugin recovery detection: unresolved` 并自动写 `- id: nf-main / disabled: true`（第二次）。
- 根因：cordis 的 `ctx.effect(fn)` **立即执行 fn**，把 fn 的返回值当 disposer。我写成 `ctx.effect(() => { close(db) })` → apply 阶段就把库关了；随后任何查询抛 "database is not open"，异步 handler 的 rejection 未被 guard 收口 → 逃逸为 unhandled rejection → DSH 判 fatal。
- 修复（0.1.6）：`ctx.effect(() => () => { try { close(db) } catch {} })`；guard 对返回 Promise 的 handler 追加 `.catch(fail)`；新增 test/effect-and-guard.test.mjs（16/16 绿）。
- 验证：12:39 重启段 0 关键错误，无 "database is not open"、无新禁用备份；patch 无 nf-main 条目。
