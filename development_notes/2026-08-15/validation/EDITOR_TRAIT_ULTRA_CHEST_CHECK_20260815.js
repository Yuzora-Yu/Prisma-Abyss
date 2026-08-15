const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '../../../');
let checks = 0;
function ok(cond, msg){ checks++; if(!cond) throw new Error(`CHECK FAILED: ${msg}`); }
function read(name){ return fs.readFileSync(path.join(root,name),'utf8'); }
function loadWindow(files){ const ctx={window:{},console}; vm.createContext(ctx); for(const f of files) vm.runInContext(read(f),ctx,{filename:f}); return ctx.window; }

const dungeon = read('dungeon.js');
const passive = read('passiveSkill.js');
const traitMenu = read('menus_trait_detail.js');
const main = read('main.js');
const jobEditor = read('editor_job_data.html');
const charEditor = read('editor_characters.html');
const itemsWindow = loadWindow(['items.js']);
const dataWindow = loadWindow(['skills.js','job_data.js','characters.js']);
const items = itemsWindow.ITEMS_DATA;
const skills = dataWindow.SKILLS_DATA;
const jobs = dataWindow.JOB_MASTER_DATA;
const jobSkills = dataWindow.JOB_SKILLS_DATA;
const chars = dataWindow.CHARACTERS_DATA;
const skillIds = new Set(skills.map(s=>Number(s.id)));
const jobNames = new Set(jobs.map(j=>String(j.name)));

ok(/ultraRareChestItemIds:\s*Object\.freeze\(\[107,\s*599998,\s*599999,\s*98\]\)/.test(dungeon),'超レア宝箱4種が固定されている');
ok((dungeon.match(/grantUltraRareChestItem\(\)/g)||[]).length >= 2,'通常/赤宝箱の超レア分岐が共通4種プールを使う');
ok(/flash-ultra/.test(dungeon),'超レア枠が専用フラッシュを維持する');
for(const [id,name] of [[107,'転生の実'],[599998,'神鉄の鍛冶台'],[599999,'合成の壺'],[98,'災厄の楔']]){
  const item=items.find(i=>Number(i.id)===id); ok(item && item.name===name,`超レアItem ${id} ${name} が存在する`);
}
const fruit=items.find(i=>Number(i.id)===107); ok(fruit.randomChestDrop===false,'転生の実は通常ランダムアイテム枠から除外されている');

ok(/TRAIT_BOOK_SOURCE\s*=\s*'traitBook'/.test(passive),'特性書由来ソースを保存する');
ok(/source:PassiveSkill\.TRAIT_BOOK_SOURCE/.test(passive),'特性書による追加でロック情報を保存する');
ok(/source:\s*PassiveSkill\.TRAIT_BOOK_SOURCE/.test(passive),'特性書による上書きでロック情報を保存する');
ok(/isTraitBookLockedSlot/.test(traitMenu),'特性再抽選が特性書ロックを確認する');
ok(/lockedTraitIds/.test(main) && /traitBookLocksOverflow/.test(main),'仲間モンスター合成でも特性書ロックを保持する');

for(const [file,src,requiredOut] of [['editor_job_data.html',jobEditor,'job_data.js'],['editor_characters.html',charEditor,'characters.js']]){
  ok(src.includes('<!DOCTYPE html>'),`${file} HTMLとして作成`);
  ok(src.includes('skills.js'),`${file} は skills.js を参照`);
  ok(src.includes(requiredOut),`${file} は ${requiredOut} を出力`);
  const inline=[...src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
  ok(inline.length===1,`${file} のインライン制御スクリプトが1本`);
  new Function(inline[0]); checks++;
}
ok(jobEditor.includes('Lv1～100') && jobEditor.includes('data-level'), 'ジョブエディタはLv1～100を編集可能');
ok(jobEditor.includes('skillLabel') && jobEditor.includes("s.desc||'効果説明なし'"),'ジョブエディタはスキル名と効果を併記');
ok(charEditor.includes('LB 30') || charEditor.includes('lb(30)'), 'キャラエディタはLB30を編集可能');
ok(charEditor.includes('lb(50)') && charEditor.includes('lb(99)'), 'キャラエディタはLB50/99を編集可能');
ok(charEditor.includes('基礎ステータス') && charEditor.includes('jobSelect'),'キャラエディタは職業とステータスを編集可能');
ok(charEditor.includes("s.desc||'効果説明なし'"),'キャラエディタはLBスキル名と効果を併記');

ok(jobs.length>0 && new Set(jobs.map(j=>Number(j.id))).size===jobs.length,'職業IDに重複なし');
for(const job of jobs){ ok(jobSkills[job.name] && typeof jobSkills[job.name]==='object',`JOB_SKILLS ${job.name} が存在`); for(const sid of Object.values(jobSkills[job.name])) ok(skillIds.has(Number(sid)),`${job.name} のSkill ${sid} が存在`); }
for(const c of chars){ if(String(c.job)!=='冒険者') ok(jobNames.has(String(c.job)),`Character ${c.id} ${c.name} の職業がJOB_MASTERに存在`); for(const lv of ['30','50','99']){ const sid=c.lbSkills?.[lv]; if(sid!=null) ok(skillIds.has(Number(sid)),`Character ${c.id} LB${lv} skill ${sid} が存在`); } }

console.log(`EDITOR_TRAIT_ULTRA_CHEST_CHECK: ${checks}/${checks} PASS`);
