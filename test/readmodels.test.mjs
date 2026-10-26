import { test } from 'node:test';
import { openDatabase, migrate, close } from '../dsh/store.js';
import { seedDemo } from '../dsh/demo.js';
import { readWorkbench, readExport, agentContext } from '../dsh/readmodels.js';
const open = () => { const db = openDatabase(':memory:'); migrate(db); seedDemo(db); return db; };
test('演示种子落库且读模型可读', () => {
  const db = open();
  const wb = readWorkbench(db);
  if (wb.subject?.nf_type !== 'NF1（1 型神经纤维瘤病）') throw new Error('分型不对: ' + wb.subject?.nf_type);
  if (!wb.tumors.length || !wb.ageBands[0].items.length) throw new Error('瘤体/日历为空');
  close(db);
});
test('私密三出口：默认不携带，geneticsOpen=1 才携带', () => {
  const db = open();
  const off = readWorkbench(db);
  const on = readWorkbench(db, { geneticsOpen: true });
  if (off.familyMembers !== null) throw new Error('渲染出口默认应过滤');
  if (!on.familyMembers?.length) throw new Error('开放后应可见');
  if (!readExport(db).includes('私密区未展开')) throw new Error('导出出口未过滤');
  if (readExport(db, { geneticsOpen: true }).includes('妈妈')) { /* 携带属预期 */ } else throw new Error('导出开放后未携带');
  if (agentContext(db).家系 !== '（私密区未展开，未携带）') throw new Error('AI 出口未过滤');
  close(db);
});
test('分类不进趋势：series 仅 numeric 指标有 points', () => {
  const db = open();
  const wb = readWorkbench(db);
  const qual = wb.metrics.filter(m => m.kind !== 'numeric');
  for (const m of qual) if (m.points.length) throw new Error('分类指标带了数值序列');
  const empty = wb.metrics.find(m => m.name.includes('PTA'));
  if (empty.points.length !== 0) throw new Error('无记录系列应如实为空');
  close(db);
});
test('空库（真机 profile 初始态）读模型不炸且集合为空数组', async () => {
  const { openDatabase, migrate } = await import('../dsh/store.js');
  const { readWorkbench } = await import('../dsh/readmodels.js');
  const db = openDatabase(':memory:');
  migrate(db);
  const wb = readWorkbench(db);
  if (wb.subject !== null) throw new Error('空库 subject 应为 null');
  for (const k of ['metrics','tumors','ageBands','treatmentLines','geneticsQuestions','reviewNotes','trials','systems']) {
    if (!Array.isArray(wb[k])) throw new Error(`${k} 应为数组`);
  }
  if (wb.ageBands.length !== 3) throw new Error('三个年龄段段位应齐全');
  if (wb.treatmentLines.length !== 0) throw new Error('治疗线应为空数组');
});

test('seedDemo 写入 demo_meta，读模型带 demo 标记', async () => {
  const { openDatabase, migrate } = await import('../dsh/store.js');
  const { seedDemo } = await import('../dsh/demo.js');
  const { readWorkbench } = await import('../dsh/readmodels.js');
  const db = openDatabase(':memory:');
  migrate(db); seedDemo(db);
  const wb = readWorkbench(db);
  if (wb.demo !== true) throw new Error('demo 标记应为 true');
  if (!wb.subject) throw new Error('种子后应有 subject');
});
