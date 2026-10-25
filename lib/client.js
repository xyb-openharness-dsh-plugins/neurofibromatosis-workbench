window.__ModuleLoader__.load({
  id: "@xyb-community/neurofibromatosis-workbench",
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const metadata = {"title":"小纤宝 FibroPal 神经纤维瘤病工作台","description":"本机优先的神经纤维瘤病（NF1/NF2相关施万细胞瘤病/施万细胞瘤病）终身随访、瘤体档案、疼痛与听力记录、MEK抑制剂治疗线与遗传咨询准备工作台"}
    // 面板参数与 lib/layout.js PANEL 保持一致（test/layout-client-consistency.test.mjs 断言）
    const PANEL = { businessSide: 'left', businessWidth: 0.65, customFrame: false }
    const css = `
.wb-nf{--ink:#34413c;--muted:#596c62;--line:#dce7df;--card:#fff;--bg:#f7faf8;--accent:#22664e;--accent-soft:#e2f2ea;
color:var(--ink);background:var(--bg);font:13.5px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
font-variant-numeric:tabular-nums;min-width:0;flex:1;display:flex;flex-direction:column;overflow:auto}
.wb-nf[data-font=large]{font-size:15px}
.wb-nf *{box-sizing:border-box}.wb-nf button,.wb-nf select{font:inherit}
.wb-nf button{cursor:pointer;min-height:34px;border-radius:8px;border:1px solid var(--line);background:var(--card);padding:5px 10px}
.wb-nf .hd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 16px;background:var(--card);border-bottom:1px solid var(--line)}
.wb-nf .hd b{font-size:14px}
.wb-nf .hd .sp{flex:1}
.wb-nf .bd{display:flex;flex:1;min-height:0}
.wb-nf nav{width:170px;flex:0 0 170px;border-right:1px solid var(--line);background:var(--card);padding:8px;display:flex;flex-direction:column;gap:2px}
.wb-nf nav button{text-align:left;border:0;background:none}
.wb-nf nav button[aria-current=page]{background:var(--accent-soft);color:var(--accent);font-weight:600}
.wb-nf main{flex:1;min-width:0;overflow-y:auto;padding:14px 16px}
.wb-nf .cards{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.wb-nf .card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.wb-nf h1{font-size:14px;margin:0 0 2px}.wb-nf h2{font-size:13.5px;margin:0 0 8px}.wb-nf h3{font-size:12.5px;color:var(--muted);margin:12px 0 6px}
.wb-nf p,.wb-nf li{font-size:12.5px;margin:2px 0}
.wb-nf .ctx{color:var(--muted);font-size:12.5px;border-top:1px dashed var(--line);margin-top:6px;padding-top:4px}
.wb-nf table{border-collapse:collapse;width:100%;font-size:12.5px}
.wb-nf th,.wb-nf td{text-align:left;border-bottom:1px solid var(--line);padding:5px 6px;vertical-align:top}
.wb-nf th{color:var(--muted);font-weight:600}
.wb-nf .flip{position:relative;height:130px;perspective:800px}
.wb-nf .flip-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .45s}
.wb-nf .flip.on .flip-inner{transform:rotateY(180deg)}
.wb-nf .face{position:absolute;inset:0;backface-visibility:hidden;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column}
.wb-nf .face.back{transform:rotateY(180deg);background:var(--accent-soft)}
.wb-nf .pill{display:inline-block;border-radius:999px;padding:0 8px;font-size:12.5px;background:var(--bg)}
.wb-nf .pill.ok{background:var(--accent-soft);color:var(--accent)}
.wb-nf .fold{border:1px solid var(--line);border-radius:10px;background:var(--card);margin-bottom:8px;overflow:hidden}
.wb-nf .fold>button{width:100%;display:flex;justify-content:space-between;border:0;background:none;padding:9px 12px;font-weight:600;font-size:13px}
.wb-nf .foldbody{padding:0 12px 10px}
.wb-nf svg.chart{width:100%;height:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}
.wb-nf svg.chart text{font-size:12.5px;fill:var(--muted)}
.wb-nf .ft{border-top:1px solid var(--line);background:var(--card);color:var(--muted);font-size:12.5px;padding:6px 16px}
@media (prefers-reduced-motion:reduce){.wb-nf .flip-inner{transition:none}}
`
    const esc = (s) => String(s ?? '')

    function smoothPath(pts) {
      if (pts.length < 2) return ''
      if (pts.length === 2) return 'M ' + pts.map(p => p.join(' ')).join(' L ')
      const dx = [], dy = [], m = []
      for (let i = 0; i < pts.length - 1; i++) { dx.push(pts[i+1][0]-pts[i][0]); dy.push(pts[i+1][1]-pts[i][1]) }
      m[0] = dy[0]/dx[0]; m[pts.length-1] = dy[dy.length-1]/dx[dx.length-1]
      for (let i = 1; i < pts.length - 1; i++) {
        if (!dx[i-1] || !dx[i] || (dy[i-1]/dx[i-1])*(dy[i]/dx[i]) <= 0) m[i] = 0
        else m[i] = ((dy[i-1]/dx[i-1]) + (dy[i]/dx[i])) / 2
      }
      let d = 'M ' + pts[0][0] + ' ' + pts[0][1]
      for (let i = 0; i < pts.length - 1; i++) {
        const hh = dx[i]*2
        d += ' C ' + (pts[i][0]+hh/3) + ' ' + (pts[i][1]+m[i]*hh/3) + ',' + (pts[i+1][0]-hh/3) + ' ' + (pts[i+1][1]-m[i+1]*hh/3) + ',' + pts[i+1][0] + ' ' + pts[i+1][1]
      }
      return d
    }
    function Chart({ series, w = 560, hh = 180 }) {
      const pad = { l: 40, r: 12, t: 12, b: 24 }
      const all = series.flatMap(s => s.points)
      if (!all.length) return h('p', { className: 'ctx' }, '该系列暂无记录（如实显示为空，不外推）。')
      const xs = all.map(p => p.taken_at), ys = all.map(p => p.v)
      const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys)
      const X = v => pad.l + (xmax === xmin ? 0 : (new Date(v) - new Date(xmin)) / (new Date(xmax) - new Date(xmin))) * (w - pad.l - pad.r)
      const Y = v => hh - pad.b - (ymax === ymin ? 0.5 : (v - ymin) / (ymax - ymin)) * (hh - pad.t - pad.b)
      const colors = ['#2f6f8f', '#22664e', '#a4561f', '#7a5aa8']
      let grid = ''
      for (let i = 0; i <= 4; i++) { const y = pad.t + i*(hh-pad.t-pad.b)/4; grid += `<line x1="${pad.l}" y1="${y}" x2="${w-pad.r}" y2="${y}" stroke="#dce7df"/><text x="2" y="${y+4}">${(ymax - i*(ymax-ymin)/4).toFixed(ymax-ymin>20?0:1)}</text>` }
      const curves = series.map((s, si) => {
        const pts = s.points.map(p => [X(p.taken_at), Y(p.v)])
        if (pts.length < 2) return ''
        return `<path d="${smoothPath(pts)}" fill="none" stroke="${colors[si%4]}" stroke-width="2"/>` + pts.map((p, pi) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${colors[si%4]}"><title>${esc(s.name)} ${s.points[pi].taken_at}：${s.points[pi].v}</title></circle>`).join('')
      }).join('')
      return h('div', { dangerouslySetInnerHTML: { __html: `<svg class="chart" viewBox="0 0 ${w} ${hh}" role="img" aria-label="趋势折线图">${grid}${curves}</svg>` } })
    }

    const PAGES = [['dashboard','看板'],['subtype','病种档案'],['calendar','随访日历'],['tumors','瘤体与指标'],['treatment','治疗线'],['genetics','遗传家系'],['review','复诊准备'],['onechart','一图秀'],['trials','临床研究']]

    function Panel() {
      const [wb, setWb] = React.useState(null)
      const [error, setError] = React.useState('')
      const [view, setView] = React.useState('dashboard')
      const [flip, setFlip] = React.useState({})
      const [fold, setFold] = React.useState({ child: true })
      const [genOpen, setGenOpen] = React.useState(false)
      const [large, setLarge] = React.useState(false)
      const [health, setHealth] = React.useState(null)
      const [sel, setSel] = React.useState([])

      const load = (g) => fetch('/api/nf/workbench' + (g ? '?genetics=1' : ''), { credentials: 'same-origin' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('服务连接失败 ' + r.status)))
        .then(setWb).catch(e => setError(e.message))
      React.useEffect(() => { fetch('/api/nf/health', { credentials: 'same-origin' }).then(r => r.json()).then(setHealth).catch(() => {}); load(false) }, [])
      React.useEffect(() => { if (view === 'genetics') load(genOpen) }, [genOpen])
      React.useEffect(() => { if (wb && !sel.length) setSel(wb.metrics.filter(m => m.points.length).slice(0, 2).map(m => m.key)) }, [wb])

      if (error) return h('main', { className: 'wb-nf' }, h('style', null, css), h('p', { role: 'status' }, error + '（请确认本机服务已启动）'))
      if (!wb) return h('main', { className: 'wb-nf' }, h('style', null, css), h('p', { role: 'status' }, '正在连接本机服务…'))

      const bands = { child: '儿童期', teen: '青春期', adult: '成年期' }
      const page = () => {
        if (view === 'dashboard') return h('div', null,
          h('h2', null, '年龄段的下一件事'), h('div', { className: 'cards' },
            h('div', { className: 'card' }, h('h3', null, '待办（儿童期）'), wb.ageBands[0].items.filter(i => !i.last_done_at).map((i, k) => h('p', { key: k }, '· ' + i.item_name)),
              h('p', { className: 'ctx' }, '来源逐项见「随访日历」。')),
            h('div', { className: 'card' }, h('h3', null, '最近变化（只报数值，不判读）'),
              wb.tumors.map((t, k) => h('p', { key: k }, t.tumor_no + ' ' + t.site + '：最近 ' + (t.points.at(-1)?.v ?? '—') + ' mm')),
              h('p', { className: 'ctx' }, '变化描述仅陈述记录值差异。')),
            h('div', { className: 'card' }, h('h3', null, '分型与受累系统'), h('p', null, wb.subject.nf_type), wb.systems.map((s, k) => h('p', { key: k }, '· ' + s.system)), h('p', { className: 'ctx' }, '就诊记录口径；科室为静态信息。'))))
        if (view === 'subtype') return h('div', null, h('h2', null, '病种档案'),
          h('table', null, h('tbody', null,
            h('tr', null, h('th', null, '分型'), h('td', null, wb.subject.nf_type)),
            h('tr', null, h('th', null, '代记主体'), h('td', null, wb.subject.recorder)),
            h('tr', null, h('th', null, '受累系统'), h('td', null, wb.systems.map(s => s.system).join(' · '))),
            h('tr', null, h('th', null, '常见科室'), h('td', null, wb.systems[0]?.department?.replaceAll('/', ' · ') ?? null)))),
          h('p', { className: 'ctx' }, '分型与受累系统为就诊记录口径；不构成就诊建议。'))
        if (view === 'calendar') return h('div', null, h('h2', null, '分年龄段随访日历'),
          wb.ageBands.map(b => h('div', { key: b.band, className: 'fold' },
            h('button', { onClick: () => setFold({ ...fold, [b.band]: !fold[b.band] }) }, h('span', null, (b.title || bands[b.band]) + '（当前）'.replace('（当前）', b.band === 'child' ? '（当前年龄段）' : '')), h('span', null, fold[b.band] ? '⌄' : '›')),
            fold[b.band] && h('div', { className: 'foldbody' }, h('table', null, h('tbody', null, b.items.map((i, k) => h('tr', { key: k },
              h('td', null, i.item_name), h('td', null, i.freq_text), h('td', null, h('span', { className: 'pill' + (i.last_done_at ? ' ok' : '') }, i.last_done_at ? '上次 ' + i.last_done_at : '未记录'))))))),
            b.items[0] && fold[b.band] && h('p', { className: 'ctx', style: { padding: '0 12px 8px' } }, '来源：' + b.items.map(i => i.source_title).filter((v, i2, a) => a.indexOf(v) === i2).join('；')))),
          h('p', { className: 'ctx' }, '「未记录/待预约」只是日历状态，不构成就医建议。'))
        if (view === 'tumors') return h('div', null, h('h2', null, '瘤体档案'),
          h('table', null, h('tbody', null, wb.tumors.map((t, k) => h('tr', { key: k }, h('th', null, t.tumor_no), h('td', null, t.site + ' · ' + t.method + ' · 最近 ' + (t.points.at(-1)?.v ?? '—') + 'mm'))))),
          h(Chart, { series: wb.tumors.filter(t => t.points.length > 1).map(t => ({ name: t.tumor_no + ' ' + t.site, points: t.points.map(p => ({ taken_at: p.taken_at, v: p.value_num })) })) }),
          h('p', { className: 'ctx' }, '趋势仅展示测量值序列；不做良恶性或生长速度判读。'),
          h('h3', null, '指标系列卡（点击 3D 翻转）'),
          Object.entries(wb.metrics.reduce((a, m) => { (a[m.group_title] = a[m.group_title] || []).push(m); return a }, {})).map(([g, ms]) => h('div', { key: g },
            h('h3', null, g), h('div', { className: 'cards' }, ms.map(m => h('div', { key: m.key, className: 'flip' + (flip[m.key] ? ' on' : ''), onClick: () => setFlip({ ...flip, [m.key]: !flip[m.key] }), role: 'button', tabIndex: 0, 'aria-pressed': !!flip[m.key] },
              h('div', { className: 'flip-inner' },
                h('div', { className: 'face' }, h('p', null, m.name), h('p', { style: { fontWeight: 700 } }, (m.points.at(-1)?.value_num ?? '—') + ' ' + (m.unit ?? '')), h('p', { className: 'ctx' }, '翻到背面 ↻')),
                h('div', { className: 'face back' }, h('p', null, '最近记录'), m.points.slice(-3).map((p, k) => h('p', { key: k }, p.taken_at + '：' + p.value_num)), h('p', { className: 'ctx' }, '来源：' + m.source_title)))))))))
        if (view === 'treatment') return h('div', null, h('h2', null, '治疗线'),
          wb.treatmentLines.map(l => h('div', { key: l.id, className: 'fold' },
            h('button', { onClick: () => setFold({ ...fold, ['L' + l.id]: !fold['L' + l.id] }) }, h('span', null, l.line_title), h('span', null, fold['L' + l.id] ? '⌄' : '›')),
            fold['L' + l.id] && h('div', { className: 'foldbody' }, h('table', null, h('tbody', null,
              h('tr', null, h('th', null, '状态'), h('td', null, l.status_text)),
              h('tr', null, h('th', null, '开始'), h('td', null, l.started_at ?? '—')),
              l.sideEffects.map((s, k) => h('tr', { key: k }, h('th', null, '副作用'), h('td', null, s.what + '（发生 ' + s.onset_date + '，记录缓解 ' + (s.eased_date ?? '—') + '）')))))))),
          h('p', { className: 'ctx' }, '「缓解」仅为事件日期记录，不是疗效判断。'))
        if (view === 'genetics') return h('div', null, h('h2', null, '遗传家系'),
          h('p', null, h('button', { onClick: () => setGenOpen(!genOpen) }, genOpen ? '收起私密内容' : '展开私密内容（本页确认）')),
          wb.familyMembers ? h('table', null, h('tbody', null, wb.familyMembers.map((m, k) => h('tr', { key: k }, h('th', null, m.rel), h('td', null, m.note))))) : h('p', { className: 'ctx' }, '私密内容未展开（三出口过滤生效：渲染/导出/AI 均不携带）。'),
          h('h3', null, '遗传咨询问题清单（就诊沟通用）'), h('ol', null, wb.geneticsQuestions.map((q, k) => h('li', { key: k }, q.question))),
          h('p', { className: 'ctx' }, '信息性问题清单，不含概率结论；未核实项如实标注。'))
        if (view === 'review') return h('div', null, h('h2', null, '复诊准备'),
          h('ul', null, wb.reviewNotes.map((n, k) => h('li', { key: k }, n.note))),
          h('p', null, h('button', { onClick: () => fetch('/api/nf/export', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ genetics: genOpen ? 1 : 0 }) }).then(r => r.json()).then(d => navigator.clipboard?.writeText(d.text)) }, '复制成稿'), ' ', h('button', { onClick: () => fetch('/api/nf/agent-context', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ genetics: genOpen ? 1 : 0 }) }).then(r => r.json()).then(d => alert('agent-draft 上下文（34 号）：\n' + JSON.stringify(d, null, 2))) }, 'AI 草稿（携带上下文）')),
          h('p', { className: 'ctx' }, '导出与 AI 上下文与私密区状态同口径。'))
        if (view === 'onechart') return h('div', null, h('h2', null, '一图秀'),
          h('p', null, h('select', { multiple: true, size: Math.min(6, wb.metrics.length), value: sel, onChange: e => setSel([...e.target.selectedOptions].map(o => o.value)) },
            wb.metrics.map(m => h('option', { key: m.key, value: m.key }, m.group_title + ' · ' + m.name + (m.points.length ? '' : '（无记录）'))))),
          h(Chart, { series: wb.metrics.filter(m => sel.includes(m.key)).map(m => ({ name: m.name, points: m.points.map(p => ({ taken_at: p.taken_at, v: p.value_num })) })).filter(s => s.points.length > 1) }),
          h('p', { className: 'ctx' }, '分类字段不进趋势；混合量纲同图并列时纵轴按全体数值域绘制（v0.2 分轴）。'))
        if (view === 'trials') return h('div', null, h('h2', null, '临床研究匹配（演示数据）'),
          h('p', { className: 'ctx' }, '链路：个人基因/病理档案 → 搜索或 AI 协助匹配 → 自带 sqlite 试验库 + 外部工具 → 匹配结果。匹配指数为条件命中占比，不是入组成功率。'),
          wb.trials.map((t, k) => h('div', { key: k, className: 'card', style: { marginBottom: 10 } },
            h('p', { style: { fontWeight: 600 } }, t.nctId + ' · ' + t.title),
            h('p', null, t.phase + ' · ' + t.status + ' · 命中 ' + t.conditions.filter(c => c.state === 'hit').length + '/' + t.conditions.length),
            t.conditions.map((c, k2) => h('p', { key: k2 }, c.text + ' ', h('span', { className: 'pill' + (c.state === 'hit' ? ' ok' : '') }, c.state === 'hit' ? '命中' : c.state === 'miss' ? '不符合' : '档案未记录'))))),
          h('p', { className: 'ctx' }, '「档案未记录」如实显示，不用相邻病种外推；登记状态未核实。'))
        return null
      }
      return h('main', { className: 'wb-nf', 'data-font': large ? 'large' : 'standard' },
        h('style', null, css),
        h('div', { className: 'hd' }, h('b', null, metadata.title), h('span', { 'aria-live': 'polite' }, health ? 'v' + health.version : '版本待连接'), h('span', { className: 'sp' }),
          h('button', { 'aria-pressed': large, onClick: () => setLarge(!large) }, large ? '标准字' : '大字')),
        h('div', { className: 'bd' },
          h('nav', { 'aria-label': '一级导航' }, PAGES.map(([id, label]) => h('button', { key: id, onClick: () => { setView(id); if (id !== 'genetics') setGenOpen(false) }, 'aria-current': view === id ? 'page' : undefined }, label)),
            h('div', { style: { marginTop: 'auto', fontSize: 12.5, color: 'var(--muted)' } }, '小 X 宝家族')),
          h('main', { tabIndex: -1 }, h('h1', null, PAGES.find(p => p[0] === view)[1]), page())),
        h('div', { className: 'ft' }, '小纤宝 FibroPal · 信息整理与就诊准备工具，不提供诊断与治疗建议 · v' + (health?.version ?? '?')))
    }
    function apply(ctx) {
      ctx.effect(() => ctx.desktopWorkbenches.register({ ...metadata, repository: "https://github.com/xyb-openharness-dsh-plugins/neurofibromatosis-workbench", customFrame: PANEL.customFrame, layout: { businessSide: PANEL.businessSide, businessWidth: PANEL.businessWidth } }, Panel))
    }
    return { apply, inject: ['desktopWorkbenches'] }
  }
})
