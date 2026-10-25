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

const state = { view: 'dashboard', flipped: {}, fold: { ageBands: ['child'], lines: ['TL-1'] }, chartSel: ['pain', 'tumor-t01'], bigfont: false, privateOpen: false };

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
function metricData(m) { return m.series ? m.series : (m.id === 'tumor-t01' ? D.tumors[0].series : []); }
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
  <h3 style="font-size:13.5px;color:var(--ink-2)">指标系列卡（点击卡片 3D 翻转看背面）</h3>
  ${groups.map(g => `<div class="series-group"><h3>${esc(g)}</h3><div class="flip-grid">${
    D.metricSeries.filter(m => m.group === g).map(m => {
      const data = metricData(m); const last = data.at(-1);
      const recent = data.slice(-3).map(p => `${p[0]}-${p[1]}：${p[2]}`).join('<br>') || '（无记录）';
      return `<div class="flip ${state.flipped[m.id] ? 'flipped' : ''}" data-flip="${m.id}" tabindex="0" role="button" aria-pressed="${!!state.flipped[m.id]}" aria-label="${esc(m.name)}，点击翻转">
        <div class="flip-face"><span class="flip-name">${esc(m.name)}</span><span class="flip-value">${last ? last[2] : '—'} <small>${esc(m.unit)}</small></span><div class="flip-mini">${sparkline(data)}</div><button class="flip-hint">翻到背面 ↻</button></div>
        <div class="flip-face flip-back"><span class="flip-name">最近记录</span><p style="font-size:12.5px;margin:4px 0">${recent}</p><p class="ctx" style="border:0;margin:2px 0;padding:0">来源：${esc(m.source)}</p><button class="flip-hint">翻回正面 ↺</button></div>
      </div>`;
    }).join('')}</div></div>`).join('')}`;
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
function renderOnechart() {
  return pageHead() + `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
  <b style="font-size:13.5px">已选指标：${state.chartSel.length} 项</b><button data-action="pick-metrics" style="border:1px solid var(--line);border-radius:8px;padding:6px 12px;font-size:13px">选择指标…</button></div>
  ${chartSVG(state.chartSel.map(id => { const m = D.metricSeries.find(x => x.id === id); return { name: m.name, data: metricData(m) }; }).filter(s => s.data.length))}
  <p class="ctx">不同量纲的指标同图并列时，纵轴按全体数值域绘制（原型口径，v0.2 再分轴）；分类字段不进趋势。</p></div>`;
}
function renderTrials() {
  return pageHead() + `<div class="card"><h3>临床研究匹配（演示数据 · 非真实条目）</h3>
  <p class="ctx" style="border:0;margin-top:0">链路：个人基因/病理档案 → 搜索或 AI 协助匹配 → 自带 sqlite 试验库 + 外部工具 → 匹配结果（匹配指数 + 条目化依据）。匹配指数为条件命中占比，不是入组成功率。</p>
  ${D.trials.map(t => `<table style="margin-bottom:14px"><tr><th style="width:130px">条目</th><td>${esc(t.nct)} · ${esc(t.title)}</td></tr>
  <tr><th>分期/状态</th><td>${esc(t.phase)} · ${esc(t.status)}</td></tr>
  <tr><th>匹配指数</th><td><b style="font-size:15px;color:var(--accent)">${t.matchScore}%</b>（${t.matchDetail.filter(x => x[2] === true).length}/${t.matchDetail.length} 条命中）</td></tr>
  ${t.matchDetail.map(x => `<tr><th>条件</th><td>${esc(x[0])}：${esc(x[1])} ${x[2] === true ? '<span class="pill ok">命中</span>' : x[2] === false ? '<span class="pill todo">不符合</span>' : '<span class="pill">档案未记录</span>'}</td></tr>`).join('')}
  </table>`).join('')}
  <p class="ctx">「档案未记录」如实显示，不用相邻病种外推。</p></div>`;
}
const RENDER = { dashboard: renderDashboard, records: renderRecords, subtype: renderSubtype, calendar: renderCalendar, tumors: renderTumors, treatment: renderTreatment, genetics: renderGenetics, review: renderReview, onechart: renderOnechart, trials: renderTrials };
function pageHead() { const p = PAGES.find(x => x[0] === state.view); return `<div class="page-head"><h1>${esc(p[1])}</h1><p>${esc(SUBTITLES[state.view])}</p></div>`; }

/* ---- 弹窗 ---- */
function modal(html) { const root = $('#modal-root'); root.hidden = false; root.innerHTML = `<div class="modal-mask"><div class="modal">${html}</div></div>`; }
function closeModal() { $('#modal-root').hidden = true; $('#modal-root').innerHTML = ''; }
function metricsPicker() {
  modal(`<h3>选择要进一图秀的指标</h3>${D.metricSeries.map(m => `<label style="display:block;margin:6px 0;font-size:13px"><input type="checkbox" value="${m.id}" ${state.chartSel.includes(m.id) ? 'checked' : ''}> ${esc(m.group)} · ${esc(m.name)}${metricData(m).length ? '' : '（无记录）'}</label>`).join('')}
  <div class="row"><button data-action="close">取消</button><button class="primary" data-action="apply-metrics">应用</button></div>`);
}
function settingsModal() {
  modal(`<h3>设置</h3><table>
  <tr><th>患者资料目录</th><td>本机目录（演示：已激活）</td></tr>
  <tr><th>文档解析</th><td>MinerU（启用 · 六部件管线，v0.1 原型仅入口占位）</td></tr>
  <tr><th>临床数据库</th><td>神经纤维瘤病诊疗指南（2025 年版）等 · 见 CLINICAL-DATA.md</td></tr>
  <tr><th>云端</th><td>关闭（默认本机优先，无静默上传）</td></tr></table>
  <div class="row"><button data-action="close">关闭</button></div>`);
}
function aboutModal() { modal(`<h3>关于小纤宝</h3><p style="font-size:13px">小纤宝 FibroPal · 神经纤维瘤病工作台 · <b>v${D.version}</b>（原型 v0.1）</p><p class="ctx">信息整理与就诊准备工具，不提供诊断与治疗建议。</p><div class="row"><button data-action="close">关闭</button></div>`); }
function helpModal() { modal(`<h3>原型操作说明</h3><ul style="font-size:13px"><li>指标卡点击可 3D 翻转（背面=最近记录+来源）</li><li>随访日历/治疗线为折叠卡，注意收/展两态</li><li>一图秀右上「选择指标…」开指标选择窗</li><li>遗传家系私密区：本页确认展开，换页收回</li><li>AI 草稿按钮演示 agent-draft 携带上下文</li></ul><div class="row"><button data-action="close">关闭</button></div>`); }
function agentDraftModal() {
  const ctx = agentContext();
  const uri = `xxx:agent-draft?prompt=${encodeURIComponent('请基于我的档案帮我整理复诊材料草稿。')}&context=${encodeURIComponent(JSON.stringify(ctx))}`;
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
  const flip = t.closest('[data-flip]'); if (flip && !t.closest('button')) { const id = flip.dataset.flip; state.flipped[id] = !state.flipped[id]; flip.classList.toggle('flipped'); flip.setAttribute('aria-pressed', String(!!state.flipped[id])); return; }
  const fold = t.closest('[data-fold]'); if (fold) { const g = fold.dataset.fold, id = fold.dataset.id; const arr = state.fold[g]; const i = arr.indexOf(id); i >= 0 ? arr.splice(i, 1) : arr.push(id); fold.closest('.foldout').classList.toggle('open'); const body = fold.parentElement.querySelector('.foldout-body'); body.hidden = !body.hidden; return; }
  const act = t.closest('[data-action]'); if (!act) return;
  const a = act.dataset.action;
  if (a === 'settings') settingsModal();
  else if (a === 'about') aboutModal();
  else if (a === 'help') helpModal();
  else if (a === 'close') closeModal();
  else if (a === 'pick-metrics') metricsPicker();
  else if (a === 'apply-metrics') { state.chartSel = [...$('#modal-root').querySelectorAll('input:checked')].map(i => i.value); closeModal(); render(); }
  else if (a === 'private') { state.privateOpen = !state.privateOpen; render(); }
  else if (a === 'agent') { const d = $('#agent-dock'); d.hidden = !d.hidden; $('#agent-toggle').setAttribute('aria-expanded', String(!d.hidden)); $('#agent-state').textContent = d.hidden ? '未进入激活' : '面板已打开'; }
  else if (a === 'agent-size') { $('#agent-dock').dataset.size = act.dataset.size; $('#agent-dock').querySelectorAll('[data-action="agent-size"]').forEach(b => b.setAttribute('aria-pressed', String(b === act))); }
  else if (a === 'agent-build' || a === 'agent-draft') agentDraftModal();
  else if (a === 'agent-demo') agentDraftModal();
  else if (a === 'copy') { const text = act.dataset.text; navigator.clipboard && navigator.clipboard.writeText(text); act.textContent = '已复制'; }
  else if (a === 'open-store') helpModal();
});
$('#font-toggle').addEventListener('click', () => { state.bigfont = !state.bigfont; document.body.classList.toggle('bigfont', state.bigfont); $('#font-toggle').setAttribute('aria-pressed', String(state.bigfont)); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); if (e.key === 'Enter' && e.target.dataset && e.target.dataset.flip) e.target.click(); });
render();
