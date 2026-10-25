window.__ModuleLoader__.load({
  id: "@xyb-community/neurofibromatosis-workbench",
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const metadata = {"title":"小纤宝 FibroPal 神经纤维瘤病工作台","description":"本机优先的神经纤维瘤病（NF1/NF2相关施万细胞瘤病/施万细胞瘤病）终身随访、瘤体档案、疼痛与听力记录、MEK抑制剂治疗线与遗传咨询准备工作台"}
    const REPO = "https://github.com/xyb-openharness-dsh-plugins/neurofibromatosis-workbench"
    // 面板参数与 lib/layout.js PANEL 一致（test/layout-client-consistency.test.mjs 断言）
    const PANEL = { businessSide: 'left', businessWidth: 0.65, customFrame: false }
    const esc = (x) => String(x ?? '')
    const fmtV = (v) => (Number.isInteger(v) ? v : +Number(v).toFixed(1))
    const css = `
.wb-nf{--ink:#34413c;--muted:#596c62;--line:#dce7df;--card:#fff;--bg:#f7faf8;--accent:#22664e;--accent-soft:#e2f2ea;--warn:#a4561f;
color:var(--ink);background:var(--bg);font:13.5px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
font-variant-numeric:tabular-nums;min-width:0;flex:1;display:flex;flex-direction:column;overflow:auto}
.wb-nf[data-font=large]{font-size:15px}
.wb-nf *{box-sizing:border-box}.wb-nf button,.wb-nf select{font:inherit}
.wb-nf button{cursor:pointer;min-height:32px;border-radius:8px;border:1px solid var(--line);background:var(--card);padding:4px 10px}
.wb-nf .hd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 16px;background:var(--card);border-bottom:1px solid var(--line)}
.wb-nf .hd b{font-size:14px}.wb-nf .hd .sp{flex:1}
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
.wb-nf .pill{display:inline-block;border-radius:999px;padding:0 8px;font-size:12.5px;background:var(--bg);margin:0 4px 4px 0}
.wb-nf .pill.ok{background:var(--accent-soft);color:var(--accent)}
.wb-nf .pill.todo{background:#f7e9dd;color:var(--warn)}
.wb-nf .discuss-btn{border:0;background:none;color:var(--accent);padding:2px 0;min-height:22px}
.wb-nf .sgroup{margin-bottom:18px}.wb-nf .sgroup+h2,.wb-nf .sgroup+h3{margin-top:16px}
.wb-nf .sgh{display:flex;align-items:center;gap:8px;font-size:13px;margin:0 0 10px}
.wb-nf .sgh small{font-weight:400;font-size:12.5px;color:var(--muted);background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:0 8px}
.wb-nf .mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}
.wb-nf .mcard{position:relative;height:176px;max-width:300px;width:100%;border:0;background:none;padding:0;text-align:left;perspective:900px}
.wb-nf .mcard-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.wb-nf .mcard-inner.flipped{transform:rotateY(180deg)}
.wb-nf .mface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;display:flex;flex-direction:column;gap:6px}
.wb-nf .mface.back{transform:rotateY(180deg);background:var(--accent-soft)}
.wb-nf .mcat{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--muted)}
.wb-nf .mcat i,.wb-nf .mname i{width:8px;height:8px;border-radius:3px;display:inline-block}
.wb-nf .mname{font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wb-nf .mname i{margin-right:5px}
.wb-nf .mvalrow{display:flex;align-items:baseline;gap:10px}
.wb-nf .mval{font-size:15px;font-weight:700}.wb-nf .mval small{font-size:12.5px;font-weight:400;color:var(--muted);margin-left:2px}
.wb-nf .mdelta{font-size:12.5px;color:var(--muted)}.wb-nf .mdelta em{font-style:normal;color:var(--ink);font-weight:600}
.wb-nf .mmeta{margin-top:auto;display:flex;justify-content:space-between;gap:6px;font-size:12.5px;color:var(--muted);border-top:1px dashed var(--line);padding-top:4px}
.wb-nf .mmeta>span:first-child{overflow:hidden;text-overflow:ellipsis}
.wb-nf .mmeta .hint{color:var(--accent);white-space:nowrap}
.wb-nf .msp-labels,.wb-nf .mfoot{display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted)}
.wb-nf .mfoot{margin-top:auto;border-top:1px dashed var(--line);padding-top:4px}
.wb-nf .mna{font-size:12.5px;color:var(--muted);margin-top:6px}
.wb-nf svg.chart{width:100%;height:auto;display:block;border:1px solid var(--line);border-radius:10px}
.wb-nf svg.chart text{font-size:12.5px;fill:var(--muted)}
.wb-nf svg.chart .dot{cursor:pointer}
.wb-nf .one-grid{display:grid;grid-template-columns:250px minmax(0,1fr);gap:14px;align-items:start}
.wb-nf .rail{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;position:sticky;top:12px}
.wb-nf .rail h3{font-size:12.5px;letter-spacing:.4px;margin:0 0 8px;color:var(--ink)}
.wb-nf .rail h3 small{font-weight:400;color:var(--muted)}
.wb-nf .rail section+section{margin-top:14px;padding-top:13px;border-top:1px solid #eef1ee}
.wb-nf .chips{display:flex;flex-wrap:wrap;gap:6px}
.wb-nf .chip{min-height:28px;padding:3px 11px;border-radius:20px;font-size:12.5px;background:var(--card);border:1px solid var(--line);color:var(--muted)}
.wb-nf .chip[aria-pressed=true]{background:#2c3a34;border-color:#2c3a34;color:#fff;font-weight:500}
.wb-nf .cat-label{font-size:12.5px;color:var(--muted);letter-spacing:.5px;margin:8px 0 2px}
.wb-nf .metric-pick{display:flex;align-items:center;gap:8px;padding:5px 4px;font-size:12.5px;color:var(--muted);border-radius:8px;cursor:pointer}
.wb-nf .metric-pick:hover{background:var(--bg)}
.wb-nf .metric-pick input{width:14px;height:14px;accent-color:var(--accent);flex:0 0 14px}
.wb-nf .metric-pick i{width:8px;height:8px;border-radius:50%;flex:0 0 8px}
.wb-nf .metric-pick span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wb-nf .metric-pick small{margin-left:auto;font-size:12.5px;color:var(--muted)}
.wb-nf .legend{display:flex;gap:14px;flex-wrap:wrap;margin:8px 0 4px;font-size:12.5px;color:var(--muted)}
.wb-nf .legend span{display:inline-flex;align-items:center;gap:6px}
.wb-nf .legend i{width:9px;height:9px;border-radius:3px;display:inline-block}
.wb-nf .legend b{font-weight:600}
.wb-nf .pinbox{margin-top:10px;background:var(--accent-soft);border:1px solid var(--line);border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start;font-size:12.5px}
.wb-nf .regbadge{color:#fff;border-radius:4px;font-size:12.5px;font-weight:700;padding:1px 6px;letter-spacing:.5px}
.wb-nf .regno{font-weight:600}
.wb-nf .matchbar{flex:1;max-width:260px;height:8px;border-radius:4px;background:var(--bg);border:1px solid var(--line);overflow:hidden}
.wb-nf .matchbar i{display:block;height:100%;background:var(--accent)}
.wb-nf .trial-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.wb-nf .carry{background:var(--bg);border:1px dashed var(--line);border-radius:8px;padding:10px;font-size:12.5px;margin-top:8px;max-height:280px;overflow:auto}
.wb-nf .ft{border-top:1px solid var(--line);background:var(--card);color:var(--muted);font-size:12.5px;padding:6px 16px}
@media (max-width:760px){.wb-nf .one-grid{grid-template-columns:1fr}.wb-nf .rail{position:static}}
@media (prefers-reduced-motion:reduce){.wb-nf .mcard-inner{transition:none}}
`
    /* Fritsch–Carlson 单调保形插值（与原型同口径） */
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
    const PAGES = [['dashboard','看板'],['subtype','病种档案'],['calendar','随访日历'],['tumors','瘤体与指标'],['treatment','治疗线'],['genetics','遗传家系'],['review','复诊准备'],['onechart','一图秀'],['trials','临床研究']]
    const COLOR = { '疼痛系列':'#a4561f','生命体征系列':'#2f6f8f','生长系列':'#22664e','瘤体测量系列':'#7a5aa8','NF2/听力系列（本档案未启用）':'#8a6d3b' }
    const mc = (m) => (m && m.colorKey && COLOR[m.colorKey]) || (m && COLOR[m.group_title]) || '#2f6f8f'

    function Panel() {
      const [wb, setWb] = React.useState(null)
      const [error, setError] = React.useState('')
      const [view, setView] = React.useState('dashboard')
      const [flip, setFlip] = React.useState({})
      const [fold, setFold] = React.useState({ child: true })
      const [genOpen, setGenOpen] = React.useState(false)
      const [large, setLarge] = React.useState(false)
      const [health, setHealth] = React.useState(null)
      const [sel, setSel] = React.useState(null)
      const [range, setRange] = React.useState('all')
      const [tg, setTg] = React.useState({ treatment: true, keypoints: true, changes: true })
      const [pin, setPin] = React.useState(null)
      const [carry, setCarry] = React.useState(null)

      const load = (g) => fetch('/api/nf/workbench' + (g ? '?genetics=1' : ''), { credentials: 'same-origin' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('服务连接失败 ' + r.status)))
        .then(d => { setWb(d); if (sel === null) setSel(d.metrics.filter(m => m.points.length > 1).slice(0, 2).map(m => m.key)) })
        .catch(e => setError(e.message))
      React.useEffect(() => { fetch('/api/nf/health', { credentials: 'same-origin' }).then(r => r.json()).then(setHealth).catch(() => {}); load(false) }, [])
      React.useEffect(() => { if (view === 'genetics') load(genOpen) }, [genOpen])

      const pageCtx = () => {
        const base = { 页面: PAGES.find(p => p[0] === view)[1] }
        if (!wb) return base
        switch (view) {
          case 'dashboard': return { ...base, 分型: wb.subject?.nf_type, 年龄段待办: wb.ageBands[0].items.filter(i => !i.last_done_at).map(i => i.item_name), 瘤体最近值: wb.tumors.map(t => t.tumor_no + ' ' + (t.points.at(-1)?.value_num ?? '—') + 'mm') }
          case 'subtype': return { ...base, 分型: wb.subject?.nf_type, 受累系统: wb.systems.map(s => s.system), 来源: wb.systems[0]?.source_title }
          case 'calendar': return { ...base, 待办: wb.ageBands[0].items.filter(i => !i.last_done_at).map(i => i.item_name + '（' + i.freq_text + '）'), 各段项目数: wb.ageBands.map(b => (b.title || b.band) + ':' + b.items.length) }
          case 'tumors': return { ...base, 瘤体: wb.tumors.map(t => t.tumor_no + ' ' + t.site + ' 最近 ' + (t.points.at(-1)?.value_num ?? '—') + 'mm'), 已选指标: sel }
          case 'treatment': return { ...base, 治疗线: wb.treatmentLines.map(l => l.line_title), 副作用: wb.treatmentLines.flatMap(l => l.sideEffects.map(s => s.what + ' ' + s.onset_date + '→' + (s.eased_date ?? '—'))) }
          case 'genetics': return genOpen ? { ...base, 家系成员: wb.familyMembers?.map(m => m.rel), 问题清单数: wb.geneticsQuestions.length } : { ...base, 家系: '私密区未展开，未携带' }
          case 'review': return { ...base, 复诊要点: wb.reviewNotes.map(n => n.note), 家系: genOpen ? '已展开（携带）' : '私密区未展开，未携带' }
          case 'onechart': return { ...base, 已选指标: sel.map(k => { const m = wb.metrics.find(x => x.key === k); return m ? m.name + ' 最近 ' + (m.points.at(-1)?.value_num ?? '—') : k }), 范围: range }
          case 'trials': return { ...base, 档案摘要: { 分型: wb.subject?.nf_type, 年龄: 9, PN: '有（记录口径）', 既往MEK: '未使用', 基因检测: '未建档' }, 匹配条目: wb.trials.map(t => t.nctId + ' 命中 ' + t.conditions.filter(c => c.state === 'hit').length + '/' + t.conditions.length) }
          default: return base
        }
      }
      const discuss = () => {
        const ctx = pageCtx()
        const prompts = { dashboard: '帮我看看板里的待办和变化，复诊前该准备什么', subtype: '用大白话解释这个分型和受累系统', calendar: '核对当前年龄段随访项目，哪些该预约', tumors: '总结瘤体记录变化，整理成复诊能说清的一段话', treatment: '整理治疗线和副作用时间线', genetics: '准备遗传咨询的问题清单', review: '把复诊准备理成一页', onechart: '解读当前选中指标趋势（只描述，不判断）', trials: '解释这些临床研究条目和匹配依据' }
        const uri = 'xxx:agent-draft?prompt=' + encodeURIComponent(prompts[view] || '帮我看看这页的信息') + '&context=' + encodeURIComponent(JSON.stringify(ctx))
        setCarry({ ctx, uri })
        try { window.location.href = uri } catch (e) { /* 宿主未注册 scheme 时仅展示携带明文 */ }
      }

      if (error) return h('main', { className: 'wb-nf' }, h('style', null, css), h('p', { role: 'status' }, error + '（请确认本机服务已启动）'))
      if (!wb || sel === null) return h('main', { className: 'wb-nf' }, h('style', null, css), h('p', { role: 'status' }, '正在连接本机服务…'))

      const head = (sub) => h('div', null, h('h1', null, PAGES.find(p => p[0] === view)[1]), h('p', { style: { color: 'var(--muted)', fontSize: '12.5px' } }, sub), h('button', { className: 'discuss-btn', onClick: discuss }, '和AI讨论 ↗'), carry && h('div', { className: 'carry' }, h('b', null, '本页携带（agent-draft）'), h('pre', { style: { whiteSpace: 'pre-wrap', fontSize: '12.5px', margin: '4px 0' } }, JSON.stringify(carry.ctx, null, 1)), h('button', { onClick: () => navigator.clipboard?.writeText(carry.uri) }, '复制携带 URI')))

      function Chart({ series, w = 640, hh = 250, showNote = true, dom }) {
        const pad = { l: 16, r: 16, t: 20, b: 36 }
        const dd = dom || (() => {
          const all = series.flatMap(s => s.points.map(p => Date.parse(p.taken_at)))
          if (range === '3m') return [Date.now() - 92 * 864e5, Date.now()]
          if (range === '6m') return [Date.now() - 183 * 864e5, Date.now()]
          if (range === '12m') return [Date.now() - 365 * 864e5, Date.now()]
          return [Math.min(...all), Math.max(...all, Date.now())]
        })()
        const t0 = dd[0], t1 = dd[1]
        const X = d => pad.l + (Date.parse(d) - t0) / Math.max(t1 - t0, 1) * (w - pad.l - pad.r)
        const vis = series.map(s => ({ ...s, pts: s.points.filter(p => { const x = Date.parse(p.taken_at); return x >= t0 && x <= t1 }) })).filter(s => s.pts.length)
        if (!vis.length) return h('p', { className: 'ctx' }, '这个时间窗里没有所选指标：扩大时间范围，或加选一个指标。')
        let out = ''
        for (let i = 0; i <= 3; i++) { const y = pad.t + i * (hh - pad.t - pad.b) / 3; out += '<line x1="' + pad.l + '" x2="' + (w - pad.r) + '" y1="' + y + '" y2="' + y + '" stroke="#dce7df"/>' }
        vis.forEach((sr, si) => {
          const color = sr.color || mc(sr)
          const vals = sr.points.map(p => p.value_num)
          const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || Math.max(Math.abs(hi) * .08, 1)
          const Y = v => hh - pad.b - (v - lo) / span * (hh - pad.t - pad.b)
          const coords = sr.pts.map(p => ({ x: X(p.taken_at), y: Y(p.value_num) }))
          out += '<path d="' + smoothPath(coords.map(o => [o.x, o.y])) + '" fill="none" stroke="' + color + '" stroke-width="2"/>'
          coords.forEach((c, i) => {
            const pt = sr.pts[i], prev = sr.pts[i - 1]; const isLast = i === sr.pts.length - 1
            let tag = ''
            if (prev && tg.changes && Math.abs((pt.value_num - prev.value_num) / Math.max(Math.abs(prev.value_num), 1)) >= .2) {
              const pct = Math.round((pt.value_num - prev.value_num) / Math.abs(prev.value_num) * 100)
              tag += '<text x="' + (c.x + 7).toFixed(1) + '" y="' + (c.y - 8 - (si % 3) * 12).toFixed(1) + '" fill="' + color + '" font-size="10.5">' + (pct > 0 ? '+' : '') + pct + '%</text>'
            }
            if (isLast && tg.keypoints) tag += '<text x="' + (c.x - 5).toFixed(1) + '" y="' + (c.y - 10 - (si % 3) * 13).toFixed(1) + '" text-anchor="end" fill="' + color + '" font-size="11" font-weight="600">' + fmtV(pt.value_num) + '</text>'
            out += '<circle class="dot" data-pin="' + (sr.key || sr.tumor_no) + '|' + pt.taken_at + '" cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (isLast ? 5 : 4) + '" fill="' + color + '"><title>' + esc(sr.name) + ' ' + pt.value_num + ' · ' + pt.taken_at + '</title></circle>' + tag
          })
        })
        const months = []; const cur = new Date(t0); cur.setDate(1)
        while (cur.getTime() <= t1) { if (cur.getTime() >= t0) months.push({ x: X(cur.toISOString().slice(0, 10)), l: (cur.getMonth() + 1) + '月' }); cur.setMonth(cur.getMonth() + 1) }
        out += months.filter((x, i) => months.length > 8 ? i % 2 === 0 : true).map(x => '<text x="' + x.x.toFixed(1) + '" y="' + (hh - 14) + '" text-anchor="middle" font-size="10.5">' + x.l + '</text>').join('')
        return h('div', { dangerouslySetInnerHTML: { __html:
          '<svg class="chart" viewBox="0 0 ' + w + ' ' + hh + '" role="img" aria-label="已选指标趋势；每条线按自身范围绘制，点选可查看数值与来源">' + out
          + (showNote ? '<text x="' + pad.l + '" y="' + (hh - 2) + '" font-size="10.5">↑ 每条线按该指标全部记录范围缩放，不代表不同指标数值可比</text>' : '') + '</svg>'
          + '<div style="font-size:12.5px;color:var(--muted);margin-top:4px">点击曲线上的记录点，可查看数值、日期与来源。</div>'
          + (pin ? pinBox() : '') } })
        function pinBox() {
          const parts = pin.split('|')
          const sr = vis.find(x => (x.key || x.tumor_no) === parts[0])
          const pt = sr && sr.points.find(x => x.taken_at === parts[1])
          if (!pt) return '<div class="pinbox">这个记录点已不在当前时间窗内。</div>'
          return '<div class="pinbox"><div><b>' + esc(sr.name) + ' ' + pt.value_num + '</b><p style="margin:2px 0">' + pt.taken_at + (pt.src ? ' · 来源：' + esc(pt.src) : '') + '</p><p style="margin:2px 0">趋势只用于回顾记录，不构成诊断或疗效判断。</p></div><button data-unpin="1">收起</button></div>'
        }
      }

      const sparkPts = (pts, color) => {
        const w = 200, hh = 56, pad = 8
        const vals = pts.map(x => x.value_num); const lo = Math.min(...vals), hi = Math.max(...vals)
        const span = hi - lo || Math.max(Math.abs(hi) * .08, 1)
        const coords = pts.map((x, i) => ({ x: pad + i * (w - pad * 2) / Math.max(pts.length - 1, 1), y: hh - 12 - (x.value_num - lo) / span * (hh - 24) }))
        const path = pts.length > 1 ? smoothPath(coords.map(o => [o.x, o.y])) : ''
        const last = coords[coords.length - 1]
        return h('div', { dangerouslySetInnerHTML: { __html: '<svg viewBox="0 0 ' + w + ' ' + hh + '" style="width:100%;height:56px" role="img" aria-label="最近 ' + pts.length + ' 次记录折线">'
          + (path ? '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="1.8"/>' : '')
          + coords.map((c, i) => '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="' + (i === coords.length - 1 ? 3.4 : 2.4) + '" fill="' + color + '"/>').join('')
          + '<text x="' + Math.min(last.x, w - 22).toFixed(1) + '" y="' + Math.max(last.y - 8, 10).toFixed(1) + '" text-anchor="middle" fill="' + color + '" font-size="10" font-weight="600">' + fmtV(pts[pts.length - 1].value_num) + '</text></svg>' } })
      }
      const mcard = (m) => {
        const pts = m.points; const last = pts[pts.length - 1], prev = pts[pts.length - 2]
        const color = mc(m); const cat = esc((m.group_title || '').replace('系列', ''))
        const delta = prev ? ('较前次 ' + (last.value_num > prev.value_num ? '↑' : last.value_num < prev.value_num ? '↓' : '→') + ' ' + fmtV(Math.abs(last.value_num - prev.value_num)) + ' ' + esc(m.unit || '')) : '首次记录'
        const on = !!flip[m.key]
        const back = pts.length > 1
          ? [h('span', { className: 'mname', key: 'n' }, h('i', { style: { background: color } }), esc(m.name) + ' · 最近 ' + pts.length + ' 次'),
             h('div', { key: 'sp' }, sparkPts(pts, color)),
             h('span', { className: 'msp-labels', key: 'l' }, h('span', null, (pts[0].taken_at || '').slice(0, 7)), h('span', null, (last.taken_at || '').slice(0, 7))),
             h('span', { className: 'mfoot', key: 'f' }, '仅回顾已记录值 · 点击返回')]
          : [h('span', { className: 'mname', key: 'n' }, h('i', { style: { background: color } }), esc(m.name)),
             h('span', { className: 'mna', key: 'na' }, '只有 ' + pts.length + ' 次记录，暂不连线。', h('br'), '再记录一次后显示趋势。'),
             h('span', { className: 'mfoot', key: 'f' }, '点击返回')]
        return h('button', { className: 'mcard', 'aria-pressed': on, 'aria-label': m.name + '，' + (last ? last.value_num + (m.unit || '') : '无记录') + '；点击翻转',
          onClick: () => setFlip({ ...flip, [m.key]: !on }) },
          h('span', { className: 'mcard-inner' + (on ? ' flipped' : '') },
            h('span', { className: 'mface front' },
              h('span', { className: 'mcat' }, h('i', { style: { background: color } }), cat),
              h('span', { className: 'mname' }, esc(m.name)),
              h('span', { className: 'mvalrow' }, h('span', { className: 'mval' }, last ? fmtV(last.value_num) : '—', h('small', null, esc(m.unit || ''))), h('span', { className: 'mdelta', dangerouslySetInnerHTML: { __html: delta } })),
              h('span', { className: 'mmeta' }, h('span', null, '共 ' + pts.length + ' 次 · ' + (last ? (last.taken_at || '').slice(0, 7) : '—') + (last?.src ? ' · ' + esc(last.src) : '')), h('span', { className: 'hint' }, '翻转 ↗'))),
            h('span', { className: 'mface back' }, back)))
      }

      const groups = [...new Set(wb.metrics.map(m => m.group_title))]
      const selMetrics = wb.metrics.filter(m => sel.includes(m.key))
      const page = () => {
        if (view === 'dashboard') return h('div', null, head('今天的口径：年龄段的下一件事 + 最近变化'),
          h('div', { className: 'cards' },
            h('div', { className: 'card' }, h('h3', null, '待办（儿童期）'), wb.ageBands[0].items.filter(i => !i.last_done_at).map((i, k) => h('p', { key: k }, '· ' + i.item_name)), h('p', { className: 'ctx' }, '来源逐项见「随访日历」。')),
            h('div', { className: 'card' }, h('h3', null, '最近变化（只报数值，不判读）'), wb.tumors.map((t, k) => h('p', { key: k }, t.tumor_no + ' ' + t.site + '：最近 ' + (t.points.at(-1)?.value_num ?? '—') + ' mm')), h('p', { className: 'ctx' }, '变化描述仅陈述记录值差异。')),
            h('div', { className: 'card' }, h('h3', null, '分型与受累系统'), h('p', null, wb.subject.nf_type), wb.systems.map((s, k) => h('p', { key: k }, '· ' + s.system)), h('p', { className: 'ctx' }, '就诊记录口径；科室为静态信息。'))))
        if (view === 'subtype') return h('div', null, head('分型与受累系统 · 来源语境'),
          h('table', null, h('tbody', null,
            h('tr', null, h('th', null, '分型'), h('td', null, wb.subject.nf_type)),
            h('tr', null, h('th', null, '代记主体'), h('td', null, wb.subject.recorder)),
            h('tr', null, h('th', null, '受累系统'), h('td', null, wb.systems.map(s => s.system).join(' · '))),
            h('tr', null, h('th', null, '常见科室'), h('td', null, wb.systems[0]?.department?.replaceAll('/', ' · ') ?? null)))),
          h('p', { className: 'ctx' }, '分型与受累系统为就诊记录口径；不构成就诊建议。'))
        if (view === 'calendar') return h('div', null, head('按年龄段分节 · 每项带来源'),
          wb.ageBands.map(b => h('div', { key: b.band, className: 'card', style: { marginBottom: 8 } },
            h('button', { style: { width: '100%', display: 'flex', justifyContent: 'space-between', border: 0, background: 'none', fontWeight: 600 } , onClick: () => setFold({ ...fold, [b.band]: !fold[b.band] }) }, h('span', null, (b.title || b.band) + (b.band === 'child' ? '（当前年龄段）' : '')), h('span', null, fold[b.band] ? '⌄' : '›')),
            fold[b.band] && h('table', null, h('tbody', null, b.items.map((i, k) => h('tr', { key: k },
              h('td', null, i.item_name), h('td', null, i.freq_text),
              h('td', { style: { fontSize: '12.5px', color: 'var(--muted)' } }, i.source_title + (i.source_version ? '' : '（未核实）')),
              h('td', null, h('span', { className: 'pill' + (i.last_done_at ? ' ok' : '') }, i.last_done_at ? '上次 ' + i.last_done_at : '未记录')))))))),
          h('p', { className: 'ctx' }, '「未记录/待预约」只是日历状态，不构成就医建议。'))
        if (view === 'tumors') return h('div', null, head('瘤体档案 + 指标系列（原位翻转卡）'),
          h('div', { className: 'card', style: { marginBottom: 14 } }, h('h3', null, '瘤体档案（编号为聚合键）'),
            h('table', null, h('tbody', null, wb.tumors.map((t, k) => h('tr', { key: k }, h('th', null, t.tumor_no), h('td', null, t.site + ' · ' + t.method + ' · 最近 ' + (t.points.at(-1)?.value_num ?? '—') + 'mm（' + (t.points.at(-1)?.taken_at ?? '').slice(0, 7) + '）'))))),
            h(Chart, { series: wb.tumors.filter(t => t.points.length > 1).map(t => ({ name: t.tumor_no + ' ' + t.site, key: t.tumor_no, points: t.points.map(p => ({ taken_at: p.taken_at, value_num: p.value_num })) })) }),
            h('p', { className: 'ctx' }, '趋势仅展示测量值序列；不做良恶性或生长速度判读。')),
          groups.map(g => { const ms = wb.metrics.filter(m => m.group_title === g); return h('div', { className: 'sgroup', key: g },
            h('div', { className: 'sgh' }, h('b', null, g), h('small', null, ms.length + ' 项')),
            h('div', { className: 'mgrid' }, ms.map(m => mcard({ ...m, colorKey: g, points: m.points.map(p => ({ taken_at: p.taken_at, value_num: p.value_num, src: m.source_title })) })))) }))
        if (view === 'treatment') return h('div', null, head('治疗线折叠卡 · 副作用时间线'),
          wb.treatmentLines.map(l => h('div', { key: l.id, className: 'card', style: { marginBottom: 8 } },
            h('button', { style: { width: '100%', display: 'flex', justifyContent: 'space-between', border: 0, background: 'none', fontWeight: 600 }, onClick: () => setFold({ ...fold, ['L' + l.id]: !fold['L' + l.id] }) }, h('span', null, l.line_title), h('span', null, fold['L' + l.id] ? '⌄' : '›')),
            fold['L' + l.id] && h('table', null, h('tbody', null,
              h('tr', null, h('th', null, '状态'), h('td', null, l.status_text)),
              h('tr', null, h('th', null, '开始'), h('td', null, l.started_at ?? '—')),
              l.sideEffects.map((s, k) => h('tr', { key: k }, h('th', null, '副作用'), h('td', null, s.what + '（发生 ' + s.onset_date + '，记录缓解 ' + (s.eased_date ?? '—') + '）'))))))),
          h('p', { className: 'ctx' }, '「缓解」仅为事件日期记录，不是疗效判断。'))
        if (view === 'genetics') return h('div', null, head('家系成员（私密）· 遗传咨询问题清单'),
          h('p', null, h('button', { onClick: () => setGenOpen(!genOpen) }, genOpen ? '收起私密内容' : '展开私密内容（本页确认）')),
          wb.familyMembers ? h('table', null, h('tbody', null, wb.familyMembers.map((m, k) => h('tr', { key: k }, h('th', null, m.rel), h('td', null, m.note))))) : h('p', { className: 'ctx' }, '私密内容未展开（三出口过滤生效：渲染/导出/AI 均不携带）。'),
          h('h3', null, '遗传咨询问题清单（就诊沟通用）'), h('ol', null, wb.geneticsQuestions.map((q, k) => h('li', { key: k }, q.question))),
          h('p', { className: 'ctx' }, '信息性问题清单，不含概率结论；未核实项如实标注。'))
        if (view === 'review') return h('div', null, head('间隔期变化 + 要问的问题'),
          h('ul', null, wb.reviewNotes.map((n, k) => h('li', { key: k }, n.note))),
          h('p', null, h('button', { onClick: () => fetch('/api/nf/export', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ genetics: genOpen ? 1 : 0 }) }).then(r => r.json()).then(d => navigator.clipboard?.writeText(d.text)) }, '复制成稿')),
          h('p', { className: 'ctx' }, '导出与 AI 上下文与私密区状态同口径。'))
        if (view === 'onechart') return h('div', null, head('选指标 · 一张图看趋势'),
          h('div', { className: 'one-grid' },
            h('aside', { className: 'rail', 'aria-label': '一图秀筛选项' },
              h('section', null, h('h3', null, '时间范围'), h('div', { className: 'chips' },
                [['3m', '近 3 月'], ['6m', '近 6 月'], ['12m', '近 12 月'], ['all', '全部']].map(x => h('button', { key: x[0], className: 'chip', 'aria-pressed': range === x[0], onClick: () => setRange(x[0]) }, x[1])))),
              h('section', null, h('h3', null, '选择指标 ', h('small', null, '最多 4 个 · 已选 ' + sel.length)),
                groups.map(g => h('div', { key: g }, h('div', { className: 'cat-label' }, g),
                  wb.metrics.filter(m => m.group_title === g).map(m => h('label', { key: m.key, className: 'metric-pick' },
                    h('input', { type: 'checkbox', checked: sel.includes(m.key), onChange: (e) => {
                      if (e.target.checked) { if (sel.length >= 4) return; setSel([...sel, m.key]) } else setSel(sel.filter(x => x !== m.key))
                    } }),
                    h('i', { style: { background: mc(m) } }), h('span', null, m.name),
                    h('small', null, m.points.length ? fmtV(m.points.at(-1).value_num) : '—'))))),
                h('p', { className: 'ctx' }, '点选后图表立即更新。')),
              h('section', null, h('h3', null, '显示内容'), h('div', { className: 'chips' },
                h('button', { className: 'chip', 'aria-pressed': tg.treatment, onClick: () => setTg({ ...tg, treatment: !tg.treatment }) }, '治疗节点'),
                h('button', { className: 'chip', 'aria-pressed': tg.keypoints, onClick: () => setTg({ ...tg, keypoints: !tg.keypoints }) }, '关键点数值'),
                h('button', { className: 'chip', 'aria-pressed': tg.changes, onClick: () => setTg({ ...tg, changes: !tg.changes }) }, '变化 ≥20%')))),
            h('section', { className: 'card' },
              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, h('h3', { style: { margin: 0 } }, '病程时间轴'), h('span', { className: 'pill' }, sel.length + ' 个指标')),
              h('div', { className: 'legend' }, selMetrics.filter(m => m.points.length).map(m => {
                const vals = m.points.map(p => p.value_num)
                return h('span', { key: m.key }, h('i', { style: { background: mc(m) } }), h('b', null, m.name), ' ' + fmtV(vals[vals.length - 1]) + ' ' + esc(m.unit || ''), h('span', { style: { color: 'var(--muted)', fontSize: '12.5px' } }, ' 全期 ' + fmtV(Math.min(...vals)) + '–' + fmtV(Math.max(...vals))))
              })),
              h(Chart, { series: selMetrics.map(m => ({ name: m.name, key: m.key, color: mc(m), points: m.points.map(p => ({ taken_at: p.taken_at, value_num: p.value_num, src: m.source_title })) })) }),
              h('p', { className: 'ctx' }, '分类字段不进趋势；混合量纲同图并列时每条线按自身记录范围缩放。'))))
        if (view === 'trials') {
          const flagColor = { CN: '#a4561f', EU: '#2f6f8f', JP: '#22664e' }
          const STATE = { hit: 'met', miss: 'unmet', unknown: 'unknown' }
          const NAME = { met: ['符合', 'ok'], unmet: ['不符合', 'todo'], unknown: ['待确认', ''] }
          const match = (t) => {
            const evals = t.conditions.map(c => {
              let p = {}
              try { p = JSON.parse(c.text) } catch { p = { cat: c.text.split('：')[0], need: c.text.split('：').slice(1).join('：'), actual: '见记录' } }
              return { c: { ...p, state: c.state }, state: STATE[c.state] || 'unknown' }
            })
            const met = evals.filter(x => x.state === 'met').length
            const unmet = evals.filter(x => x.state === 'unmet').length
            const unknown = evals.filter(x => x.state === 'unknown').length
            const pct = Math.round(met / Math.max(1, met + unmet + unknown) * 100)
            const hardUnmet = evals.filter(x => x.state === 'unmet' && x.c.hard)
            const band = hardUnmet.length ? 'ineligible' : (pct >= 80 && unknown <= 1) ? 'high' : pct >= 55 ? 'partial' : 'needs_info'
            return { t, evals, met, unmet, unknown, pct, band }
          }
          const BANDS = { high: '高度符合', partial: '部分符合', needs_info: '需补充信息', ineligible: '硬性条件不满足' }
          const icon = st => st === 'met' ? h('span', { className: 'pill ok', style: { margin: 0 } }, '✓') : st === 'unmet' ? h('span', { className: 'pill todo', style: { margin: 0 } }, '✕') : h('span', { className: 'pill', style: { margin: 0 } }, '?')
          const card = (m) => {
            const t = m.t
            const order = { unmet: 0, unknown: 1, met: 2 }
            const sorted = [...m.evals].sort((x, y) => order[x.state] - order[y.state])
            const top = sorted.slice(0, 4), rest = sorted.slice(4)
            const critLine = (e, i) => h('div', { className: 'critline', key: i, style: { display: 'flex', gap: 8, alignItems: 'baseline', fontSize: '12.5px' } },
              icon(e.state),
              h('span', { style: { flex: 1 } }, h('b', null, (e.c.kind === 'exclude' ? '排除' : '入组') + ' · ' + (e.c.cat || '条件')), e.c.hard ? h('span', { style: { color: 'var(--warn)', fontSize: '12.5px' } }, ' 硬性') : null, '：' + (e.c.need || '')),
              h('span', { style: { color: 'var(--muted)', fontSize: '12.5px' } }, '记录里是：' + (e.c.actual || '见记录') + ' → ' + h('b', null, NAME[e.state][0])))
            return h('div', { className: 'card', key: t.nctId, style: { marginBottom: 12 } },
              h('div', { className: 'trial-top' },
                h('span', { className: 'regbadge', style: { background: flagColor[t.flag] || '#5b6470' } }, t.flag || '—'),
                h('span', { className: 'regno' }, t.nctId), h('span', { className: 'pill' }, t.phase),
                t.kind && h('span', { className: 'pill' }, t.kind),
                h('span', { style: { marginLeft: 'auto', fontSize: '12.5px', color: 'var(--muted)' } }, t.registered ? '注册 ' + t.registered : h('b', { style: { color: 'var(--warn)' } }, '未核验'))),
              h('p', { style: { fontWeight: 600, margin: '6px 0 4px' } }, t.title),
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' } },
                h('div', { className: 'matchbar' }, h('i', { style: { width: m.pct + '%' } })),
                h('b', { style: { fontSize: '15px', color: 'var(--accent)' } }, m.pct + '%'),
                h('span', { className: 'pill' + (m.band === 'high' ? ' ok' : m.band === 'partial' ? '' : ' todo') }, BANDS[m.band]),
                h('span', { className: 'pill ok' }, '符合 ' + m.met),
                m.unmet ? h('span', { className: 'pill todo' }, '不符合 ' + m.unmet) : null,
                m.unknown ? h('span', { className: 'pill' }, '待确认 ' + m.unknown) : null,
                t.sourceUrl ? h('a', { className: 'discuss-btn', href: t.sourceUrl, target: '_blank', rel: 'noreferrer', style: { marginLeft: 'auto' } }, '登记原文 ↗') : null),
              h('div', null, top.map(critLine)),
              rest.length ? h('details', null, h('summary', { className: 'discuss-btn', style: { display: 'inline' } }, '其余 ' + rest.length + ' 条条件'), h('div', null, rest.map(critLine))) : null,
              h('p', { className: 'ctx' }, '粗筛符合度 = 符合项 ÷ 已对照项（符合+不符合+待确认）。未知项按 0 计，因此只会偏低、不会偏高。这不是入组资格，也不代表效果。'))
          }
          const all = wb.trials.map(match)
          const fit = all.filter(m => m.band !== 'ineligible').sort((x, y) => y.pct - x.pct)
          const bad = all.filter(m => m.band === 'ineligible')
          return h('div', null, head('建档 → 匹配 → 结果（粗筛符合度）'),
            h('div', { className: 'card', style: { marginBottom: 12 } }, h('h3', null, '用来对照的档案事实'),
              h('table', null, h('tbody', null, [
                ['分型', wb.subject?.nf_type || '未记录'], ['年龄', '9 岁（档案登记）'],
                ['丛状神经纤维瘤（PN）', wb.tumors.some(t => /丛状/.test(t.site)) ? '有（' + wb.tumors.find(t => /丛状/.test(t.site)).site + '，记录口径）' : '未记录'],
                ['既往 MEK 抑制剂', wb.treatmentLines.some(l => /司美替尼|Mirdametinib|MEK/.test(l.line_title) && !/未开始/.test(l.line_title)) ? '有记录' : '未使用（用药线记录）'],
                ['基因检测', '未建档（未检测的位点不显示为阴性）']
              ].map((f, k) => h('tr', { key: k }, h('th', { style: { width: 180 } }, f[0]), h('td', null, f[1]))))),
              h('p', { className: 'ctx' }, '每一项都来自你的记录；没记的写「未记录」。')),
            h('p', { className: 'ctx', style: { border: 0, margin: '0 0 10px' } }, '条目为真实登记信息（nf_trials_2026.sqlite · 快照见设置页）；招募状态登记库未给出的一律「未核验」，不显示「招募中」。是否参加由患者与主诊医生决定。'),
            h('h3', null, '按当前记录能对上的（' + fit.length + '）'),
            fit.map(card),
            bad.length ? h('details', null, h('summary', { className: 'discuss-btn', style: { display: 'inline' } }, '硬性条件不满足的 ' + bad.length + ' 条（点开看是哪一条挡住了）'), bad.map(card)) : null)
        }
        return null
      }
      const onClick = (e) => {
        const unpin = e.target.closest('[data-unpin]'); if (unpin) { setPin(null); return }
        const dot = e.target.closest('svg .dot[data-pin]'); if (dot) { setPin(dot.getAttribute('data-pin')); return }
      }
      return h('main', { className: 'wb-nf', 'data-font': large ? 'large' : 'standard', onClick },
        h('style', null, css),
        h('div', { className: 'hd' }, h('b', null, metadata.title), h('span', { 'aria-live': 'polite' }, health ? 'v' + health.version : '版本待连接'), h('span', { className: 'sp' }),
          h('button', { 'aria-pressed': large, onClick: () => setLarge(!large) }, large ? '标准字' : '大字')),
        h('div', { className: 'bd' },
          h('nav', { 'aria-label': '一级导航' }, PAGES.map(([id, label]) => h('button', { key: id, onClick: () => { setView(id); if (id !== 'genetics') setGenOpen(false); setCarry(null) }, 'aria-current': view === id ? 'page' : undefined }, label)),
            h('div', { style: { marginTop: 'auto', fontSize: '12.5px', color: 'var(--muted)' } }, '小 X 宝家族')),
          h('main', { tabIndex: -1 }, page())),
        h('div', { className: 'ft' }, '小纤宝 FibroPal · 信息整理与就诊准备工具，不提供诊断与治疗建议 · v' + (health?.version ?? '?')))
    }
    function apply(ctx) {
      ctx.effect(() => ctx.desktopWorkbenches.register({ ...metadata, repository: "https://github.com/xyb-openharness-dsh-plugins/neurofibromatosis-workbench", customFrame: PANEL.customFrame, layout: { businessSide: PANEL.businessSide, businessWidth: PANEL.businessWidth } }, Panel))
    }
    return { apply, inject: ['desktopWorkbenches'] }
  }
})
