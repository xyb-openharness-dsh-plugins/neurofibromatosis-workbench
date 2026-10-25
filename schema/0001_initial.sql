/* 神经纤维瘤病工作台（小纤宝 FibroPal）· 初始数据模型（0001）
 *
 * 家族契约（同源，改这里等于改契约）：
 *   1. 看法恒不为结论：只存记录，不设任何 diagnosis / risk_level 类判定列（check 脚本断言）；
 *   2. 更正只新增版本，不覆盖（measurement/symptom 等按追加行记录，旧值不删）；
 *   3. 事实四层不合并：documents / candidate_fields / *_rows / metric_points 分表；
 *   4. 分节标题进 section_titles 表（家族教训：平铺 *_title 列返工最贵）；
 *   5. "当前在用"语义列一律叫 in_use（using 是 SQLite 保留字）。
 *
 * NF 独有口径（写在这里，读模型与前端都按这个来）：
 *   A. **无分期系统**：不建 stage_rows；病种分型存 subjects.nf_type 原文（NF1 / NF2-related schwannomatosis /
 *      schwannomatosis），受累系统存 subtype_systems 行表，均为就诊记录口径，不自算。
 *   B. **瘤体以编号为聚合键**：tumors(tumor_no) + tumor_measurements 只存测量值与测量方式，
 *      不设生长速度/倍增时间/良恶性倾向列；趋势按 tumor_no 分曲线，仅数值。
 *   C. **分龄随访日历**：followup_items(age_band ∈ child/teen/adult) 每行带 source_title + source_version
 *      语境栏；「待预约」是日历状态，不是就医建议。
 *   D. **家系成员默认私密**：family_members.is_private 缺省 1；读模型默认过滤，导出与 Agent 上下文同口径
 *      （私密三出口）。遗传只存问题清单与记录，不存概率结论列。
 *   E. **听力数值进趋势、耳鸣分类不进**：hearing_rows.pta_db 为数值（WHO WRH 2021 口径语境栏），
 *      tinnitus 等症状走 symptom_rows(kind='qual')，kind ∈ {grade,qual} 的指标不进趋势图。
 *   F. **副作用双日期**：side_effect_rows.onset_date / eased_date 只是事件日期；eased 不是疗效判断。
 */

/* ---------- 档案级 ---------- */

CREATE TABLE subjects (
  profile_key   TEXT PRIMARY KEY,
  name          TEXT,
  meta          TEXT,            -- 侧栏第二行（年龄 · 分型 · 代记主体）
  nf_type       TEXT,            -- NF1 / NF2-related schwannomatosis / schwannomatosis（就诊记录原文）
  recorder      TEXT,            -- 代记主体（本人 / 家长等，就诊记录口径）
  headline      TEXT,
  dash_keys     TEXT,            -- JSON 数组：看板指标卡顺序
  genetics_open INTEGER DEFAULT 0 -- 家系私密区是否经本人显式开放（0=默认过滤）
);

CREATE TABLE section_titles (
  profile_key TEXT,
  key         TEXT,
  title       TEXT,
  ord         INTEGER,
  in_use      INTEGER DEFAULT 1, -- 显式标记，不用 0/NULL 混写
  PRIMARY KEY (profile_key, key)
);

CREATE TABLE subtype_systems (     -- 受累系统清单（口径 A）
  profile_key TEXT,
  ord         INTEGER,
  system      TEXT,               -- 如 皮肤（咖啡牛奶斑）
  department  TEXT,               -- 常见就诊/转介科室（静态信息）
  source_title TEXT,
  source_version TEXT
);

/* ---------- 指标（分类不进趋势：kind ∈ {grade,qual} 的不进折线） ---------- */

CREATE TABLE metrics (
  key          TEXT PRIMARY KEY,
  group_title  TEXT NOT NULL,     -- 分系列（疼痛系列 / 生命体征系列 / 生长系列 / 瘤体测量系列 / 听力系列）
  name         TEXT NOT NULL,
  unit         TEXT,              -- 显式 NULL 表示无量纲
  kind         TEXT NOT NULL,     -- numeric / grade / qual
  band_low     REAL,              -- 参考带（都没有则 NULL ≠ 0）
  band_high    REAL,
  source_title TEXT,
  source_version TEXT,
  in_use       INTEGER DEFAULT 1
);

CREATE TABLE metric_points (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,  -- 读模型 ORDER BY rowid 同义，插入序即时间序
  profile_key  TEXT,
  metric_key   TEXT,
  taken_at     TEXT,              -- ISO 日期
  value_num    REAL,              -- 数值（kind=numeric 必填）
  value_text   TEXT,              -- 分类/等值原文（kind ∈ {grade,qual} 用，不进趋势）
  tumor_no     TEXT,              -- 瘤体测量系列指向 tumors.tumor_no，其余 NULL
  note         TEXT
);

/* ---------- 瘤体档案（口径 B） ---------- */

CREATE TABLE tumors (
  tumor_no     TEXT PRIMARY KEY,  -- 编号为聚合键（T-01…），趋势按编号分曲线
  profile_key  TEXT,
  site         TEXT,
  method       TEXT,              -- MRI 测量 / 体表测量（软尺）
  in_use       INTEGER DEFAULT 1
);

/* ---------- 分龄随访日历（口径 C） ---------- */

CREATE TABLE followup_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  age_band     TEXT NOT NULL,     -- child / teen / adult
  item_name    TEXT NOT NULL,
  freq_text    TEXT,              -- 频率口径原文（指南名称级）
  source_title TEXT NOT NULL,
  source_version TEXT,            -- 未核实行为 NULL，UI 显示「未核实」
  last_done_at TEXT               -- 显式 NULL = 未记录
);

/* ---------- 治疗线 / 副作用（口径 F） ---------- */

CREATE TABLE treatment_lines (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  line_title   TEXT,              -- 观察随访线 / 司美替尼治疗线…
  status_text  TEXT,              -- 记录口径原文
  started_at   TEXT,
  ord          INTEGER,
  in_use       INTEGER DEFAULT 1
);

CREATE TABLE side_effect_rows (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  line_id      INTEGER,
  what         TEXT,
  onset_date   TEXT,
  eased_date   TEXT               -- 事件日期，不是疗效判断
);

/* ---------- 症状（疼痛 NRS 为 numeric 指标；耳鸣等分类走这里） ---------- */

CREATE TABLE symptom_rows (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  kind         TEXT NOT NULL,     -- qual（分类，不进趋势）
  name         TEXT,              -- 耳鸣 / 新发结节关注项…
  value_text   TEXT,
  taken_at     TEXT,
  note         TEXT
);

/* ---------- 听力（口径 E） ---------- */

CREATE TABLE hearing_rows (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  ear          TEXT,              -- 左 / 右 / 双
  pta_db       REAL,              -- 0.5/1/2/4 kHz PTA（数值进趋势）
  taken_at     TEXT,
  source_title TEXT DEFAULT 'WHO World Report on Hearing (2021)',
  note         TEXT
);

/* ---------- 遗传家系（口径 D：默认私密，三出口过滤） ---------- */

CREATE TABLE family_members (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  rel          TEXT,
  note         TEXT,              -- 记录口径，无风险结论列
  is_private   INTEGER DEFAULT 1
);

CREATE TABLE genetics_questions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  question     TEXT,              -- 信息性问题（就诊沟通用），无概率结论
  source_title TEXT,
  source_version TEXT,            -- 未核实行为 NULL
  in_use       INTEGER DEFAULT 1
);

/* ---------- 复诊准备 ---------- */

CREATE TABLE review_notes (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  kind         TEXT,              -- change / question / material
  note         TEXT,
  ord          INTEGER
);

/* ---------- 事实四层：文档 / 候选 / 试验 ---------- */

CREATE TABLE documents (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  file_name    TEXT,
  doc_type     TEXT,
  imported_at  TEXT
);

CREATE TABLE candidate_fields (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  document_id  INTEGER,
  field_key    TEXT,
  value_text   TEXT,
  reviewed     INTEGER DEFAULT 0  -- 未核对候选不入档
);

CREATE TABLE trials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  nct_id       TEXT,
  title        TEXT,
  phase        TEXT,
  status_text  TEXT,
  fetched_at   TEXT
);

CREATE TABLE trial_matches (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  trial_id     INTEGER,
  cond_text    TEXT,
  cond_state   TEXT               -- hit / miss / unknown（unknown=档案未记录，如实显示）
);

CREATE TABLE events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key  TEXT,
  happened_at  TEXT,
  title        TEXT,
  detail       TEXT
);

CREATE TABLE demo_meta (
  key   TEXT PRIMARY KEY,
  value TEXT
);
