const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const root = process.cwd();
const read = name => fs.readFileSync(`${root}/${name}`, 'utf8');
const checks = [];
const ok = (name, cond) => {
  assert.ok(cond, name);
  checks.push(name);
};

const jobSource = read('job_data.js');
const mainSource = read('main.js');
const battleSource = read('battle.js');
const menuSource = read('menus_ally_detail.js');
const newsSource = read('news.js');
const equipSource = read('equips.js');
const skillSource = read('skills.js');
const monsterSource = read('monsters.js');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(jobSource, sandbox, { filename: 'job_data.js' });
vm.runInContext(equipSource, sandbox, { filename: 'equips.js' });
vm.runInContext(skillSource, sandbox, { filename: 'skills.js' });
vm.runInContext(monsterSource, sandbox, { filename: 'monsters.js' });

// 職業固有特性は仕様確定前のため未実装へ戻す。
ok('JOB_IDENTITY_DATA is not implemented', !sandbox.window.JOB_IDENTITY_DATA);
ok('hunter job remains', !!sandbox.window.JOB_SKILLS_DATA['狩人']);
ok('magic archer job remains', !!sandbox.window.JOB_SKILLS_DATA['魔弓使い']);
ok('light magic knight job remains', !!sandbox.window.JOB_SKILLS_DATA['光魔剣士']);
ok('main job identity helper removed', !mainSource.includes('getJobIdentityDefinition: (jobName)'));
ok('main job combat helper removed', !mainSource.includes('getJobIdentityCombatModifiers: (charData)'));
ok('calcStats job identity layer removed', !mainSource.includes('s.jobIdentity = jobIdentity ?'));
ok('battle job combat helper removed', !battleSource.includes('getJobDamagePct: (actor, effectType, element'));
ok('battle job heal modifier removed', !battleSource.includes("Battle.getJobCombatValue(actor, 'healPct')"));
ok('battle job debuff modifier removed', !battleSource.includes("Battle.getJobCombatValue(actor, 'debuffSuccessPct')"));
ok('ally detail job identity panel removed', !menuSource.includes('職特性：${jobIdentity.role || c.job}'));
ok('news no longer claims job identities', !newsSource.includes('職業固有の戦闘特性を追加しました'));

// EXP式: effectiveLevel = 表示Lv + 転生回数*100 を維持。
ok('effective level formula remains', mainSource.includes('const eL = level + reincCount * 100;'));
ok('reincarnation curve exponent remains', mainSource.includes('const P_REINC = 0.6;'));
ok('reincarnation step rate remains', mainSource.includes('const REINC_STEP_RATE = 0.05;'));
ok('replacement reincarnation multiplier removed', !mainSource.includes('firstFive * 0.40'));
ok('replacement reincarnation cap removed', !mainSource.includes('Math.min(20, Math.max(0, reincCount))'));
ok('display Lv49 wall is reapplied', mainSource.includes('if (level === 49) needExp *= WALL_50;'));
ok('display Lv99 wall is reapplied', mainSource.includes('else if (level === 99) needExp *= WALL_100;'));
ok('Lv50/100 stat milestone uses display level', mainSource.includes('if (charData.level === 50 || charData.level === 100)'));

// main.js 本体の getNextExp を抽出して、独立計算だけでなく実装そのものも検証する。
const expMatch = mainSource.match(/getNextExp:\s*((?:\(charData\))\s*=>\s*\{[\s\S]*?\n\t\}),\n\n    checkNewSkill/);
ok('main getNextExp function can be extracted', !!expMatch);
const expSandbox = {
  CONST: { EXP_BASE: 100, RARITY_EXP_MULT: { N: 1, R: 1, SR: 1.4, SSR: 1.6, UR: 2, EX: 2.5 } },
  PassiveSkill: { getSumValue: () => 0 },
  App: {
    getReincarnationEquivalentCount: c => Number(c.reincarnationCount || 0),
    getCharacterExpRequirementMultiplierPct: c => Number(c.expMultiplierPct || 100)
  }
};
vm.createContext(expSandbox);
const actualGetNextExp = vm.runInContext(`(${expMatch[1]})`, expSandbox);

function legacyBaseExpRaw(level, reinc) {
  const BASE_EXP = 100;
  const P_EARLY = 0.8;
  const TARGET_49 = 30000;
  const WALL_50 = 5;
  const WALL_100 = 5;
  const TARGET_99 = 150000;
  const P_AFTER_50 = 1.3;
  const P_REINC = 0.6;
  const REINC_STEP_RATE = 0.05;
  const eL = level + reinc * 100;
  const xp10 = BASE_EXP * Math.pow(10, P_EARLY);
  const B = (TARGET_49 - xp10) / Math.pow(49 - 10, 2);
  const xp49 = xp10 + B * Math.pow(49 - 10, 2);
  const base50 = xp49;
  const S = (TARGET_99 - base50) / Math.pow(99 - 50, P_AFTER_50);
  const xp99 = base50 + S * Math.pow(99 - 50, P_AFTER_50);
  const base100 = xp99;
  let need;
  if (eL <= 10) need = BASE_EXP * Math.pow(eL, P_EARLY);
  else if (eL <= 48) need = xp10 + B * Math.pow(eL - 10, 2);
  else if (eL === 49) need = xp49 * WALL_50;
  else if (eL <= 98) need = base50 + S * Math.pow(eL - 50, P_AFTER_50);
  else if (eL === 99) need = xp99 * WALL_100;
  else {
    const step101 = base100 * REINC_STEP_RATE;
    need = base100 + step101 * Math.pow(eL - 100, P_REINC);
  }
  return need;
}

function legacyBaseExp(level, reinc) {
  return Math.ceil(legacyBaseExpRaw(level, reinc));
}

function correctedExp(level, reinc) {
  const BASE_EXP = 100;
  const P_EARLY = 0.8;
  const TARGET_49 = 30000;
  const WALL_50 = 5;
  const WALL_100 = 5;
  const TARGET_99 = 150000;
  const P_AFTER_50 = 1.3;
  const P_REINC = 0.6;
  const REINC_STEP_RATE = 0.05;
  const eL = level + reinc * 100;
  const xp10 = BASE_EXP * Math.pow(10, P_EARLY);
  const B = (TARGET_49 - xp10) / Math.pow(49 - 10, 2);
  const xp49 = xp10 + B * Math.pow(49 - 10, 2);
  const base50 = xp49;
  const S = (TARGET_99 - base50) / Math.pow(99 - 50, P_AFTER_50);
  const xp99 = base50 + S * Math.pow(99 - 50, P_AFTER_50);
  const base100 = xp99;
  let need;
  if (eL <= 10) need = BASE_EXP * Math.pow(eL, P_EARLY);
  else if (eL <= 49) need = xp10 + B * Math.pow(eL - 10, 2);
  else if (eL <= 99) need = base50 + S * Math.pow(eL - 50, P_AFTER_50);
  else {
    const step101 = base100 * REINC_STEP_RATE;
    need = base100 + step101 * Math.pow(eL - 100, P_REINC);
  }
  if (level === 49) need *= WALL_50;
  else if (level === 99) need *= WALL_100;
  return Math.ceil(need);
}

// 非節目は旧式と完全一致。2〜5転生を明示比較する。
for (const reinc of [2,3,4,5]) {
  for (const level of [1,10,25,48,50,75,98]) {
    ok(`reinc${reinc} Lv${level} matches legacy effective-level curve`, correctedExp(level, reinc) === legacyBaseExp(level, reinc));
  }
  ok(`reinc${reinc} Lv49 wall is legacy raw base x5`, correctedExp(49, reinc) === Math.ceil(legacyBaseExpRaw(49, reinc) * 5));
  ok(`reinc${reinc} Lv99 wall is legacy raw base x5`, correctedExp(99, reinc) === Math.ceil(legacyBaseExpRaw(99, reinc) * 5));
  ok(`reinc${reinc} Lv49 wall exceeds next level`, correctedExp(49, reinc) > correctedExp(50, reinc));
  ok(`reinc${reinc} Lv99 wall exceeds previous level`, correctedExp(99, reinc) > correctedExp(98, reinc));
}

ok('base Lv49 wall remains 150000', correctedExp(49, 0) === 150000);
ok('base Lv99 wall remains 750000', correctedExp(99, 0) === 750000);
ok('reinc2 Lv1 retains old 269579', correctedExp(1, 2) === 269579);
ok('reinc3 Lv1 retains old 330709', correctedExp(1, 3) === 330709);
ok('reinc4 Lv1 retains old 380251', correctedExp(1, 4) === 380251);
ok('reinc5 Lv1 retains old 423495', correctedExp(1, 5) === 423495);
for (const reinc of [0,2,3,4,5]) {
  for (const level of [1,48,49,50,98,99]) {
    const actual = actualGetNextExp({ level, reincarnationCount: reinc, rarity: 'N', expMultiplierPct: 100 });
    ok(`actual main getNextExp reinc${reinc} Lv${level}`, actual === correctedExp(level, reinc));
  }
}

// データ健全性監査は前回分を維持。
const weaponBands = [1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200];
for (const weaponType of ['剣','斧','短剣','杖','槍','弓']) {
  const ranks = new Set((sandbox.window.EQUIP_MASTER || [])
    .filter(eq => eq.type === '武器' && eq.baseName === weaponType && Number(eq.rank) <= 200)
    .map(eq => Number(eq.rank)));
  ok(`${weaponType} weapon progression has no rank-band gap`, weaponBands.every(rank => ranks.has(rank)));
}
const skillIds = new Set((sandbox.window.SKILLS_DATA || []).map(skill => Number(skill.id)));
const missingMonsterActionIds = [];
for (const monster of (sandbox.MONSTERS_DATA || [])) {
  for (const action of (monster.acts || [])) {
    if (Number(action?.id) > 0 && !skillIds.has(Number(action.id))) missingMonsterActionIds.push(`${monster.id}:${action.id}`);
  }
}
ok('all monster action skill IDs resolve', missingMonsterActionIds.length === 0);
ok('2026/08/15 news remains single record', (newsSource.match(/date:\s*"2026\/08\/15"/g) || []).length === 1);
ok('news no longer claims reincarnation formula replacement', !newsSource.includes('転生後の必要経験値曲線を調整しました'));

console.log(`NONMAP_GAMEPLAY_LOGIC_CHECK: ${checks.length}/${checks.length} PASS`);
checks.forEach((name, i) => console.log(`${String(i + 1).padStart(2, '0')}. PASS ${name}`));
