/* 0002 · 临床研究条目元数据（0001 冻结后追加，只增不改）
 * source_url  登记原文链接（CTR/ChiCTR/CTIS/jRCT 等）
 * kind        干预性 / 观察性研究
 * registered  注册日期（登记库未给出为 NULL，UI 显示「未核实」）
 * flag        地区徽标 CN / EU / JP / …
 * 不设入组成功率/疗效类列；匹配指数由读模型按 trial_matches 命中占比现算。 */
ALTER TABLE trials ADD COLUMN source_url TEXT;
ALTER TABLE trials ADD COLUMN kind TEXT;
ALTER TABLE trials ADD COLUMN registered TEXT;
ALTER TABLE trials ADD COLUMN flag TEXT;
