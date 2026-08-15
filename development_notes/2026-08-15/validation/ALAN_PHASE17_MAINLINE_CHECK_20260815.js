'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const story = read('story.js');
const logic = read('story_logic.js');
const main = read('main.js');
const jobs = read('job_data.js');
const skills = read('skills.js');
const map = read('map.js');
const dungeon = read('dungeon.js');
const monsters = read('monsters.js');
const roadmap = read('canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md');
const scenarioCanon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const handoff = read('canon/PRISMA_CODING_HANDOFF_v5.md');
const news = read('news.js');

const checks = [];
const check = (name, cond) => {
  checks.push([name, !!cond]);
  if (!cond) process.exitCode = 1;
};
const ordered = (source, tokens) => {
  let at = -1;
  for (const token of tokens) {
    const next = source.indexOf(token, at + 1);
    if (next < 0) return false;
    at = next;
  }
  return true;
};
const block = (source, start, end) => {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  return a >= 0 && b > a ? source.slice(a, b) : '';
};

const immediate = block(story, "abyss_jasper_clear: {", "abyss_illuminacia_battle:");
const deferred = block(story, "abyss_legacion_alan_rejoin_phase8f: {", "const spiritTrialPartyDialoguePhase17");
const awakening = '光の加護が真にアランの心身と重なり合い、アランは光魔剣士として覚醒した！';
const sequence = [
  "{type:'ALLY',charId:201,joinParty:true,available:true}",
  "{type:'CONV',value:'ABYSS_JASPER_ALAN_AWAKENING_PHASE8F'}",
  "{type:'SET_JOB',charId:201,job:'光魔剣士',syncSkills:true}",
  "{type:'STORY_EXP',charId:201,amount:1000000,rewardKey:'alan_jagorea_join_1000k'}"
];
check('Alan awakening exact system text exists', story.includes(awakening));
check('Immediate Jasper rejoin order = ALLY -> awakening -> SET_JOB -> EXP', ordered(immediate, sequence));
check('Deferred Legacion rejoin order = ALLY -> awakening -> SET_JOB -> EXP', ordered(deferred, sequence));
check('Generic SET_JOB story action exists', logic.includes("if (action.type === 'SET_JOB')") && logic.includes('App.setStoryCharacterJob'));
check('Persistent story job override exists', main.includes('jobOverride: null') && main.includes('setStoryCharacterJob:') && main.includes('getExpectedStoryCharacterJob:'));
check('Startup job repair respects story override', (main.match(/getExpectedStoryCharacterJob\(c\)/g) || []).length >= 2);
check('Old-save Alan awakening migration exists and is invoked', main.includes('migrateAlanLightMagicKnightAwakeningV1:') && main.includes('App.migrateAlanLightMagicKnightAwakeningV1(data);'));
check('Old-save migration does not reference awakening conversation', !block(main, 'migrateAlanLightMagicKnightAwakeningV1:', 'migrateWaterCityRiotRouteV1:').includes('ABYSS_JASPER_ALAN_AWAKENING_PHASE8F'));
check('Light Magic Knight job table exists', jobs.includes('"光魔剣士": {'));

const lightJobBlock = block(jobs, '"光魔剣士": {', '"忍者": {');
const jobSkillIds = [...lightJobBlock.matchAll(/"\d+"\s*:\s*(\d+)/g)].map(m => Number(m[1]));
const skillIds = new Set([...skills.matchAll(/[\"']?id[\"']?\s*:\s*(\d+)/g)].map(m => Number(m[1])));
check('Light Magic Knight provisional skill table has skills', jobSkillIds.length >= 10);
check('Every Light Magic Knight skill ID exists', jobSkillIds.every(id => skillIds.has(id)));

check('Roadmap fixes Alan awakening before +1m EXP', roadmap.includes('光魔剣士へ恒久職変更') && roadmap.indexOf('光魔剣士へ恒久職変更') < roadmap.indexOf('+1,000,000EXP'));
check('Canon no longer marks Alan Light Magic Knight timing undecided', !/アラン.{0,40}(?:光魔剣士|職).{0,30}(?:未確定|未決定|要検討)/s.test(scenarioCanon + '\n' + handoff));

check('Fixed dungeon links support requiredFlags', dungeon.includes('isFixedFloorLinkUnlocked:') && dungeon.includes('link.requiredFlags'));
check('Final altar route requires Illuminacia, all six spirit trials, and the Cycle Crystal', map.includes("requiredFlags: ['abyssIlluminaciaDefeated','abyssAllSpiritTrialsCleared','abyssCycleCrystalCreated']"));
const finalEvent = block(story, 'abyss_final_altar_encounter: {', 'abyss_vegnasis_battle:');
check('Final altar event itself guards all spirit trials and the Cycle Crystal', finalEvent.includes("key:'abyssAllSpiritTrialsCleared'") && finalEvent.includes("key:'abyssCycleCrystalCreated'"));
check('Vegnasis remains five wedges', finalEvent.includes('value:[302080,302081,302082,302083,302084]') && !finalEvent.includes('302085'));
check('Veld remains the dark fifth wedge', monsters.includes('\"id\":302084') && monsters.includes('\"name\":\"闇柱ヴェルド\"') && monsters.includes('\"vegnasisElement\":\"闇\"'));
check('Jasper is not a Vegnasis wedge', !/\"id\":302060[^\n]*linkedBattleGroup\":\"vegnasis\"/.test(monsters));

check('2026/08/15 NEWS_DATA remains one record', (news.match(/date:\s*"2026\/08\/15"/g) || []).length === 1);

for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
console.log(`TOTAL=${checks.length} FAIL=${checks.filter(([,ok]) => !ok).length}`);
if (process.exitCode) process.exit(process.exitCode);
