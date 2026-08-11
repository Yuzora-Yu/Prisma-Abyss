const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

// 1) Rare encounter base rate is exactly 3% where a rank-band rare exists.
const monsterContext = { console, window: {}, Math, JSON, Object, Array, Number, String, Set, Map };
monsterContext.window = monsterContext;
monsterContext.globalThis = monsterContext;
vm.createContext(monsterContext);
vm.runInContext(`${read('monsters.js')}\nglobalThis.__MonsterData = MonsterData;`, monsterContext, { filename: 'monsters.js' });
const MonsterData = monsterContext.__MonsterData;
assert(Math.abs(Number(MonsterData.getRareEncounterRateForRank(31)) - 0.03) < 1e-12,
  'Rare encounter rate for the first rare rank band must be 3%.');
assert(Number(MonsterData.getRareEncounterRateForRank(30)) === 0,
  'Ranks without a rare candidate must not gain a phantom 3% encounter rate.');

// 2) Rare encounter auto-off and dual-wield behavior are executable runtime rules, not text-only config.
const battleContext = { console, Math, JSON, Object, Array, Number, String, Set, Map, WeakSet, Promise, setTimeout, clearTimeout };
battleContext.globalThis = battleContext;
battleContext.window = battleContext;
battleContext.App = { data: { settings: { battleAutoStart: true } } };
battleContext.DB = { CHARACTERS: [], SKILLS: [], MONSTERS: [] };
vm.createContext(battleContext);
vm.runInContext(`${read('battle.js')}\nglobalThis.__Battle = Battle;`, battleContext, { filename: 'battle.js' });
const Battle = battleContext.__Battle;

let buttonUpdates = 0;
Battle.updateAutoButton = () => { buttonUpdates += 1; };
Battle.auto = true;
Battle.enemies = [{ isRare: true }];
assert(Battle.disableAutoForRareEncounter() === true, 'Rare encounter must be detected by battle runtime.');
assert(Battle.auto === false, 'Rare encounter must disable AUTO at battle start.');
assert(buttonUpdates === 1, 'AUTO button must be refreshed after rare encounter auto-off.');

Battle.auto = true;
Battle.enemies = [{ isRare: false }];
assert(Battle.disableAutoForRareEncounter() === false, 'Normal encounter must not be treated as rare.');
assert(Battle.auto === true, 'Normal encounter must preserve the configured AUTO start state.');

const dualActor = { traits: [{ id: 8, level: 1 }], disabledTraits: [], equips: { '武器': { type: '武器' }, '盾': null } };
assert(Battle.getEquippedWeaponCount(dualActor) === 1, 'Dual-wield test actor must have only one equipped weapon.');
assert(Battle.isDualWieldActive(dualActor) === true,
  'Dual-wield combat effect must activate from the trait even with no second weapon equipped.');
assert(Battle.getSkillMpCost(dualActor, { id: 100, mp: 10 }, 'required') === 11,
  'Dual-wield MP adjustment must also apply with only one equipped weapon.');
assert(Battle.isDualWieldActive({ traits: [], disabledTraits: [], equips: {} }) === false,
  'Actor without the dual-wield trait must remain single-action.');

const battleSource = read('battle.js');
const rareAutoCall = battleSource.indexOf('Battle.disableAutoForRareEncounter();');
const enemyBuild = battleSource.indexOf('Battle.enemies = Battle.generateNewEnemies');
const inputStart = battleSource.indexOf('Battle.startInputPhase()', rareAutoCall);
assert(enemyBuild >= 0 && rareAutoCall > enemyBuild && inputStart > rareAutoCall,
  'Rare AUTO off must run after enemy generation and before player input starts.');
assert(!battleSource.includes('return Battle.getEquippedWeaponCount(actor) >= 2;'),
  'Dual-wield activation must no longer require two equipped weapons.');

// 3) Prologue Luna carries only self-earned LB to adult Luna, never temporary/scripted LB99.
const mainContext = {
  console, Math, JSON, Object, Array, Number, String, Set, Map, WeakSet, Promise,
  setTimeout, clearTimeout, Date,
  DB: { CHARACTERS: [], SKILLS: [], ITEMS: [], EQUIPS: [], MONSTERS: [] },
  document: {}
};
mainContext.window = {
  JOB_SKILLS: {},
  CHARACTERS_DATA: [
    { id: 403, name: 'ルーナ', adultCharacterId: 401 },
    { id: 401, name: 'ルーナ' }
  ],
  addEventListener() {},
  requestAnimationFrame() {}
};
mainContext.globalThis = mainContext;
vm.createContext(mainContext);
vm.runInContext(`${read('main.js')}\nglobalThis.__App = App;`, mainContext, { filename: 'main.js' });
const App = mainContext.__App;
App.data = { progress: {}, characters: [], party: [] };

const childLuna = {
  uid: 'luna403', charId: 403, name: 'ルーナ', limitBreak: 4,
  lbProgress: {
    counters: { battleWins: 170 },
    sources: { story: 0, battle: 3, dungeon: 0, quest: 0, boss: 0, prism: 0, random: 1, gacha: 0, monster: 0, trial: 0, item: 0, legacy: 0 },
    trials: { mid: false, final: false, midClearedAt: null, finalClearedAt: null }
  }
};
App.data.characters.push(childLuna);
let carry = App.captureStoryCharacterLimitBreakCarryover(childLuna, { save: false });
assert(Number(carry?.targetCharId) === 401 && Number(carry?.limitBreak) === 4,
  'Self-earned prologue Luna LB must be captured for adult Luna.');

// Temporary divine LB99 must still resolve to the real snapshot.
App.data.progress.tempStoryPower = { targets: [{ uid: childLuna.uid, limitBreak: 4 }] };
childLuna.limitBreak = 99;
carry = App.captureStoryCharacterLimitBreakCarryover(childLuna, { save: false });
assert(Number(carry?.limitBreak) === 4, 'Temporary LB99 must not overwrite the carryover value.');

// Scripted LB99 adds to source.story; that portion must also be excluded.
delete App.data.progress.tempStoryPower;
childLuna.lbProgress.sources.story = 95;
childLuna.limitBreak = 99;
carry = App.captureStoryCharacterLimitBreakCarryover(childLuna, { save: false });
assert(Number(carry?.limitBreak) === 4, 'Scripted/story LB99 must not be inherited by adult Luna.');

const adultLuna = {
  uid: 'luna401', charId: 401, name: 'ルーナ', limitBreak: 0,
  lbProgress: {
    counters: { battleWins: 0 },
    sources: { story: 0, battle: 0, dungeon: 0, quest: 0, boss: 0, prism: 0, random: 0, gacha: 0, monster: 0, trial: 0, item: 0, legacy: 0 },
    trials: { mid: false, final: false, midClearedAt: null, finalClearedAt: null }
  }
};
const applied = App.applyStoryCharacterLimitBreakCarryover(adultLuna, { save: false });
assert(applied.changed === true && Number(applied.amount) === 4 && Number(adultLuna.limitBreak) === 4,
  'Adult Luna must receive the captured self-earned LB exactly once.');
const appliedAgain = App.applyStoryCharacterLimitBreakCarryover(adultLuna, { save: false });
assert(appliedAgain.changed === false && Number(adultLuna.limitBreak) === 4,
  'Adult Luna LB carryover must be one-shot and save-safe.');

const mainSource = read('main.js');
const logicSource = read('story_logic.js');
assert(mainSource.includes('adultCharacterId'), 'LB carryover must use the canonical child -> adult character link.');
assert(mainSource.includes("if (key === 'story') return sum;"), 'Scripted story LB must be excluded from inherited LB.');
assert((mainSource.match(/applyStoryCharacterLimitBreakCarryover\?\./g) || []).length >= 2,
  'Both existing and newly-created adult story allies must receive pending LB carryover.');
assert(logicSource.includes('targets.forEach(char => App.captureStoryCharacterLimitBreakCarryover?.(char'),
  'Temporary LB activation must snapshot real growth before replacing displayed LB.');

// 4) Same-day player-facing news remains a single record and includes all four delivered changes.
const newsContext = {};
vm.createContext(newsContext);
vm.runInContext(`${read('news.js')}\nglobalThis.__NEWS_DATA = NEWS_DATA;`, newsContext, { filename: 'news.js' });
const today = newsContext.__NEWS_DATA.filter(entry => entry.date === '2026/08/11');
assert(today.length === 1, 'NEWS_DATA must keep exactly one record for 2026/08/11.');
for (const token of ['3%', 'AUTO', '自力で成長させたLB', '武器2が空']) {
  assert(String(today[0].body).includes(token), `2026/08/11 news is missing delivered change: ${token}`);
}

console.log('PASS validate-common-battle-growth-fixes-20260811');
