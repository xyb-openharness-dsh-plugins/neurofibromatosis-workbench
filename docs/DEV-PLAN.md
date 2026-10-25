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
