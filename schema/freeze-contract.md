# 迁移冻结合同（小纤宝 FibroPal）

`schema/` 下的迁移一旦对外发布就不许再改：改历史迁移 = 两台机器的库结构不一样 = 数据不可复现。
本文件记每个迁移文件的 sha256；改旧文件会被检查拦下。要改结构：**新增** `NNNN_name.sql`，并把新文件与哈希追加到表末。

| 文件 | sha256 |
| --- | --- |
| `0001_initial.sql` | 841eeb5fd3e4a4ed28454649f368dc506e92839b1801a82333b01158f4d16893 |
| `0002_trial_meta.sql` | d9f226eed32bc1d206755a46b276ab17348ff7eb4d00a0cb3f9511ab279d2b2e |
| `0002_trial_meta.sql` | d9f226eed32bc1d206755a46b276ab17348ff7eb4d00a0cb3f9511ab279d2b2e |

## 0001 的内容边界（写在冻结之前，便于日后审）

18 张表（0002 为 trials 追加 4 元数据列：source_url/kind/registered/flag，见下表），分四组：

- **档案级 4 张**：`subjects`（nf_type/recorder/genetics_open 口径见文件头 A/D）、`section_titles`（分节标题表化，加节=加行）、`subtype_systems`（受累系统+科室，静态信息）、`demo_meta`。
- **指标 2 张**：`metrics`（group_title 分系列；kind numeric/grade/qual；band_low/band_high 显式 NULL）、`metric_points`（ORDER BY rowid 即时间序；value_text 分类值不进趋势）。
- **NF 专属 10 张**：`tumors`（编号聚合键）+ `followup_items`（age_band 分龄日历，逐行 source 语境）+ `treatment_lines` + `side_effect_rows`（双日期）+ `symptom_rows`（qual）+ `hearing_rows`（pta_db 数值进趋势）+ `family_members`（is_private 缺省 1，三出口过滤）+ `genetics_questions`（信息性问题）+ `review_notes` + `events`。
- **事实四层 2 张**：`documents` / `candidate_fields`（未核对候选 reviewed=0 不入档）+ 试验侧 `trials` / `trial_matches`（cond_state ∈ hit/miss/unknown，unknown 如实=档案未记录）。

## NF 六条独有口径（全文见 0001 文件头 A–F）

A 无分期系统（nf_type 原文，不自算）；B 瘤体编号聚合、只存测量值；C 分龄日历逐行带来源版本、未核实显式 NULL；D 家系默认私密、遗传无概率结论列；E 听力数值进趋势/耳鸣分类不进；F 副作用 eased_date 是事件日期不是疗效判断。

## 红线断言

`test/no-verdict-columns.test.mjs` 扫描全部迁移列名：diagnosis / risk_level / 恶变风险 / prognosis / 复发风险类列 **0 允许**（2026-10-25 实测 pass 1 / fail 0）。
