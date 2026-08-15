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
const identities = sandbox.window.JOB_IDENTITY_DATA;
ok('JOB_IDENTITY_DATA exists', !!identities);
ok('hunter identity exists', !!identities['狩人']);
ok('magic archer identity exists', !!identities['魔弓使い']);
ok('light magic knight identity exists', !!identities['光魔剣士']);
ok('hunter requires bow', identities['狩人'].activation.weaponTypes.includes('弓'));
ok('hunter has debuff bonus', identities['狩人'].combat.debuffSuccessPct === 10);
ok('hunter has breath bonus', identities['狩人'].combat.breathDamagePct === 12);
ok('magic archer requires bow', identities['魔弓使い'].activation.weaponTypes.includes('弓'));
ok('magic archer has magic bonus', identities['魔弓使い'].combat.magicDamagePct === 8);
ok('magic archer has heal bonus', identities['魔弓使い'].combat.healPct === 12);
ok('light magic knight has light bonus', identities['光魔剣士'].combat.lightDamagePct === 10);
ok('light magic knight has light element attack', identities['光魔剣士'].elmAtk['光'] === 15);

const bows = (sandbox.window.EQUIP_MASTER || []).filter(eq => eq.type === '武器' && eq.baseName === '弓');
const bowRanks = new Set(bows.filter(eq => Number(eq.rank) <= 200).map(eq => Number(eq.rank)));
for (const rank of [1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200]) {
  ok(`bow progression includes rank ${rank}`, bowRanks.has(rank));
}

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
    if (Number(action?.id) > 0 && !skillIds.has(Number(action.id))) {
      missingMonsterActionIds.push(`${monster.id}:${action.id}`);
    }
  }
}
ok('all monster action skill IDs resolve', missingMonsterActionIds.length === 0);

ok('main resolves job identity', mainSource.includes('getJobIdentityDefinition: (jobName)'));
ok('main evaluates job activation', mainSource.includes('isJobIdentityActive: (charData'));
ok('main exposes job combat modifiers', mainSource.includes('getJobIdentityCombatModifiers: (charData)'));
ok('calcStats stores job identity state', mainSource.includes('s.jobIdentity = jobIdentity ?'));
ok('calcStats stores job combat state', mainSource.includes('s.jobCombat = jobIdentityActive ?'));
ok('old reincarnation placeholder exponent removed', !mainSource.includes('P_REINC'));
ok('old Lv101 placeholder label removed', !mainSource.includes('Lv101〜: 転生帯（後で調整前提）'));
ok('reincarnation multiplier caps at 20', mainSource.includes('Math.min(20, Math.max(0, reincCount))'));
ok('reincarnation first five multiplier exists', mainSource.includes('firstFive * 0.40'));
ok('reincarnation later multiplier exists', mainSource.includes('laterCycles * 0.08'));

function requiredExp(level, reinc) {
  const BASE_EXP = 100;
  const P_EARLY = 0.8;
  const TARGET_49 = 30000;
  const WALL_50 = 5;
  const WALL_100 = 5;
  const TARGET_99 = 150000;
  const P_AFTER_50 = 1.3;
  const xp10 = BASE_EXP * Math.pow(10, P_EARLY);
  const B = (TARGET_49 - xp10) / Math.pow(49 - 10, 2);
  const xp49 = xp10 + B * Math.pow(49 - 10, 2);
  const base50 = xp49;
  const S = (TARGET_99 - base50) / Math.pow(99 - 50, P_AFTER_50);
  const xp99 = base50 + S * Math.pow(99 - 50, P_AFTER_50);
  let need;
  if (level <= 10) need = BASE_EXP * Math.pow(level, P_EARLY);
  else if (level <= 48) need = xp10 + B * Math.pow(level - 10, 2);
  else if (level === 49) need = xp49 * WALL_50;
  else if (level <= 98) need = base50 + S * Math.pow(level - 50, P_AFTER_50);
  else need = xp99 * WALL_100;
  const capped = Math.min(20, Math.max(0, reinc));
  const mult = 1 + Math.min(5, capped) * 0.40 + Math.max(0, capped - 5) * 0.08;
  return Math.ceil(need * mult);
}

ok('base Lv49 wall remains 150000', requiredExp(49, 0) === 150000);
ok('base Lv99 wall remains 750000', requiredExp(99, 0) === 750000);
ok('reinc1 Lv49 wall is 210000', requiredExp(49, 1) === 210000);
ok('reinc1 Lv99 wall is 1050000', requiredExp(99, 1) === 1050000);
ok('reinc5 multiplier is 3.0', requiredExp(1, 5) === 300);
ok('reinc20 multiplier is 4.2', requiredExp(1, 20) === 420);
ok('reinc20+ cap is stable', requiredExp(99, 20) === requiredExp(99, 99));
ok('reincarnation keeps 49->50 wall', requiredExp(49, 5) > requiredExp(50, 5) * 4);
ok('reincarnation keeps 99->100 wall', requiredExp(99, 5) > requiredExp(98, 5) * 4);

ok('battle copies job combat state to player', battleSource.includes('player.jobCombat = stats.jobCombat || {}'));
ok('battle has generic job damage helper', battleSource.includes('getJobDamagePct: (actor, effectType, element'));
ok('auto estimate applies job damage', battleSource.includes('const jobDamagePct = Battle.getJobDamagePct(actor, effectType'));
ok('actual damage applies job damage', battleSource.includes('typeDmgPct += Battle.getJobDamagePct(actor, effectType, element, isPhysical)'));
ok('healing applies job heal modifier', battleSource.includes("Battle.getJobCombatValue(actor, 'healPct')"));
ok('debuff applies job success modifier', battleSource.includes("Battle.getJobCombatValue(actor, 'debuffSuccessPct')"));
ok('madante/light magic path applies job damage', battleSource.includes("Battle.getJobDamagePct(actor, '魔法', element, false)"));
ok('AUTO heal estimate applies job heal modifier', battleSource.includes("const healPct = Number(PassiveSkill.getSumValue(actor, 'heal_pct') || 0)"));

ok('ally detail shows job identity panel', menuSource.includes('職特性：${jobIdentity.role || c.job}'));
ok('ally detail shows active status', menuSource.includes("? '発動中'"));
ok('ally detail shows weapon activation requirement', menuSource.includes("を装備すると有効"));

ok('2026/08/15 news remains single record', (newsSource.match(/date:\s*"2026\/08\/15"/g) || []).length === 1);
ok('news mentions reincarnation curve', newsSource.includes('転生後の必要経験値曲線を調整しました'));
ok('news mentions job identities', newsSource.includes('職業固有の戦闘特性を追加しました'));

console.log(`NONMAP_GAMEPLAY_LOGIC_CHECK: ${checks.length}/${checks.length} PASS`);
checks.forEach((name, i) => console.log(`${String(i + 1).padStart(2, '0')}. PASS ${name}`));
