/**
 * 演示数据种子：唯一源是 prototypes/v0.1/demo-data.js（原型与开发版共用一份，
 * 改演示数据只改那一个文件，这里只做搬运，不另设副本）。
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export function loadDemoData() {
  const src = readFileSync(fileURLToPath(new URL('../prototypes/v0.1/demo-data.js', import.meta.url)), 'utf8')
  const fn = new Function('window', `${src}; return window.NF_DEMO;`)
  return fn({ NF_DEMO: undefined })
}

export function seedDemo(db) {
  const d = loadDemoData()
  const pk = 'demo'
  db.prepare(`INSERT OR REPLACE INTO subjects (profile_key, name, meta, nf_type, recorder, headline, genetics_open)
    VALUES (?,?,?,?,?,?,0)`).run(pk, d.profile.name, d.profile.meta, d.subtype.type, '妈妈（代记）', null)

  const ins = (sql, ...args) => db.prepare(sql).run(...args)
  ins(`INSERT OR REPLACE INTO section_titles (profile_key, key, title, ord, in_use) VALUES (?,?,?,?,1)`, pk, 'calendar_child', d.ageBands[0].title, 1)
  ins(`INSERT OR REPLACE INTO section_titles (profile_key, key, title, ord, in_use) VALUES (?,?,?,?,1)`, pk, 'calendar_teen', d.ageBands[1].title, 2)
  ins(`INSERT OR REPLACE INTO section_titles (profile_key, key, title, ord, in_use) VALUES (?,?,?,?,1)`, pk, 'calendar_adult', d.ageBands[2].title, 3)

  for (const s of d.subtype.systems) ins(`INSERT INTO subtype_systems (profile_key, ord, system, department, source_title, source_version) VALUES (?,?,?,?,?,?)`, pk, 0, s, d.subtype.departments.join('/'), '神经纤维瘤病诊疗指南（2025 年版）', '2025')

  for (const b of d.ageBands) for (const it of b.items) {
    ins(`INSERT INTO followup_items (profile_key, age_band, item_name, freq_text, source_title, source_version, last_done_at) VALUES (?,?,?,?,?,?,?)`,
      pk, b.id, it.name, it.freq, it.source, it.source.includes('未核实') ? null : '2025', it.done ?? null)
  }

  for (const m of d.metricSeries) {
    const unit = m.unit
    ins(`INSERT INTO metrics (key, group_title, name, unit, kind, band_low, band_high, source_title, source_version, in_use)
      VALUES (?,?,?,?,?,NULL,NULL,?,?,1)`, m.id, m.group, m.name, unit, 'numeric', m.source, '2025')
    const t = m.id && m.id.startsWith('tumor-') ? d.tumors.find(x => x.id.toUpperCase() === ('T-' + m.id.slice(6))) : null; const series = m.series ?? (t ? t.series : [])
    for (const [y, mo, v] of series) {
      ins(`INSERT INTO metric_points (profile_key, metric_key, taken_at, value_num, value_text, tumor_no, note) VALUES (?,?,?,?,NULL,?,NULL)`,
        pk, m.id, `${y}-${String(mo).padStart(2, '0')}-15`, v, m.id.startsWith('tumor') ? m.id.replace('tumor-', '') : null)
    }
  }

  for (const t of d.tumors) {
    ins(`INSERT INTO tumors (tumor_no, profile_key, site, method, in_use) VALUES (?,?,?,?,1)`, t.id, pk, t.site, t.method)
  }

  for (const tl of d.treatmentLines) {
    const r = ins(`INSERT INTO treatment_lines (profile_key, line_title, status_text, started_at, ord, in_use) VALUES (?,?,?,?,?,1)`,
      pk, tl.title, tl.rows[0][1], tl.rows.find((x) => x[0] === '开始')?.[1] ?? null, 0)
    for (const se of d.sideEffects.filter((e) => e.line.includes('观察'))) {
      ins(`INSERT INTO side_effect_rows (profile_key, line_id, what, onset_date, eased_date) VALUES (?,?,?,?,?)`, pk, Number(r.lastInsertRowid), se.what, se.onset, se.eased)
    }
  }

  for (const m of d.genetics.members) ins(`INSERT INTO family_members (profile_key, rel, note, is_private) VALUES (?,?,?,1)`, pk, m.rel, m.note)
  for (const q of d.genetics.questions) ins(`INSERT INTO genetics_questions (profile_key, question, source_title, source_version, in_use) VALUES (?,?,?,?,1)`, pk, q, d.genetics.qaSource.slice(0, 60), null)

  for (const [i, n] of d.reviewNotes.entries()) ins(`INSERT INTO review_notes (profile_key, kind, note, ord) VALUES (?,?,?,?)`, pk, 'change', n, i)

  // 临床研究演示条目（trial_matches：cond_state hit/miss/unknown 如实记录）
  for (const t of d.trials) {
    const r = ins(`INSERT INTO trials (nct_id, title, phase, status_text, fetched_at) VALUES (?,?,?,?,?)`, t.reg ?? t.nct, t.title, t.phase, t.status ?? '登记状态，未核实', '2026-10-25')
    for (const [cond, val, st] of t.matchDetail) {
      ins(`INSERT INTO trial_matches (profile_key, trial_id, cond_text, cond_state) VALUES (?,?,?,?)`, pk, Number(r.lastInsertRowid), `${cond}：${val}`, st === true ? 'hit' : st === false ? 'miss' : 'unknown')
    }
  }
  return d
}
