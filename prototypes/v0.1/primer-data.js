/* 36 号 · 疾病概要数据（小纤宝 FibroPal · 神经纤维瘤病）
 * 唯一内容来源：本仓 README.md 的「? 疾病概要」四段 + docs/SOURCES.md（N01–N06）+ docs/CLINICAL-DATA.md。
 * 只做公开信息的事实整理：不写个人判定、不复制指南条文、不载剂量与方案。
 * 链接均用 primer-backfill-2026-10-27/verify-links.mjs 实测，只有 OK 写入；
 * 拿不到可验证链接的如实 nolink + note（原因见各条）。
 */
window.DISEASE_PRIMER = {
  brand: '小纤宝 FibroPal',
  name: '神经纤维瘤病',
  en: 'Neurofibromatosis（NF1 / NF2-related schwannomatosis / schwannomatosis）',
  updated: '2026-10-27',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: '神经纤维瘤病（NF）为一组多系统受累、需终身随访的罕见病。本仓 README 与 docs/SOURCES.md 采用名称级三型口径：NF1、NF2 相关施万细胞瘤病、施万细胞瘤病。',
      points: [
        'NF1：1 型神经纤维瘤病；本仓演示档案的分型记录口径为 NF1。',
        'NF2 相关施万细胞瘤病（NF2-related schwannomatosis）：docs/SOURCES.md N04 登记的现行国际命名口径；NF2 相关施万细胞瘤病与施万细胞瘤病分别登记。',
        '本仓围绕瘤体档案、疼痛与听力记录、分龄随访、治疗线与遗传咨询准备整理病程资料。',
        '受累系统按就诊记录登记，例如皮肤（咖啡牛奶斑）、外周神经（丛状神经纤维瘤）、骨骼、眼科；具体到个人的判断不在本台范围。'
      ],
      sources: [
        { org: '国家卫生健康委', doc: '86 个罕见病病种诊疗指南（2025 年版）', version: '2025-07-10 发布',
          original: false, kind: 'hub', secondaryUrl: 'https://www.gov.cn/lianbo/bumen/202507/content_7031427.htm',
          note: '官网 PDF 直链实测 HTTP 200 但无 DOM 文本（THIN），本台以中国政府网通知页为可验证二次来源' },
        { org: 'GenTURIS 共识', doc: 'NF2 相关施万细胞瘤病命名与诊断共识（Genetics in Medicine）', version: '2022',
          nolink: true, note: 'docs/SOURCES.md N04 已核实；未存 DOI / 全文链接' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '本台只登记文件名称、版本与取得状态，不复制指南条文；「原件」列的链接均经实测。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台用途'],
        rows: [
          ['国家卫生健康委', '86 个罕见病病种诊疗指南（2025 年版）· 收录神经纤维瘤病', '2025-07-10 发布',
            { text: '未取得可验证原件 · 中国政府网通知页', kind: 'hub', url: 'https://www.gov.cn/lianbo/bumen/202507/content_7031427.htm' },
            '本病种中文主口径（README 与 CLINICAL-DATA 引用）'],
          ['国家卫生健康委', '儿童及青少年神经纤维瘤病诊疗规范（2021 年版）', '2021 版',
            { text: '未取得原件', nolink: true, note: 'docs/SOURCES.md N02 已核实版本；未存官方公开链接，本轮未取得可验证直链' },
            '儿童期随访项目的版本参照'],
          ['北京协和医院', 'Ⅰ型神经纤维瘤病多学科诊治指南（2023 版）', '2023 版',
            { text: '已取得：期刊全文页', kind: 'fulltext', url: 'https://jrd.pumch.cn/article/doi/10.12376/j.issn.2097-0501.2023.02.009' },
            'NF1 多学科随访与科室口径参照'],
          ['GenTURIS 共识', 'NF2 相关施万细胞瘤病命名与诊断共识（Genetics in Medicine）', '2022',
            { text: '未取得原件', nolink: true, note: 'docs/SOURCES.md N04 已核实；未存 DOI / 全文链接' },
            'NF2 更名与命名口径参照'],
          ['WHO', 'World Report on Hearing', '2021',
            { text: '未取得原件 · WHO 出版页', kind: 'hub', url: 'https://www.who.int/publications/i/item/9789240020481' },
            '纯音听阈分级（较好耳 PTA）口径参照'],
          ['NMPA', '司美替尼（科赛优®）批准信息', '2023-05-08',
            { text: '未取得原件', nolink: true, note: '阿斯利康中国公告实测 403（AUTH）；未取得药监局可验证批件直链' },
            '治疗线名称级参照']
        ]
      },
      sources: [
        { org: '国家卫生健康委', doc: '86 个罕见病病种诊疗指南（2025 年版）', version: '2025-07-10 发布',
          original: false, kind: 'hub', secondaryUrl: 'https://www.gov.cn/lianbo/bumen/202507/content_7031427.htm' },
        { org: '国家卫生健康委', doc: '儿童及青少年神经纤维瘤病诊疗规范（2021 年版）', version: '2021 版',
          nolink: true, note: 'docs/SOURCES.md N02 仅登记名称与版本；未存官方公开链接' },
        { org: '北京协和医院', doc: 'Ⅰ型神经纤维瘤病多学科诊治指南（2023 版）', version: '2023 版',
          original: true, kind: 'fulltext', url: 'https://jrd.pumch.cn/article/doi/10.12376/j.issn.2097-0501.2023.02.009' },
        { org: 'GenTURIS 共识', doc: 'NF2 相关施万细胞瘤病命名与诊断共识（Genetics in Medicine）', version: '2022',
          nolink: true, note: 'docs/SOURCES.md N04 仅登记期刊与年份；未存 DOI / 全文链接' },
        { org: 'WHO', doc: 'World Report on Hearing', version: '2021',
          original: false, kind: 'hub', secondaryUrl: 'https://www.who.int/publications/i/item/9789240020481',
          note: 'WHO 出版页（页内提供 PDF 下载）；本台未单独存档 PDF' },
        { org: 'NMPA', doc: '司美替尼（科赛优®）批准公告', version: '2023-05-08',
          nolink: true, note: '阿斯利康中国公告实测 403（AUTH）；未取得药监局可验证批件直链' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: '以下只按 README 与 docs/CLINICAL-DATA.md 已登记的名称级信息分组，不排优劣、不载剂量与方案。',
      groups: [
        { label: '局部处理', points: [
          '手术：README / CLINICAL-DATA 名称级登记；适用情形与取舍由主管医生判断。'
        ] },
        { label: '药物治疗（MEK 抑制剂）', points: [
          '司美替尼（科赛优®）：NMPA 2023-05 批准用于 3 岁及以上症状性、无法手术的丛状神经纤维瘤 NF1 儿童及青少年（名称级登记）。',
          '国产 MEK 抑制剂芦沃美替尼：docs/CLINICAL-DATA.md 登记为「申报中」，申报状态待核。'
        ] },
        { label: '随访与监测', points: [
          '分龄随访项目：每年血压、身高体重与发育、皮肤与神经系统查体；儿童视力监测按指南 2025 版「至 8 岁」口径继续按年查。',
          '瘤体按编号测量并记录长径（MRI 或体表软尺）；疼痛用 NRS 记录；听力按 WHO WRH 2021 分级口径记录（本档案 NF2/听力系列未启用）。'
        ] }
      ],
      points: [
        '以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
      ],
      sources: [
        { org: '国家卫生健康委', doc: '86 个罕见病病种诊疗指南（2025 年版）', version: '2025-07-10 发布',
          original: false, kind: 'hub', secondaryUrl: 'https://www.gov.cn/lianbo/bumen/202507/content_7031427.htm' },
        { org: '国家卫生健康委', doc: '儿童及青少年神经纤维瘤病诊疗规范（2021 年版）', version: '2021 版',
          nolink: true, note: 'docs/SOURCES.md N02 仅登记名称与版本；未存官方公开链接' },
        { org: '北京协和医院', doc: 'Ⅰ型神经纤维瘤病多学科诊治指南（2023 版）', version: '2023 版',
          original: true, kind: 'fulltext', url: 'https://jrd.pumch.cn/article/doi/10.12376/j.issn.2097-0501.2023.02.009' },
        { org: 'NMPA', doc: '司美替尼（科赛优®）批准公告', version: '2023-05-08',
          nolink: true, note: '阿斯利康中国公告实测 403（AUTH）；未取得药监局可验证批件直链' },
        { org: 'WHO', doc: 'World Report on Hearing', version: '2021',
          original: false, kind: 'hub', secondaryUrl: 'https://www.who.int/publications/i/item/9789240020481',
          note: 'WHO 出版页（页内提供 PDF 下载）；本台未单独存档 PDF' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '只列已发生的事实与日期，不预测、不评价。',
      points: [
        '指南版本更替：儿童及青少年神经纤维瘤病诊疗规范（2021 年版）→ Ⅰ型神经纤维瘤病多学科诊治指南（2023 版）→ 86 个罕见病病种诊疗指南（2025 年版，2025-07-10 发布，收录神经纤维瘤病）。',
        '监管批件：2023-05-08，NMPA 批准司美替尼（科赛优®）用于 3 岁及以上症状性、无法手术的丛状神经纤维瘤 NF1 儿童及青少年。',
        '分类与命名：GenTURIS 共识（Genetics in Medicine，2022）采用 NF2-related schwannomatosis 命名；docs/SOURCES.md N04 已据此更正旧口径。',
        '登记规模：截至 2026-10-25，本仓实采神经纤维瘤病相关临床试验登记 364 条（chinadrugtrials 17 条 + ICTRP 347 条，登记号无跨源重复）；状态一律「登记状态，未核实」。',
        '申报状态：国产 MEK 抑制剂芦沃美替尼，docs/CLINICAL-DATA.md 截至 2026-10-25 登记为「申报中」，申报状态待核。'
      ],
      sources: [
        { org: '国家卫生健康委', doc: '86 个罕见病病种诊疗指南（2025 年版）', version: '2025-07-10 发布',
          original: false, kind: 'hub', secondaryUrl: 'https://www.gov.cn/lianbo/bumen/202507/content_7031427.htm' },
        { org: '北京协和医院', doc: 'Ⅰ型神经纤维瘤病多学科诊治指南（2023 版）', version: '2023 版',
          original: true, kind: 'fulltext', url: 'https://jrd.pumch.cn/article/doi/10.12376/j.issn.2097-0501.2023.02.009' },
        { org: 'NMPA', doc: '司美替尼（科赛优®）批准公告', version: '2023-05-08',
          nolink: true, note: '阿斯利康中国公告实测 403（AUTH）；未取得药监局可验证批件直链' },
        { org: 'GenTURIS 共识', doc: 'NF2 相关施万细胞瘤病命名与诊断共识（Genetics in Medicine）', version: '2022',
          nolink: true, note: 'docs/SOURCES.md N04 仅登记期刊与年份；未存 DOI / 全文链接' },
        { org: '本仓自采', doc: '神经纤维瘤病临床试验登记快照（chinadrugtrials + ICTRP）', version: '2026-10-25',
          nolink: true, note: '快照存于 research/neurofibromatosis/（jsonl + sqlite + manifest），无公开 URL，仅在仓内可核' }
      ]
    }
  ]
}
