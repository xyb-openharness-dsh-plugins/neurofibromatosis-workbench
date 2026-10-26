/* 小纤宝 FibroPal v0.1 · 原型逻辑（demo-data.js 为唯一数据源） */
'use strict';
const D = window.NF_DEMO;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const PAGES = [
  ['dashboard', '看板'], ['records', '病情整理'], ['subtype', '病种档案'],
  ['calendar', '随访日历'], ['tumors', '瘤体与指标'], ['treatment', '治疗线'],
  ['genetics', '遗传家系'], ['review', '复诊准备'], ['onechart', '一图秀'], ['trials', '临床研究']
];
const SUBTITLES = {
  dashboard: '今天的口径：年龄段的下一件事 + 最近变化', records: '资料库 / 整理草稿 / 病情档案（演示）',
  subtype: '分型与受累系统 · 来源语境', calendar: '按年龄段分节 · 每项带来源', tumors: '瘤体档案 + 指标系列（3D 翻转卡 + 趋势）',
  treatment: '治疗线折叠卡 · 副作用时间线', genetics: '家系成员（私密）· 遗传咨询问题清单',
  review: '间隔期变化 + 要问的问题', onechart: '选指标 · 一张图看趋势', trials: '建档 → 匹配 → 结果（匹配指数）'
};

const state = { view: 'dashboard', flipped: {}, fold: { ageBands: ['child'], lines: ['TL-1'] }, chartSel: ['pain', 'tumor-t01'], range: 'all', toggles: { treatment: true, keypoints: true, changes: true }, pin: null, bigfont: false, privateOpen: false };
const fmtV = (v) => (Number.isInteger(v) ? v : +v.toFixed(1));
const METRIC_COLOR = (m) => m.color || '#2f6f8f';
const toPts = (arr) => (arr || []).map(([y, mo, v]) => ({ d: y + '-' + String(mo).padStart(2, '0') + '-15', v }));
const longDate = (d) => { const [y, m] = d.split('-'); return y + '.' + Number(m); };

/* ---- 私密三出口：渲染 / 导出（复诊成稿）/ Agent 草稿，统一走同一过滤 ---- */
function privateData() { return state.privateOpen ? D.genetics.members : null; }
function agentContext() {
  const pub = { 分型: D.subtype.type, 瘤体: D.tumors.map(t => `${t.id} ${t.site} 最近 ${t.series.at(-1)[2]}mm`), 随访: D.ageBands[0].items.filter(i => i.todo || !i.done).map(i => i.name) };
  const priv = privateData() ? { 家系: D.genetics.members.map(m => m.rel) } : { 家系: '（私密区未展开，未携带）' };
  return { ...pub, ...priv };
}

/* ---- Fritsch–Carlson 单调保形插值 ---- */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M ${pts.map(p => p.join(' ')).join(' L ')}`;
  const dx = [], dy = [], m = [], n = pts.length;
  for (let i = 0; i < n - 1; i++) { dx.push(pts[i+1][0] - pts[i][0]); dy.push(pts[i+1][1] - pts[i][1]); }
  m[0] = dy[0] / dx[0]; m[n-1] = dy[n-2] / dx[n-2];
  for (let i = 1; i < n - 1; i++) {
    if (dx[i-1] === 0 || dx[i] === 0 || dy[i-1] / dx[i-1] * dy[i] / dx[i] <= 0) m[i] = 0;
    else m[i] = (dy[i-1] / dx[i-1] + dy[i] / dx[i]) / 2;
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] * 2;
    d += ` C ${pts[i][0] + h/3} ${pts[i][1] + m[i]*h/3}, ${pts[i+1][0] - h/3} ${pts[i+1][1] - m[i+1]*h/3}, ${pts[i+1][0]} ${pts[i+1][1]}`;
  }
  return d;
}
function chartSVG(seriesList, h = 190) {
  const w = 560, pad = { l: 42, r: 14, t: 14, b: 26 };
  const all = seriesList.flatMap(s => s.data);
  if (!all.length) return `<p class="ctx">该系列暂无记录（如实显示为空，不外推）。</p>`;
  const ys = all.map(p => p[2]), xs = all.map(p => p[0] + (p[1] - 1) / 12);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const X = v => pad.l + (xmax === xmin ? 0 : (v - xmin) / (xmax - xmin)) * (w - pad.l - pad.r);
  const Y = v => h - pad.b - (ymax === ymin ? 0.5 : (v - ymin) / (ymax - ymin)) * (h - pad.t - pad.b);
  const colors = ['#2f6f8f', '#2f7d63', '#a4561f', '#7a5aa8'];
  let g = '';
  for (let i = 0; i <= 4; i++) { const y = pad.t + i * (h - pad.t - pad.b) / 4; const val = (ymax - i * (ymax - ymin) / 4).toFixed(ymax - ymin > 20 ? 0 : 1); g += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="var(--line)"/><text x="4" y="${y + 4}">${val}</text>`; }
  const curves = seriesList.map((s, si) => {
    const pts = s.data.map(p => [X(p[0] + (p[1] - 1) / 12), Y(p[2])]);
    return `<path class="curve" d="${smoothPath(pts)}" stroke="${colors[si % 4]}"/>` + pts.map((p, pi) => `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="3" fill="${colors[si % 4]}"><title>${esc(s.name)} ${s.data[pi][0]}-${s.data[pi][1]}：${s.data[pi][2]}</title></circle>`).join('');
  }).join('');
  const legend = seriesList.map((s, si) => `<text x="${pad.l + si * 130}" y="${h - 6}" fill="${colors[si % 4]}">${esc(s.name.length > 14 ? s.name.slice(0, 13) + '…' : s.name)}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="趋势折线图">${g}${curves}${legend}</svg>`;
}
function metricData(m) { if (m.series) return m.series; if (m.id && m.id.startsWith('tumor-')) { const t = D.tumors.find(x => x.id.toLowerCase() === m.id.replace('tumor-', 't-')); return t ? t.series : []; } return []; }
function sparkline(data) {
  if (data.length < 2) return '';
  const ys = data.map(p => p[2]); const min = Math.min(...ys), max = Math.max(...ys);
  const pts = data.map((p, i) => `${8 + i * (120 / (data.length - 1))},${34 - (max === min ? 0.5 : (p[2] - min) / (max - min)) * 26}`).join(' ');
  return `<svg class="chart" viewBox="0 0 136 40" style="height:40px;border:0" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--chart)" stroke-width="1.5"/></svg>`;
}

/* ---- 页面渲染 ---- */
function renderDashboard() {
  const next = D.ageBands[0].items.filter(i => i.todo || !i.done).slice(0, 3);
  const t1 = D.tumors[0];
  return pageHead() + `<div class="grid cols-2">
    <div class="card"><h3>年龄段的下一件事</h3><ul>${next.map(i => `<li>${esc(i.name)} <span class="ctx-inline">· ${esc(i.freq)}</span></li>`).join('') || '<li>本年龄段项目均有记录</li>'}</ul><p class="ctx">来源逐项见「随访日历」。</p></div>
    <div class="card"><h3>最近变化（只报数值，不判读）</h3><ul><li>T-01 左颈部长径：${t1.series.at(-2)[2]} → ${t1.series.at(-1)[2]} mm（${t1.series.at(-1)[0]}-${t1.series.at(-1)[1]} MRI）</li><li>NRS 最近一次：${D.metricSeries[0].series.at(-1)[2]} 分</li></ul><p class="ctx">变化描述仅陈述记录值差异。</p></div>
    <div class="card"><h3>受累系统</h3><p>${D.subtype.systems.map(esc).join(' · ')}</p><p class="ctx">${esc(D.subtype.sourceNote)}</p></div>
    <div class="card"><h3>复诊准备</h3><ul>${D.reviewNotes.map(n => `<li>${esc(n)}</li>`).join('')}</ul><button class="text-button" data-nav="review">去复诊准备 →</button></div>
  </div>`;
}
function renderRecords() {
  return pageHead() + `<div class="card"><h3>资料库（演示）</h3><table><tr><th>文件</th><th>类型</th><th>整理状态</th></tr>
  ${D.records.map(r => `<tr><td>${esc(r.file)}</td><td>${esc(r.type)}</td><td><span class="pill ${r.status.includes('核对') && !r.status.includes('待') ? 'ok' : ''}">${esc(r.status)}</span></td></tr>`).join('')}</table>
  <p class="ctx">候选信息未核对不入档（演示口径）。</p></div>`;
}
function renderSubtype() {
  return pageHead() + `<div class="grid cols-2">
    <div class="card"><h3>分型</h3><p style="font-size:15px;font-weight:700">${esc(D.subtype.type)}</p><p class="ctx">${esc(D.subtype.sourceNote)}</p></div>
    <div class="card"><h3>受累系统清单</h3><ul>${D.subtype.systems.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div class="card"><h3>常见就诊/转介科室（静态信息）</h3><p>${D.subtype.departments.map(esc).join(' · ')}</p><p class="ctx">仅为科室名称级信息，不构成就诊建议。</p></div>
  </div>`;
}
function renderCalendar() {
  return pageHead() + D.ageBands.map(b => `
  <div class="foldout ${state.fold.ageBands.includes(b.id) ? 'open' : ''}">
    <button class="foldout-head" data-fold="ageBands" data-id="${b.id}"><span>${esc(b.title)}</span><span class="caret">⌄</span></button>
    <div class="foldout-body" ${state.fold.ageBands.includes(b.id) ? '' : 'hidden'}>
      <table><tr><th>项目</th><th>频率口径</th><th>来源</th><th>状态</th></tr>
      ${b.items.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.freq)}</td><td style="font-size:12.5px;color:var(--ink-2)">${esc(i.source)}</td><td>${i.done ? `<span class="pill ok">上次 ${esc(i.done)}</span>` : i.todo ? '<span class="pill todo">待预约</span>' : '<span class="pill">未记录</span>'}</td></tr>`).join('')}
      </table></div></div>`).join('') +
  `<p class="ctx">每项的频率与来源为指南名称级引用；「待预约」只是日历状态，不构成就医建议。</p>`;
}
function renderTumors() {
  const groups = [...new Set(D.metricSeries.map(m => m.group))];
  return pageHead() + `
  <div class="card" style="margin-bottom:14px"><h3>瘤体档案（编号为聚合键）</h3><table><tr><th>编号</th><th>部位</th><th>测量方式</th><th>最近记录</th></tr>
  ${D.tumors.map(t => `<tr><td>${esc(t.id)}</td><td>${esc(t.site)}</td><td>${esc(t.method)}</td><td>${t.series.at(-1)[2]} mm（${t.series.at(-1)[0]}-${t.series.at(-1)[1]}）</td></tr>`).join('')}</table>
  <p style="margin:10px 0 0">${chartSVG([{ name: 'T-01 左颈部长径 (mm)', data: D.tumors[0].series }, { name: 'T-02 右前臂 (mm)', data: D.tumors[1].series }])}</p>
  <p class="ctx">趋势仅展示测量值序列；不做良恶性或生长速度判读。</p></div>
  <h3 style="font-size:13.5px;color:var(--ink-2)">指标系列卡（点击原位 3D 翻转看最近记录与趋势）</h3>
  ${groups.map(g => { const ms = D.metricSeries.filter(m => m.group === g); return `<div class="series-group"><h3>${esc(g)} <small style="font-weight:400">${ms.length} 项</small></h3><div class="mgrid">${ms.map(m => mcard(m)).join('')}</div></div>`; }).join('')}`;
}
function renderTreatment() {
  return pageHead() + D.treatmentLines.map(t => `
  <div class="foldout ${state.fold.lines.includes(t.id) ? 'open' : ''}">
    <button class="foldout-head" data-fold="lines" data-id="${t.id}"><span>${esc(t.title)}</span><span class="caret">⌄</span></button>
    <div class="foldout-body" ${state.fold.lines.includes(t.id) ? '' : 'hidden'}><table>
    ${t.rows.map(r => `<tr><th style="width:120px">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</table></div>
  </div>`).join('') + `
  <div class="card"><h3>副作用时间线（发生—缓解双日期）</h3><table><tr><th>日期</th><th>事件</th><th>发生</th><th>缓解</th><th>所属线</th></tr>
  ${D.sideEffects.map(e => `<tr><td>${esc(e.date)}</td><td>${esc(e.what)}</td><td>${esc(e.onset)}</td><td>${esc(e.eased)}</td><td>${esc(e.line)}</td></tr>`).join('')}</table>
  <p class="ctx">「缓解」仅为事件日期记录，不是疗效判断。</p></div>`;
}
function renderGenetics() {
  const members = privateData();
  return pageHead() + `
  <div class="card" style="margin-bottom:12px"><h3>家系成员建档 <button class="text-button" data-action="private">${state.privateOpen ? '收起私密内容' : '展开私密内容（本页确认）'}</button></h3>
  ${members ? `<table><tr><th>成员</th><th>记录</th></tr>${members.map(m => `<tr><td>${esc(m.rel)}</td><td>${esc(m.note)}</td></tr>`).join('')}</table><p class="ctx">私密区展开仅在本页有效，换页即收回；导出与 AI 携带都走同一过滤出口。</p>` : '<p class="ctx">私密内容未展开（三出口过滤生效：渲染/导出/AI 均不携带）。</p>'}
  </div>
  <div class="card"><h3>遗传咨询问题清单（就诊沟通用）</h3><ol>${D.genetics.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ol><p class="ctx">${esc(D.genetics.qaSource)}</p></div>`;
}
function renderReview() {
  const priv = privateData();
  const exportText = ['【复诊准备】', ...D.reviewNotes.map(n => '- ' + n), priv ? '- 家系：' + priv.map(m => m.rel).join('、') : '- 家系：私密区未展开，未携带'].join('\n');
  return pageHead() + `<div class="grid cols-2">
  <div class="card"><h3>间隔期变化</h3><ul>${D.reviewNotes.map(n => `<li>${esc(n)}</li>`).join('')}</ul><p class="ctx">数值变化为记录值差异陈述。</p></div>
  <div class="card"><h3>成稿预览（导出出口）</h3><pre style="white-space:pre-wrap;font-size:12.5px">${esc(exportText)}</pre>
  <div class="row"><button data-action="copy" data-text="${esc(exportText)}">复制成稿</button><button class="primary" data-action="agent-draft" style="border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:8px;padding:6px 12px">AI 草稿（携带上下文）</button></div></div></div>`;
}
/* ---- 指标卡（breast 口径：固定尺寸原位翻转；正面当前值+较前次，背面 sparkline+端日期） ---- */
function sparkPts(pts, color) {
  const w = 200, h = 56, pad = 8;
  const vals = pts.map(x => x.v); const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || Math.max(Math.abs(hi) * .08, 1);
  const coords = pts.map((x, i) => ({ x: pad + i * (w - pad * 2) / Math.max(pts.length - 1, 1), y: h - 12 - (x.v - lo) / span * (h - 24) }));
  const path = pts.length > 1 ? smoothPath(coords.map(c => [c.x, c.y])) : '';
  const first = coords[0], last = coords[coords.length - 1];
  return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" style="height:56px;border:0" role="img" aria-label="最近 ' + pts.length + ' 次记录折线，两端标注数值">'
    + (path ? '<path class="curve" d="' + path + '" stroke="' + color + '" style="stroke-width:1.8"/>' : '')
    + coords.map((c, i) => '<circle class="dot" cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (i === coords.length - 1 || i === 0 ? 3.4 : 2.4) + '" fill="' + color + '"/>').join('')
    + '<text x="' + Math.max(first.x, 18).toFixed(1) + '" y="' + Math.max(first.y - 8, 10).toFixed(1) + '" text-anchor="middle" fill="' + color + '" style="font-weight:600">' + pts[0].v + '</text>'
    + '<text x="' + Math.min(last.x, w - 22).toFixed(1) + '" y="' + Math.max(last.y - 8, 10).toFixed(1) + '" text-anchor="middle" fill="' + color + '" style="font-weight:600">' + pts[pts.length - 1].v + '</text></svg>';
}
function mcard(m) {
  const pts = toPts(metricData(m)); const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  const flipped = !!state.flipped[m.id];
  const color = METRIC_COLOR(m);
  const delta = prev ? ('较前次 ' + (last.v > prev.v ? '↑' : last.v < prev.v ? '↓' : '→') + ' <em>' + fmtV(Math.abs(last.v - prev.v)) + ' ' + esc(m.unit || '') + '</em>') : '首次记录';
  const cat = esc(m.group.replace('系列', ''));
  const front = '<span class="mcat"><i style="background:' + color + '"></i>' + cat + '</span>'
    + '<span class="mname">' + esc(m.name) + '</span>'
    + '<span class="mvalrow"><span class="mval">' + (last ? last.v : '—') + '<small>' + esc(m.unit || '') + '</small></span>'
    + '<span class="mdelta">' + delta + '</span></span>'
    + '<span class="mmeta"><span>共 ' + pts.length + ' 次 · ' + (last ? longDate(last.d) : '—') + ' · ' + esc(m.source) + '</span><span class="hint">翻转 ↗</span></span>';
  const back = pts.length > 1
    ? '<span class="mname"><i class="dotchip" style="background:' + color + '"></i>' + esc(m.name) + ' · 最近 ' + pts.length + ' 次</span>'
      + sparkPts(pts, color)
      + '<span class="msp-labels"><span>' + longDate(pts[0].d) + '</span><span>' + longDate(last.d) + '</span></span>'
      + '<span class="mfoot">仅回顾已记录值 · 点击返回</span>'
    : '<span class="mname"><i class="dotchip" style="background:' + color + '"></i>' + esc(m.name) + '</span>'
      + '<span class="mna">只有 ' + pts.length + ' 次记录，暂不连线。<br>再记录一次后显示趋势。</span>'
      + '<span class="mfoot">点击返回</span>';
  return '<button class="mcard" data-flip="' + m.id + '" aria-pressed="' + flipped + '" aria-label="' + esc(m.name) + '，' + (last ? last.v + (m.unit || '') : '无记录') + '；点击翻转">'
    + '<span class="mcard-inner' + (flipped ? ' flipped' : '') + '">'
    + '<span class="mface front">' + front + '</span>'
    + '<span class="mface back">' + back + '</span>'
    + '</span></button>';
}

/* ---- 一图秀（breast 口径：左栏筛选即时更新 + 每线按自身范围缩放 + 图例/pin/开关） ---- */
function chartDomain() {
  const all = D.metricSeries.flatMap(m => toPts(metricData(m))).map(x => Date.parse(x.d));
  if (state.range === '3m') return [Date.now() - 92 * 864e5, Date.now()];
  if (state.range === '6m') return [Date.now() - 183 * 864e5, Date.now()];
  if (state.range === '12m') return [Date.now() - 365 * 864e5, Date.now()];
  return [Math.min(...all), Math.max(...all, Date.now())];
}
function oneChartSVG() {
  const w = 640, h = 250, pad = { l: 16, r: 16, t: 20, b: 36 };
  const dom = chartDomain(); const t0 = dom[0], t1 = dom[1];
  const X = d => pad.l + (Date.parse(d) - t0) / Math.max(t1 - t0, 1) * (w - pad.l - pad.r);
  const series = state.chartSel.map(id => { const m = D.metricSeries.find(x => x.id === id); const all = toPts(metricData(m)); const pts = all.filter(x => Date.parse(x.d) >= t0 && Date.parse(x.d) <= t1); return { m, all, pts }; }).filter(x => x.pts.length);
  if (!series.length) return '<div class="card"><h3>这个时间窗里没有所选指标</h3><p class="ctx">扩大时间范围，或在左侧加选一个指标。</p></div>';
  let out = '';
  for (let i = 0; i <= 3; i++) { const y = pad.t + i * (h - pad.t - pad.b) / 3; out += '<line x1="' + pad.l + '" x2="' + (w - pad.r) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)"/>'; }
  if (state.toggles.treatment) {
    const tl = D.treatmentLines.find(l => l.rows.some(r => r[0] === '开始' && r[1]));
    if (tl) { const st = tl.rows.find(r => r[0] === '开始')[1]; const x1 = Math.max(X(st + '-01'), pad.l);
      out += '<rect x="' + x1.toFixed(1) + '" y="' + (pad.t - 8) + '" width="' + (w - pad.r - x1).toFixed(1) + '" height="5" rx="2.5" fill="#22664e" opacity=".22"/>'
           + '<text x="' + (x1 + 3).toFixed(1) + '" y="' + (pad.t - 11) + '" fill="#22664e" font-size="10">' + esc(tl.title.replace('（当前）', '').replace('（未开始）', '')) + '</text>'; }
  }
  series.forEach((sr, si) => {
    const color = METRIC_COLOR(sr.m);
    const vals = sr.all.map(x => x.v);
    const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || Math.max(Math.abs(hi) * .08, 1);
    const Y = v => h - pad.b - (v - lo) / span * (h - pad.t - pad.b);
    const coords = sr.pts.map(x => ({ x: X(x.d), y: Y(x.v) }));
    out += '<path class="curve" d="' + smoothPath(coords.map(o => [o.x, o.y])) + '" stroke="' + color + '"/>';
    coords.forEach((c, i) => {
      const pt = sr.pts[i], prev = sr.pts[i - 1]; const isLast = i === sr.pts.length - 1;
      let tag = '';
      if (prev && state.toggles.changes && Math.abs((pt.v - prev.v) / Math.max(Math.abs(prev.v), 1)) >= .2) {
        const pct = Math.round((pt.v - prev.v) / Math.abs(prev.v) * 100);
        tag += '<text x="' + (c.x + 7).toFixed(1) + '" y="' + (c.y - 8 - (si % 3) * 12).toFixed(1) + '" fill="' + color + '" font-size="10.5">' + (pct > 0 ? '+' : '') + pct + '%</text>';
      }
      if (isLast && state.toggles.keypoints) tag += '<text x="' + (c.x - 5).toFixed(1) + '" y="' + (c.y - 10 - (si % 3) * 13).toFixed(1) + '" text-anchor="end" fill="' + color + '" font-size="11" style="font-weight:600">' + pt.v + '</text>';
      out += '<circle class="dot" data-action="pin" data-pin="' + sr.m.id + '|' + pt.d + '" cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (isLast ? 5 : 4) + '" fill="' + color + '" style="cursor:pointer"><title>' + esc(sr.m.name) + ' ' + pt.v + ' ' + esc(sr.m.unit || '') + ' · ' + pt.d + '</title></circle>' + tag;
    });
  });
  const months = []; const cur = new Date(t0); cur.setDate(1);
  while (cur.getTime() <= t1) { if (cur.getTime() >= t0) months.push({ x: X(cur.toISOString().slice(0, 10)), l: (cur.getMonth() + 1) + '月' }); cur.setMonth(cur.getMonth() + 1); }
  out += months.filter((x, i) => months.length > 8 ? i % 2 === 0 : true).map(x => '<text x="' + x.x.toFixed(1) + '" y="' + (h - 14) + '" text-anchor="middle" font-size="10.5">' + x.l + '</text>').join('');
  return '<svg class="chart" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="已选指标趋势；每条线按自身范围绘制，点选可查看数值与来源">' + out
    + '<text x="' + pad.l + '" y="' + (h - 2) + '" font-size="10.5">↑ 每条线按该指标全部记录范围缩放，不代表不同指标数值可比</text></svg>';
}
function oneLegend() {
  return D.metricSeries.filter(m => state.chartSel.includes(m.id) && metricData(m).length).map(m => {
    const vals = toPts(metricData(m)).map(x => x.v);
    return '<span><i style="background:' + METRIC_COLOR(m) + '"></i><b>' + esc(m.name) + '</b> ' + fmtV(vals[vals.length - 1]) + ' ' + esc(m.unit || '') + '<span class="range">全期 ' + fmtV(Math.min(...vals)) + '–' + fmtV(Math.max(...vals)) + '</span></span>';
  }).join('');
}
function pinHTML() {
  if (!state.pin) return '<p class="ctx">点击曲线上的记录点，可查看数值、日期与来源。</p>';
  const parts = state.pin.split('|'); const m = D.metricSeries.find(x => x.id === parts[0]);
  const pt = toPts(metricData(m)).find(x => x.d === parts[1]);
  if (!pt) return '<p class="ctx">这个记录点已不在当前时间窗内。</p>';
  return '<div class="pinbox"><div><b>' + esc(m.name) + ' ' + pt.v + ' ' + esc(m.unit || '') + '</b>'
    + '<p class="ctx" style="border:0;margin:2px 0;padding:0">' + pt.d + ' · 来源：' + esc(m.source) + '</p>'
    + '<p class="ctx" style="border:0;margin:2px 0;padding:0">趋势只用于回顾记录，不构成诊断或疗效判断。</p></div>'
    + '<button data-action="unpin">收起</button></div>';
}
function renderOnechart() {
  const groups = [...new Set(D.metricSeries.map(m => m.group))];
  const pickers = groups.map(g => '<div class="cat-label">' + esc(g) + '</div>'
    + D.metricSeries.filter(m => m.group === g).map(m => '<label class="metric-pick"><input type="checkbox" data-metric="' + m.id + '"' + (state.chartSel.includes(m.id) ? ' checked' : '') + '><i style="background:' + METRIC_COLOR(m) + '"></i><span>' + esc(m.name) + '</span><small>' + ((metricData(m).at(-1) || [])[2] ?? '—') + '</small></label>').join('')).join('');
  return pageHead() + '<div class="one-grid">'
    + '<aside class="rail" aria-label="一图秀筛选项">'
    + '<section><h3>时间范围</h3><div class="chips">'
    + [['3m', '近 3 月'], ['6m', '近 6 月'], ['12m', '近 12 月'], ['all', '全部']].map(x => '<button class="chip" data-range="' + x[0] + '" aria-pressed="' + (state.range === x[0]) + '">' + x[1] + '</button>').join('')
    + '</div></section>'
    + '<section><h3>选择指标 <small>最多 4 个 · 已选 ' + state.chartSel.length + '</small></h3>' + pickers + '<p class="ctx">点选后图表立即更新。</p></section>'
    + '<section><h3>显示内容</h3><div class="chips">'
    + '<button class="chip" data-toggle="treatment" aria-pressed="' + state.toggles.treatment + '">治疗节点</button>'
    + '<button class="chip" data-toggle="keypoints" aria-pressed="' + state.toggles.keypoints + '">关键点数值</button>'
    + '<button class="chip" data-toggle="changes" aria-pressed="' + state.toggles.changes + '">变化 ≥20%</button>'
    + '</div></section></aside>'
    + '<section class="card"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><h3 style="margin:0">病程时间轴</h3><span class="pill">' + state.chartSel.length + ' 个指标</span></div>'
    + '<div class="legend">' + oneLegend() + '</div>'
    + oneChartSVG()
    + '<div>' + pinHTML() + '</div></section></div>';
}

/* ---- 临床试验匹配（biliary 口径：facts 卡 + 三态待确认 + 粗筛分档 + 硬性单列） ---- */
const STATE_NAME = { met: ['符合', 'ok'], unmet: ['不符合', 'todo'], unknown: ['待确认', ''] };
function matchTrial(t) {
  const evals = t.criteria.map(c => ({ c, state: c.state }));
  const met = evals.filter(e => e.state === 'met').length;
  const unmet = evals.filter(e => e.state === 'unmet').length;
  const unknown = evals.filter(e => e.state === 'unknown').length;
  const pct = Math.round(met / Math.max(1, met + unmet + unknown) * 100);
  const hardUnmet = evals.filter(e => e.state === 'unmet' && e.c.hard);
  const band = hardUnmet.length ? 'ineligible' : (pct >= 80 && unknown <= 1) ? 'high' : pct >= 55 ? 'partial' : 'needs_info';
  return { t, evals, met, unmet, unknown, pct, band, hardUnmet };
}
const BAND = { high: ['高度符合'], partial: ['部分符合'], needs_info: ['需补充信息'], ineligible: ['硬性条件不满足'] };
const critIcon = st => `<span class="crit-mark ${st === 'met' ? 'ok' : st === 'unmet' ? 'no' : 'q'}">${st === 'met' ? '✓' : st === 'unmet' ? '✕' : '?'}</span>`;
let savedTrials = {};
function trialCard(m) {
  const t = m.t;
  const [bandLabel] = BAND[m.band];
  const saved = savedTrials[t.reg];
  const bandCls = m.band === 'high' ? 'ok' : m.band === 'partial' ? 'warn' : m.band === 'ineligible' ? 'no' : 'grey';
  const order = { unmet: 0, unknown: 1, met: 2 };
  const sorted = [...m.evals].sort((a, b) => order[a.state] - order[b.state]);
  const top = sorted.slice(0, 4), rest = sorted.slice(4);
  const line = ({ c, state }) => `<div class="crit ${state === 'unmet' ? 'unmet' : state === 'unknown' ? 'unknown' : ''}">
    <div class="crit-line">${critIcon(state)}<span><b>${c.kind === 'exclude' ? '排除' : '入组'} · ${esc(c.cat)}</b>${c.hard ? '<span class="hardtag">硬性</span>' : ''}</span></div>
    <p>${esc(c.need)}</p>
    <small><b>${STATE_NAME[state][0]}</b> · 记录里是：${esc(c.actual)} · 条件要求：${esc(c.need)}</small>
  </div>`;
  return `<section class="trial-card ${m.band === 'ineligible' ? 'ineligible' : ''}">
    <div class="trial-top">
      <div style="min-width:0">
        <div class="trial-tags"><span class="pill">${esc(t.phase)} 期</span><span class="pill">${esc(t.scope)}</span><span class="pill ${t.verified ? '' : 'todo'}">${t.verified ? esc(t.verified) : '未核验'}</span></div>
        <h2>${esc(t.title)}</h2>
        <p class="trial-reg">${esc(t.reg)} · ${esc(t.registry)}</p>
      </div>
      <div class="fit ${bandCls}"><b>${m.pct}<small>%</small></b><span>粗筛符合度</span><em>${esc(bandLabel)}</em></div>
    </div>
    <p class="trial-sum">${esc(t.summary)}</p>
    <div class="match-counts"><span class="pill ok">符合 ${m.met}</span>${m.unmet ? `<span class="pill todo">不符合 ${m.unmet}</span>` : ''}${m.unknown ? `<span class="pill">待确认 ${m.unknown}</span>` : ''}</div>
    <div class="crit-list">${top.map(line).join('')}</div>
    ${rest.length ? `<details class="crit-more"><summary>其余 ${rest.length} 条条件</summary><div class="crit-list">${rest.map(line).join('')}</div></details>` : ''}
    <div class="trial-actions">
      <button data-action="trial-save" data-id="${esc(t.reg)}">${saved ? '已收藏（在跟）' : '收藏并跟踪'}</button>
      <button data-action="trial-ask" data-id="${esc(t.reg)}">把待确认项加进问题清单</button>
      <a class="text-button" href="${esc(t.url)}" target="_blank" rel="noreferrer">看登记原文 ↗</a>
    </div>
    <p class="ctx">符合度 = 符合项 ÷ 已对照项（符合+不符合+待确认）。未知项按 0 计，因此只会偏低、不会偏高。这不是入组资格，也不代表效果。</p>
  </section>`;
}
function renderTrials() {
  const all = D.trials.map(matchTrial);
  const fit = all.filter(m => m.band !== 'ineligible').sort((a, b2) => b2.pct - a.pct);
  const bad = all.filter(m => m.band === 'ineligible');
  const exportText = ['【临床试验对照 · ' + new Date().toISOString().slice(0, 10) + '】',
    ...D.trialFacts.map(f => '- ' + f[0] + '：' + f[1] + '（' + f[2] + '）'),
    ...all.map(m => '- ' + m.t.reg + ' ' + m.pct + '%（' + BAND[m.band][0] + '，符合 ' + m.met + '/待确认 ' + m.unknown + '/不符合 ' + m.unmet + '）'),
    '口径：符合度=符合÷已对照项，未知按0计；不是入组资格。'].join('\n');
  return pageHead() + `<button class="exportbtn" data-action="copy" data-text="${esc(exportText)}">导出这次对照</button>
  <p class="ctx" style="border:0;margin:0 0 10px">条目为真实<b>登记信息</b>（M4 实采 nf_trials_2026.sqlite · 364 条快照 2026-10-25）；招募状态登记库未给出，一律显示「未核验」，不显示「招募中」。是否参加由患者与主诊医生决定。</p>
  <div class="card" style="margin-bottom:12px"><h3>用来对照的档案事实（TRL-01 口径）</h3>
  <div class="factgrid">${D.trialFacts.map(f => `<dl><dt>${esc(f[0])}</dt><dd><b>${esc(f[1])}</b><span>${esc(f[2])}</span></dd></dl>`).join('')}</div>
  <p class="ctx">每一项都来自你的记录，带日期与谁说的；没记的写「未记录」。偏好（如接受活检/安慰剂）只影响排序与提示，不改变符合判断。</p></div>
  <h3 style="font-size:13.5px">按当前记录能对上的（${fit.length}）</h3>
  ${fit.map(trialCard).join('')}
  ${bad.length ? `<details class="badwrap"><summary class="text-button" style="display:inline">硬性条件不满足的 ${bad.length} 条（点开看是哪一条挡住了）</summary>${bad.map(trialCard).join('')}</details>` : ''}`;
}
const RENDER = { dashboard: renderDashboard, records: renderRecords, subtype: renderSubtype, calendar: renderCalendar, tumors: renderTumors, treatment: renderTreatment, genetics: renderGenetics, review: renderReview, onechart: renderOnechart, trials: renderTrials };

/* ---- 每页「和AI讨论」上下文（34 号 agent-draft；私密三出口同口径） ---- */
function pageContext() {
  const base = { 页面: PAGES.find(p => p[0] === state.view)[1] };
  switch (state.view) {
    case 'dashboard': return { ...base, 分型: D.subtype.type, 年龄段待办: D.ageBands[0].items.filter(i => i.todo || !i.done).map(i => i.name), 瘤体最近值: D.tumors.map(t => t.id + ' ' + t.series.at(-1)[2] + 'mm') };
    case 'subtype': return { ...base, 分型: D.subtype.type, 受累系统: D.subtype.systems, 来源: D.subtype.sourceNote };
    case 'calendar': return { ...base, 当前年龄段: D.ageBands[0].title, 待办: D.ageBands[0].items.filter(i => i.todo || !i.done).map(i => i.name + '（' + i.freq + '）'), 各段项目数: D.ageBands.map(b => b.title + ':' + b.items.length) };
    case 'tumors': return { ...base, 瘤体: D.tumors.map(t => t.id + ' ' + t.site + ' 最近 ' + t.series.at(-1)[2] + 'mm'), 已选指标: state.chartSel, 卡片系列数: D.metricSeries.length };
    case 'treatment': return { ...base, 治疗线: D.treatmentLines.map(l => l.title), 副作用: D.sideEffects.map(e => e.what + ' ' + e.onset + '→' + e.eased) };
    case 'genetics': return state.privateOpen ? { ...base, 家系成员: D.genetics.members.map(m => m.rel), 问题清单数: D.genetics.questions.length } : { ...base, 家系: '私密区未展开，未携带' };
    case 'review': return { ...base, 复诊要点: D.reviewNotes, 家系: state.privateOpen ? '已展开（携带）' : '私密区未展开，未携带' };
    case 'onechart': return { ...base, 已选指标: state.chartSel.map(id => { const m = D.metricSeries.find(x => x.id === id); return m ? m.name + ' 最近 ' + (metricData(m).at(-1) || [])[2] + (m.unit || '') : id; }), 范围: state.range };
    case 'trials': return { ...base, 档案事实: D.trialFacts.map(f => f[0] + '=' + f[1]), 分档: '高度/部分/需补充/硬性不满足', 库快照: 'nf_trials_2026.sqlite · 364 条 · 2026-10-25' };
    default: return base;
  }
}
function discussPrompt() {
  return ({ dashboard: '帮我看着板子里的待办和变化，告诉我复诊前该准备什么', subtype: '帮我用大白话解释这个分型和受累系统，就诊时该问什么', calendar: '帮我核对当前年龄段的随访项目，哪些该预约了', tumors: '帮我总结瘤体记录的变化，整理成复诊时能说清的一段话', treatment: '帮我整理治疗线和副作用时间线', genetics: '帮我准备遗传咨询的问题清单', review: '帮我把复诊准备理成一页', onechart: '帮我解读当前选中的指标趋势（只描述，不判断）', trials: '帮我解释这些临床研究条目和匹配依据' })[state.view] || '帮我看看这页的信息';
}

function pageHead() { const p = PAGES.find(x => x[0] === state.view); return `<div class="page-head"><h1>${esc(p[1])}</h1><p>${esc(SUBTITLES[state.view])}</p><button class="text-button discuss-btn" data-action="discuss">和AI讨论 ↗</button></div>`; }

/* ---- 弹窗 ---- */
function modal(html) { const root = $('#modal-root'); root.hidden = false; root.innerHTML = `<div class="modal-mask"><div class="modal">${html}</div></div>`; }
function closeModal() { $('#modal-root').hidden = true; $('#modal-root').innerHTML = ''; }
function settingsModal() {
  modal(`<h3>设置</h3><table>
  <tr><th>患者资料目录</th><td>本机目录（演示：已激活）</td></tr>
  <tr><th>文档解析</th><td>MinerU（启用 · 六部件管线，v0.1 原型仅入口占位）</td></tr>
  <tr><th>临床数据库</th><td>神经纤维瘤病诊疗指南（2025 年版）等 · 见 CLINICAL-DATA.md</td></tr>
  <tr><th>云端</th><td>关闭（默认本机优先，无静默上传）</td></tr></table>
  <div class="row"><button data-action="close">关闭</button></div>`);
}
function aboutModal() { modal(`<h3>关于小纤宝</h3><p style="font-size:13px">小纤宝 FibroPal · 神经纤维瘤病工作台 · <b>v${D.version}</b>（原型 v0.1）</p><p class="ctx">信息整理与就诊准备工具，不提供诊断与治疗建议。</p><div class="row"><button data-action="close">关闭</button></div>`); }
function helpModal() { modal(`<h3>原型操作说明</h3><ul style="font-size:13px"><li>指标卡点击可 3D 翻转（背面=最近记录+来源）</li><li>随访日历/治疗线为折叠卡，注意收/展两态</li><li>一图秀左侧栏：时间范围 + 分组指标勾选（最多 4 个，即时更新）+ 显示开关</li><li>遗传家系私密区：本页确认展开，换页收回</li><li>AI 草稿按钮演示 agent-draft 携带上下文</li></ul><div class="row"><button data-action="close">关闭</button></div>`); }
function agentDraftModal() {
  const ctx = agentContext();
  const prompt = '请基于我的档案帮我整理复诊材料草稿。档案上下文：' + JSON.stringify(ctx)
  const uri = `xxx:agent-draft?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(JSON.stringify(ctx))}`;
  // Desktop（0.1.15+）：iframe 内经 postMessage 把草稿交给宿主原生会话（customFrame 桥）
  if (window.parent && window.parent !== window) {
    try { window.parent.postMessage({ type: 'nf:agent-draft', prompt }, '*') } catch { /* 非 Desktop 环境忽略 */ }
  }
  modal(`<h3>AI 草稿（agent-draft · 34 号）</h3><p style="font-size:12.5px;word-break:break-all">${esc(uri)}</p><p class="ctx">私密三出口：${state.privateOpen ? '本页已展开，家系已携带' : '私密区未展开，家系未携带'}。</p><div class="row"><button data-action="close">关闭</button></div>`);
}

/* ---- 事件 ---- */
function render() {
  $('#nav').innerHTML = PAGES.map(([id, label]) => `<button class="nav-button" data-nav="${id}" ${state.view === id ? 'aria-current="page"' : ''}>${label}</button>`).join('');
  $('#breadcrumb').textContent = PAGES.find(p => p[0] === state.view)[1];
  $('#main').innerHTML = RENDER[state.view]();
}
document.addEventListener('click', (e) => {
  const t = e.target;
  const nav = t.closest('[data-nav]'); if (nav) { state.view = nav.dataset.nav; state.privateOpen = false; render(); $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0); return; }
  const flip = t.closest('[data-flip]'); if (flip) { const id = flip.dataset.flip; state.flipped[id] = !state.flipped[id]; const inner = flip.querySelector('.mcard-inner'); if (inner) inner.classList.toggle('flipped'); flip.setAttribute('aria-pressed', String(!!state.flipped[id])); return; }
  const fold = t.closest('[data-fold]'); if (fold) { const g = fold.dataset.fold, id = fold.dataset.id; const arr = state.fold[g]; const i = arr.indexOf(id); i >= 0 ? arr.splice(i, 1) : arr.push(id); fold.closest('.foldout').classList.toggle('open'); const body = fold.parentElement.querySelector('.foldout-body'); body.hidden = !body.hidden; return; }
  const act = t.closest('[data-action],[data-range],[data-toggle]'); if (!act) return;
  const a = act.dataset.action;
  if (a === 'settings') settingsModal();
  else if (a === 'about') aboutModal();
  else if (a === 'help') helpModal();
  else if (a === 'close') closeModal();
  else if (act.dataset.range) { state.range = act.dataset.range; render(); }
  else if (act.dataset.toggle) { const k = act.dataset.toggle; state.toggles[k] = !state.toggles[k]; render(); }
  else if (act.dataset.pin) { state.pin = act.dataset.pin; render(); }
  else if (a === 'unpin') { state.pin = null; render(); }
  else if (a === 'trial-save') { const id = act.dataset.id; savedTrials[id] = !savedTrials[id]; render(); }
  else if (a === 'trial-ask') {
    const t = D.trials.find(x => x.reg === act.dataset.id);
    const unknowns = t.criteria.filter(c => c.state === 'unknown').map(c => c.cat + '：' + c.need + '（' + t.reg + '）');
    D.reviewNotes.push('待确认（' + t.reg + '）-- ' + unknowns.join('；'));
    state.view = 'review'; render();
  }
  else if (a === 'discuss') {
    const dock = $('#agent-dock');
    if (dock.hidden) { dock.hidden = false; $('#agent-toggle').setAttribute('aria-expanded', 'true'); $('#agent-state').textContent = '面板已打开'; }
    const ctx = pageContext();
    const uri = 'xxx:agent-draft?prompt=' + encodeURIComponent(discussPrompt()) + '&context=' + encodeURIComponent(JSON.stringify(ctx));
    const slot = dock.querySelector('.agent-carry');
    slot.innerHTML = '<b>本页携带（34 号 agent-draft）</b><pre style="white-space:pre-wrap;font-size:12.5px;margin:4px 0">' + esc(JSON.stringify(ctx, null, 1)) + '</pre>'
      + '<p class="agent-hint">' + esc(uri.slice(0, 160)) + '…</p>';
    slot.hidden = false;
    slot.scrollIntoView({ block: 'nearest' });
  }
  else if (a === 'private') { state.privateOpen = !state.privateOpen; render(); }
  else if (a === 'agent') { const d = $('#agent-dock'); d.hidden = !d.hidden; $('#agent-toggle').setAttribute('aria-expanded', String(!d.hidden)); $('#agent-state').textContent = d.hidden ? '未进入激活' : '面板已打开'; }
  else if (a === 'agent-size') { $('#agent-dock').dataset.size = act.dataset.size; $('#agent-dock').querySelectorAll('[data-action="agent-size"]').forEach(b => b.setAttribute('aria-pressed', String(b === act))); }
  else if (a === 'agent-build' || a === 'agent-draft') agentDraftModal();
  else if (a === 'agent-demo') agentDraftModal();
  else if (a === 'copy') { const text = act.dataset.text; navigator.clipboard && navigator.clipboard.writeText(text); act.textContent = '已复制'; }
  else if (a === 'open-store') helpModal();
});
$('#font-toggle').addEventListener('click', () => { state.bigfont = !state.bigfont; document.body.classList.toggle('bigfont', state.bigfont); $('#font-toggle').setAttribute('aria-pressed', String(state.bigfont)); });
document.addEventListener('change', (e) => {
  const mb = e.target.closest('input[data-metric]'); if (!mb) return;
  const id = mb.dataset.metric;
  if (mb.checked) { if (state.chartSel.length >= 4) { mb.checked = false; return; } if (!state.chartSel.includes(id)) state.chartSel.push(id); }
  else state.chartSel = state.chartSel.filter(x => x !== id);
  render();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); if (e.key === 'Enter' && e.target.dataset && e.target.dataset.flip) e.target.click(); });
render();
