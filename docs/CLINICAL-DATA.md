# CLINICAL-DATA · 小纤宝 FibroPal 临床参考数据包

> 状态：M0 占位。M1 医学调研（10 主题指南 PDF 核数）后逐表定版；未核实项标「未核实」。不复制指南临床内容，只登记来源与版本号作范围参照。

## 参考数据表（初始清单，M1 可增删）
| 表 | 内容 | 来源（占位） | 状态 |
| --- | --- | --- | --- |
| nf_subtypes | NF1 / NF2 相关施万细胞瘤病 / 施万细胞瘤病 三型定义（名称级） | 罕见病诊疗指南 2019 版 NF 条目 | ⏳ 待核版本 |
| followup_calendar_age_band | 分年龄段随访项目（儿童/青春期/成年） | NF1 管理共识（版本待核） | ⏳ |
| metric_reference_ranges | 血压（儿童百分位）、身高体重百分位、NRS 口径、纯音听阈分级口径 | 各专科指南，M1 定 | ⏳ |
| therapy_glossary | 手术 / MEK 抑制剂（司美替尼等）/ 其他在研方向名词表 | 药品说明书 + 共识（名称级） | ⏳ |
| genetics_qa | 遗传咨询常见问题清单（信息性，无概率建议） | 遗传咨询指南（版本待核） | ⏳ |
| clinic_departments | 受累系统 → 常见就诊/转介科室（静态信息） | M1 调研定 | ⏳ |

## 红线
- 全部表不包含 diagnosis / risk_level / 恶变风险 / 遗传概率建议字段；
- 每行携带 source + version + verified_at 语境栏；未核实行 verified_at 为显式 null 并在 UI 显示「未核实」。

## 数据获取
- MinerU 解析指南 PDF（18 号六部件）；fetch-nf-trials 拉临床试验库（M4）。
