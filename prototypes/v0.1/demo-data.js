/* 小纤宝 FibroPal · 演示数据（唯一源：所有页面/导出/Agent 草稿均读本文件，不另设副本） */
window.NF_DEMO = {
  version: '0.1.0',
  profile: { name: '林小满', meta: '9 岁 · NF1（记录主体：妈妈代记）', avatar: '满' },
  subtype: {
    type: 'NF1（1 型神经纤维瘤病）',
    systems: ['皮肤（咖啡牛奶斑）', '外周神经（丛状神经纤维瘤）', '骨骼（脊柱侧弯随访中）', '眼科（视力监测至 8 岁口径，继续按年查）'],
    sourceNote: '分型与受累系统为就诊记录口径；来源：神经纤维瘤病诊疗指南（2025 年版）· 语境栏见设置页',
    departments: ['皮肤科', '神经外科', '骨科', '眼科'] // 静态转介信息，非建议
  },
  ageBands: [
    { id: 'child', title: '儿童期（当前年龄段）', active: true, items: [
      { name: '血压测量', freq: '每次随诊/每年', source: 'Ⅰ型 NF1 多学科诊治指南（2023 版）', done: '2026-10-02' },
      { name: '身高体重与发育', freq: '每年', source: '同上', done: '2026-10-02' },
      { name: '眼科（视力/视野等）', freq: '每年（监测至 8 岁口径，遵门诊安排）', source: '神经纤维瘤病诊疗指南（2025 年版）', done: '2026-09-18' },
      { name: '皮肤与神经系统查体', freq: '每年', source: '2023 版多学科指南', done: '2026-10-02' },
      { name: '脊柱（侧弯随访）', freq: '按骨科安排', source: '2023 版多学科指南', done: '2026-06-30', todo: true }
    ]},
    { id: 'teen', title: '青春期', active: false, items: [
      { name: '容貌困扰与心理支持', freq: '按需', source: '2023 版多学科指南（口径待临床核对）', done: null },
      { name: '血压筛查（肾动脉狭窄警惕项，仅监测）', freq: '每年', source: '2023 版多学科指南', done: null }
    ]},
    { id: 'adult', title: '成年期', active: false, items: [
      { name: '血压（成人每年；NF1 成人高血压比例较高，仅监测记录）', freq: '每年', source: '2025 版指南', done: null },
      { name: '瘤体变化自查记录', freq: '每 6–12 个月门诊评估间的自测记录', source: '2025 版指南（口径待临床核对）', done: null }
    ]}
  ],
  tumors: [
    { id: 'T-01', site: '左颈部（丛状）', method: 'MRI 测量', series: [[2024, 3, 42], [2024, 9, 45], [2025, 3, 47], [2025, 9, 49], [2026, 3, 50], [2026, 9, 52]] },
    { id: 'T-02', site: '右前臂皮下', method: '体表测量（软尺）', series: [[2025, 1, 18], [2025, 7, 19], [2026, 1, 19], [2026, 7, 20]] },
    { id: 'T-03', site: '背部皮下', method: '体表测量（软尺）', series: [[2025, 3, 11], [2026, 3, 11]] }
  ],
  metricSeries: [
    { id: 'pain', group: '疼痛系列', name: 'NRS 疼痛评分（0–10）', unit: '分', kind: 'number', source: '通用量表（版本未核实）', color: '#a4561f', series: [[2026, 4, 3], [2026, 5, 4], [2026, 6, 4], [2026, 7, 5], [2026, 8, 4], [2026, 9, 6], [2026, 10, 5]] },
    { id: 'bp-sys', group: '生命体征系列', name: '收缩压', unit: 'mmHg', kind: 'number', source: '2023 版多学科指南（每年监测口径）', color: '#2f6f8f', series: [[2026, 1, 96], [2026, 4, 98], [2026, 7, 99], [2026, 10, 100]] },
    { id: 'bp-dia', group: '生命体征系列', name: '舒张压', unit: 'mmHg', kind: 'number', source: '同上', color: '#5b8a97', series: [[2026, 1, 60], [2026, 4, 61], [2026, 7, 62], [2026, 10, 62]] },
    { id: 'weight', group: '生长系列', name: '体重', unit: 'kg', kind: 'number', color: '#3e7d5a', source: '2023 版多学科指南（每年监测）', series: [[2024, 10, 24.5], [2025, 10, 28.0], [2026, 4, 29.2], [2026, 10, 30.5]] },
    { id: 'height', group: '生长系列', name: '身高', unit: 'cm', kind: 'number', source: '2023 版多学科指南（每年监测）', color: '#22664e', series: [[2024, 10, 126.5], [2025, 10, 132.0], [2026, 10, 137.5]] },
    { id: 'tumor-t01', group: '瘤体测量系列', name: 'T-01 左颈部长径', unit: 'mm', kind: 'number', source: 'MRI 报告数值', color: '#7a5aa8', series: null /* 引用 tumors[0].series */ },
    { id: 'tumor-t02', group: '瘤体测量系列', name: 'T-02 右前臂长径', unit: 'mm', kind: 'number', source: '体表测量记录', color: '#9a7ab8', series: null /* 引用 tumors[1].series */ },
    { id: 'tumor-t03', group: '瘤体测量系列', name: 'T-03 背部长径', unit: 'mm', kind: 'number', source: '体表测量记录', color: '#b8a1d1', series: null /* 引用 tumors[2].series */ },
    { id: 'hearing-l', group: 'NF2/听力系列（本档案未启用）', name: '左耳 PTA', unit: 'dB HL', kind: 'number', source: 'WHO WRH 2021 分级口径', color: '#8a6d3b', series: [] }
  ],
  treatmentLines: [
    { id: 'TL-1', title: '观察随访线（当前）', rows: [['状态', '按年随访中'], ['开始', '2023-06'], ['最近评估', '2026-10-02 · 门诊']] },
    { id: 'TL-2', title: '司美替尼（科赛优®）治疗线（未开始）', rows: [['适应症口径', 'NMPA 2023-05 批准：3 岁及以上症状性、无法手术的丛状神经纤维瘤 NF1 儿童及青少年'], ['状态', '本档案未使用（演示占位）'], ['副作用记录', '——']] }
  ],
  sideEffects: [
    { date: '2026-09-12', what: '皮肤干燥（演示数据）', onset: '2026-09-12', eased: '2026-09-20', line: '观察随访线' }
  ],
  genetics: {
    members: [
      { rel: '本人（患儿）', note: 'NF1 临床诊断记录', private: true },
      { rel: '妈妈（代记人）', note: '未见相关体征记录（就诊口径）', private: true },
      { rel: '弟弟', note: '新生儿期未见体征（就诊口径）', private: true }
    ],
    questions: [
      '我们家庭再生育时，就诊时应该安排哪些检查？由哪个科室对接？',
      '孩子成年后如果计划生育，需要提前准备哪些档案材料？',
      '家系其他成员什么情况下建议就诊评估？'
    ],
    qaSource: '遗传咨询问题清单为就诊沟通用信息性问题（改写示意），不包含概率结论；来源：神经纤维瘤病诊疗指南（2025 年版）遗传部分 · 逐条临床核对待 M2 评审'
  },
  records: [
    { file: 'MRI 报告 2026-09', type: '影像', status: '候选已核对' },
    { file: '生长曲线 2026-10', type: '门诊记录', status: '草稿待核对' }
  ],
  reviewNotes: [
    '间隔期变化：T-01 长径 50→52mm（两次 MRI）；NRS 均值较上季度升高。',
    '待问医生：背部新发皮下结节数量是否需要记录进档案；脊柱侧弯随访时间。',
    '带材料：最近两次 MRI 报告、生长曲线、血压记录表。'
  ],
  trials: [
    { reg: 'CTR20200357', registry: '中国药物临床试验登记', flag: 'CN', title: 'selumetinib（司美替尼）治疗神经纤维瘤病的1期研究', phase: 'I 期', kind: '干预性', registered: '未核实', url: 'https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml',
      matchScore: 75, matchDetail: [['诊断类型', 'NF1', true], ['丛状神经纤维瘤（PN）', '有（记录口径）', true], ['既往 MEK 抑制剂', '未使用', true], ['年龄/入组状态', '登记库未给出', null]] },
    { reg: 'CTR20202330', registry: '中国药物临床试验登记', flag: 'CN', title: 'FCN-159 片（国产 MEK 抑制剂）在1型神经纤维瘤病患者中的I/II期临床试验', phase: 'I/II 期', kind: '干预性', registered: '未核实', url: 'https://www.chinadrugtrials.org.cn/clinicaltrials.searchlistdetail.dhtml',
      matchScore: 50, matchDetail: [['诊断类型', 'NF1', true], ['既往 MEK 抑制剂', '未使用', true], ['瘤体类型', '登记库未给出', null], ['年龄', '登记库未给出', null]] },
    { reg: 'ChiCTR2000036770', registry: 'ChiCTR（中国临床试验注册中心）', flag: 'CN', title: '基于液体活检外泌体建立司美替尼治疗丛状神经纤维瘤的预测模型（观察性）', phase: '观察性', kind: '观察性研究', registered: '2020-08-25', url: 'https://trialsearch.who.int/Trial2.aspx?TrialID=ChiCTR2000036770',
      matchScore: 50, matchDetail: [['诊断类型', 'NF1 · 丛状神经纤维瘤', true], ['拟行司美替尼治疗', '未开始（记录口径）', true], ['液体活检标本', '档案未记录', null], ['年龄', '登记库未给出', null]] },
    { reg: 'CTIS2023-507336-20-00', registry: 'EU CTIS（欧盟）', flag: 'EU', title: 'KOMET：司美替尼治疗成人症状性不可手术丛状神经纤维瘤 NF1 的 III 期随机双盲安慰剂对照研究', phase: 'III 期', kind: '干预性', registered: '2024-04-11', url: 'https://trialsearch.who.int/Trial2.aspx?TrialID=CTIS2023-507336-20-00',
      matchScore: 50, matchDetail: [['诊断类型', 'NF1 · 丛状神经纤维瘤', true], ['既往 MEK 抑制剂', '未使用', true], ['年龄', '成人（本档案 9 岁）', false], ['不可手术', '记录口径相符', true]] },
    { reg: 'JPRN-jRCT2041210036', registry: 'jRCT（日本）', flag: 'JP', title: 'KOMET：司美替尼治疗症状性不可手术丛状神经纤维瘤 NF1 的全球有效性研究', phase: 'III 期', kind: '干预性', registered: '2021-06-24', url: 'https://trialsearch.who.int/Trial2.aspx?TrialID=JPRN-jRCT2041210036',
      matchScore: 50, matchDetail: [['诊断类型', 'NF1 · 丛状神经纤维瘤', true], ['症状性不可手术', '记录口径相符', true], ['年龄', '登记库未给出', null], ['既往 MEK 抑制剂', '未使用', true]] },
    { reg: 'CTIS2025-522000-24-00', registry: 'EU CTIS（欧盟）', flag: 'EU', title: 'MEK-NF1-104：Mirdametinib 治疗婴幼儿 NF1 相关丛状神经纤维瘤的 1B 期开放标签研究', phase: '1B 期', kind: '干预性', registered: '2025-08-11', url: 'https://trialsearch.who.int/Trial2.aspx?TrialID=CTIS2025-522000-24-00',
      matchScore: 25, matchDetail: [['诊断类型', 'NF1 · 丛状神经纤维瘤', true], ['年龄', '婴幼儿（本档案 9 岁）', false], ['既往 MEK 抑制剂', '未使用', true], ['营养/喂养评估', '不适用', null]] }
  ]
};
