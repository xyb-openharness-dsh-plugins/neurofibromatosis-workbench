# DEV-REQUIREMENTS · 小纤宝 FibroPal 神经纤维瘤病工作台

## §一 身份与目录
- 仓库：xyb-openharness-dsh-plugins/neurofibromatosis-workbench（私有）；认领 issue [.github#41](https://github.com/xyb-openharness-dsh-plugins/.github/issues/41)，开发者 samqin123，2026-10-25 claimed。
- 项目目录：~/Downloads/neurofibromatosis-workbench；资料目录待用户明确指定（主目录/桌面/下载根/tmp 一律拒绝）。
- 移植底本：cervical-workbench（client 链路底本）；成熟对比基准：breast-cancer-workbench（26 号口径）。

## §二 工程基线
- 脚手架 xyb-workbench-starter，dsh-wb-cli 1.5.7；VERSION 0.1.0；M0 基线 `dsh-wb-cli check` staticPass=true（2026-10-25 实测）。
- GitHub 访问代理 http://127.0.0.1:7890；unified-trial-mcp CLI 位于 ~/Downloads/unified_search_trials（M4 用）。
- 模型路由：主线 GLM-5.3；批量检索/清洗可路由 GLM-5.3-Flash；质量闸口不降级。

## §三 病种口径（M1 定版，当前占位）
- 范围：NF1 / NF2 相关施万细胞瘤病 / 施万细胞瘤病三型。
- 中文规范：罕见病诊疗指南（2019 版）NF 条目；2025 版 86 罕见病指南收录情况 ⏳ M1 核实。
- 国际参照：NF1 管理共识、EANO NF2 指南（2021）版本号 ⏳ M1 核实。

## §四 硬红线（继承 + 本病种）
- 判读词黑名单在通用基础上，本病种追加：恶变/癌变风险提示类文案、遗传概率建议类文案（"再要孩子没问题"类）一律禁止；仅允许静态来源引用。
- 无 diagnosis/risk_level 类判定列；private 三出口代码级过滤；演示唯一源。

## §五 可回退默认值（开工前一轮提问未获应答，2026-10-25 按推荐项执行，用户可随时推翻）
1. 服务主体：患者本人 + 家属双主体（NF1 患儿家长代记为主，成年/NF2 自助为辅）。
2. 病程覆盖：确诊后长期随访全程（含分龄日历）；疑诊期信息支持为次级。
3. MinerU：启用（医学指南 PDF 走 MinerU 入库，见 18 号）。
4. 品牌占位名：小纤宝 FibroPal（占位可换，V1 前定名）。

## §六 用户补充要求（2026-10-25 任务下发，登记为提高要求）
1. 指标卡片页：围绕疾病相关指标系列构建，有序、分系列、动态 3D 翻转展现内容 + 趋势折线；按脚手架要求提高标准执行（23/24/27 号）。
2. 一图秀：增加指标选择窗口（16 号基础上扩展）。
3. 临床试验：NF 有临床研究需求（MEK 抑制剂/基因靶向方向）。链路按：个人基因/病理（NF1 为临床诊断+基因检测记录，非 IHC 为主）维护建档 → 搜索或 AI 协助匹配 → 查询自带 sqlite db + 外部工具技能 → 匹配结果（匹配指数 + 统一格式）。展现参考 biliary-tract 原型临床匹配图（用户指定参考：prototypes/v0.2/index.html）。

## §七 闸口签认状态
- G1/G2/G3/V1/V2/V3：均未签；若用户未应答，按可回退推荐项继续并在 DEV-PLAN 留痕"签认待补"。
