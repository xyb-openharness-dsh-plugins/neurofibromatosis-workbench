# CLINICAL-DATA · 小纤宝 FibroPal 临床参考数据包

> 状态：M0 占位。M1 医学调研（10 主题指南 PDF 核数）后逐表定版；未核实项标「未核实」。不复制指南临床内容，只登记来源与版本号作范围参照。

## 参考数据表（M1 核数后定版，2026-10-25）
| 表 | 内容 | 来源 | 状态 |
| --- | --- | --- | --- |
| nf_subtypes | NF1 / NF2 相关施万细胞瘤病 / 施万细胞瘤病 三型定义（名称级） | 神经纤维瘤病诊疗指南（2025 年版，NHC 发布） | ✅ 版本已核（SOURCES N01） |
| followup_calendar_age_band | 分年龄段随访项目：儿童视力监测（至 8 岁，指南 2025 版口径）、每年血压/身高/皮肤与神经系统查体（协和 2023 版）、OPG 后年度 MRI 等 | 2025 版指南 + Ⅰ型 NF1 多学科诊治指南（2023 版）+ 儿童青少年 NF 诊疗规范（2021 版） | ✅ 版本已核；分龄表逐项语境栏 M2 落格 |
| metric_reference_ranges | 血压（儿童百分位）、身高体重百分位、纯音听阈分级（WHO 2021）、NRS | WHO WRH 2021 ✅；NRS ⏳ 未核实（标"通用量表"） | 部分 |
| therapy_glossary | 手术 / 司美替尼（NMPA 2023-05 获批，3 岁+症状性无法手术 PN-NF1）/ 国产 MEK（芦沃美替尼，申报中） | NMPA/阿斯利康公告 | ✅ 名称级已核 |
| genetics_qa | 遗传咨询常见问题清单（信息性，无概率建议） | 2025 版指南遗传部分 + 泡泡家园调研报告线索 | ⏳ 逐条核对 M2 |
| clinic_departments | 受累系统 → 常见就诊/转介科室（静态信息） | 2023 协和多学科指南（多学科口径） | ⏳ 落格核对 M2 |

## 红线
- 全部表不包含 diagnosis / risk_level / 恶变风险 / 遗传概率建议字段；
- 每行携带 source + version + verified_at 语境栏；未核实行 verified_at 为显式 null 并在 UI 显示「未核实」。

## 数据获取
- MinerU 解析指南 PDF（18 号六部件）；fetch-nf-trials 拉临床试验库（M4）。

## 临床试验库（M4 · 2026-10-25 实采）
- 四件套：scripts/fetch-nf-trials-2026.mjs + research/neurofibromatosis/{trials-2026.jsonl, nf_trials_2026.sqlite, manifest.json}。
- 实采结果：**364 条**（chinadrugtrials 17 + ictrp 347；合并前 364，登记号无跨源重复）；一致性断言 manifest=jsonl=sqlite=364 通过（脚本内置，不符退出码 1）。
- 通道终态如实：chinadrugtrials/ictrp SUCCESS；xyb_chinadrugtrials_archive / chictr_pancreatic_archive / ctv = NEEDS_SETUP、chictr_online = NOT_ENABLED、ictrp 中文词 FAILED（英文词 SUCCESS）——这些通道对 NF **未查过**，不冒充已查。
- 状态一律「登记状态，未核实」；登记 ≠ 有效 ≠ 安全 ≠ 可入组。
