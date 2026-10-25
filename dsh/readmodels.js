/**
 * NF 读模型：一条 /api/nf/workbench 用的聚合查询。
 *
 * 家族红线在查询层的落点：
 * - ORDER BY rowid（插入序即时间序，不用无序列做"最新值"）；
 * - in_use = 1 过滤（显式停用不出现）；
 * - section_titles 分组，无行的节返回 null（前端整节不渲染，不写空标题）；
 * - 私密三出口：family_members 默认过滤 is_private=1，仅 geneticsOpen=1 时携带——
 *   渲染（本读模型）、导出（routes /export）、AI 上下文（routes /agent-context）共用
 *   同一个 filterPrivate，三出口代码级一致；
 * - 分类不进趋势：series 只收 kind='numeric' 的 metric_points.value_num。
 */
export function readWorkbench(db, { profileKey = 'demo', geneticsOpen = false } = {}) {
  const subject = db.prepare('SELECT * FROM subjects WHERE profile_key = ?').get(profileKey) ?? null;

  const sections = Object.fromEntries(
    db.prepare('SELECT key, title, ord FROM section_titles WHERE profile_key = ? AND in_use = 1 ORDER BY ord').all(profileKey)
      .map((r) => [r.key, r.title]),
  );

  const systems = db.prepare('SELECT system, department, source_title, source_version FROM subtype_systems WHERE profile_key = ? ORDER BY rowid').all(profileKey);

  const metrics = db.prepare(`SELECT key, group_title, name, unit, kind, band_low, band_high, source_title, source_version
    FROM metrics WHERE in_use = 1 ORDER BY rowid`).all()
    .map((m) => {
      const points = m.kind === 'numeric'
        ? db.prepare('SELECT taken_at, value_num FROM metric_points WHERE metric_key = ? ORDER BY rowid').all(m.key)
        : [];
      return { ...m, points };
    });

  const tumors = db.prepare('SELECT tumor_no, site, method FROM tumors WHERE in_use = 1 ORDER BY rowid').all()
    .map((t) => ({
      ...t,
      points: db.prepare('SELECT taken_at, value_num FROM metric_points WHERE tumor_no = ? AND value_num IS NOT NULL ORDER BY rowid').all(t.tumor_no),
    }));

  const ageBands = ['child', 'teen', 'adult'].map((band) => ({
    band,
    title: sections[`calendar_${band}`] ?? null,
    items: db.prepare('SELECT item_name, freq_text, source_title, source_version, last_done_at FROM followup_items WHERE profile_key = ? AND age_band = ? ORDER BY rowid').all(profileKey, band),
  }));

  const treatmentLines = db.prepare('SELECT id, line_title, status_text, started_at FROM treatment_lines WHERE profile_key = ? AND in_use = 1 ORDER BY ord, rowid').all(profileKey)
    .map((l) => ({
      ...l,
      sideEffects: db.prepare('SELECT what, onset_date, eased_date FROM side_effect_rows WHERE line_id = ? ORDER BY rowid').all(l.id),
    }));

  // 私密出口 1/3：渲染
  const filterPrivate = geneticsOpen
    ? 'SELECT id, rel, note FROM family_members WHERE profile_key = ? AND is_private = 1'
    : null;
  const familyMembers = filterPrivate ? db.prepare(filterPrivate).all(profileKey) : null;

  const geneticsQuestions = db.prepare('SELECT question, source_title, source_version FROM genetics_questions WHERE profile_key = ? AND in_use = 1 ORDER BY rowid').all(profileKey);

  const reviewNotes = db.prepare('SELECT kind, note FROM review_notes WHERE profile_key = ? ORDER BY ord, rowid').all(profileKey);

  const trials = db.prepare('SELECT t.nct_id, t.title, t.phase, t.status_text, t.source_url, t.kind, t.registered, t.flag, m.cond_text, m.cond_state FROM trial_matches m JOIN trials t ON t.id = m.trial_id WHERE m.profile_key = ? ORDER BY m.rowid').all(profileKey)
    .reduce((acc, r) => {
      const found = acc.find((x) => x.nctId === r.nct_id);
      const cond = { text: r.cond_text, state: r.cond_state };
      if (found) found.conditions.push(cond);
      else acc.push({ nctId: r.nct_id, title: r.title, phase: r.phase, status: r.status_text, sourceUrl: r.source_url, kind: r.kind, registered: r.registered, flag: r.flag, conditions: [cond] });
      return acc;
    }, []);

  return {
    subject, sections, systems, metrics, tumors, ageBands, treatmentLines,
    familyMembers, geneticsQuestions, reviewNotes, trials,
    geneticsOpen,
  };
}

/** 演示档案默认 geneticsOpen=false（subjects.genetics_open 记录本人显式开放）。 */
export function readExport(db, opts) {
  const wb = readWorkbench(db, opts);
  const lines = [];
  lines.push('【小纤宝 · 复诊准备】');
  for (const n of wb.reviewNotes) lines.push(`- ${n.note}`);
  lines.push(wb.familyMembers
    ? `- 家系：${wb.familyMembers.map((m) => m.rel).join('、')}`
    : '- 家系：私密区未展开，未携带'); // 私密出口 2/3：导出
  lines.push('（信息整理与就诊准备工具，不提供诊断与治疗建议）');
  return lines.join('\n');
}

/** 私密出口 3/3：AI 草稿上下文（agent-draft 携带）。 */
export function agentContext(db, opts) {
  const wb = readWorkbench(db, opts);
  return {
    分型: wb.subject?.nf_type ?? null,
    瘤体: wb.tumors.map((t) => `${t.tumor_no} ${t.site} 最近 ${t.points.at(-1)?.value_num ?? '—'}mm`),
    随访: wb.ageBands[0]?.items.filter((i) => !i.last_done_at).map((i) => i.item_name) ?? [],
    家系: wb.familyMembers ? wb.familyMembers.map((m) => m.rel) : '（私密区未展开，未携带）',
  };
}
