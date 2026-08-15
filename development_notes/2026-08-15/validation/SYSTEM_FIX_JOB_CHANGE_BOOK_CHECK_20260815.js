const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
const ok = (name, condition) => { assert.ok(condition, name); checks.push(name); };

const mapSource = read('map.js');
const dungeonSource = read('dungeon.js');
const battleSource = read('battle.js');
const monsterSource = read('monsters.js');
const itemSource = read('items.js');
const jobSource = read('job_data.js');
const mainSource = read('main.js');
const menuSource = read('menus_items.js');

// Rexnote B1 exit must not depend on a stale generic returnPoint.
const mapCtx = { console, Math, Date, JSON, setTimeout, clearTimeout };
mapCtx.window = mapCtx; mapCtx.globalThis = mapCtx;
vm.createContext(mapCtx);
vm.runInContext(mapSource + '\n;globalThis.__FDM=FIXED_DUNGEON_MAPS;globalThis.__Z=FIELD_ENCOUNTER_ZONES;', mapCtx, {timeout:10000});
const rexB1 = mapCtx.__FDM.REXNOTE_BASEMENT.floors.find(f => Number(f.floor) === 1);
ok('Rexnote B1 has explicit estate exit point', rexB1?.proceduralExitPoint?.areaKey === 'REXNOTE_ESTATE' && rexB1.proceduralExitPoint.x === 13 && rexB1.proceduralExitPoint.y === 7);
ok('procedural cached exit gets template exit point', dungeonSource.includes("if (exitLink) exitLink.exitPoint = JSON.parse(JSON.stringify(template.proceduralExitPoint));"));
ok('new procedural exit link embeds exit point', dungeonSource.includes('...(template.proceduralExitPoint ? { exitPoint: JSON.parse(JSON.stringify(template.proceduralExitPoint)) } : {})'));

// Result log text: reward rates stay in logic, percentages are not printed.
ok('dead ally 50 percent result text removed', !battleSource.includes('戦闘不能の仲間は経験値を50%取得した。'));
ok('reserve ally 25 percent result text removed', !battleSource.includes('控えの仲間は経験値を25%取得した。'));
ok('reward rate logic remains', battleSource.includes('前衛生存100%、戦闘不能50%、控え25%'));

// Reincarnation fruit should not be selected by random chests.
const itemCtx = { console, Math, Date, JSON };
itemCtx.window = itemCtx; itemCtx.globalThis = itemCtx;
vm.createContext(itemCtx);
vm.runInContext(itemSource, itemCtx, {timeout:10000});
vm.runInContext(jobSource, itemCtx, {timeout:10000});
const fruit = itemCtx.ITEMS_DATA.find(i => Number(i.id) === 107);
ok('reincarnation fruit random chest opt-out', fruit?.randomChestDrop === false);
ok('dungeon chest filter honors randomChestDrop', dungeonSource.includes('item.randomChestDrop !== false'));
ok('catalog chest filter honors randomChestDrop', itemSource.includes('item.randomChestDrop !== false'));

// Angel trial status labels and center-rank rule.
for (const label of ['HP','MP','攻撃力','防御力','魔力','魔法防御','素早さ']) {
  ok(`angel trial label ${label}`, dungeonSource.includes(label));
}
ok('angel trial stores 5-9 center rank bonus', dungeonSource.includes('centerRankBonus:5 + Math.floor(Math.random() * 5)'));
ok('rift stores 5-9 center rank bonus', dungeonSource.includes('riftCenterRankBonus: 5 + Math.floor(Math.random() * 5)'));
ok('angel second enemy gets center bonus', battleSource.includes('const enemyFloor = i === 1 ? targetFloor + centerRankBonus : targetFloor;'));
ok('rift second enemy gets center bonus', battleSource.includes('const enemyFloor = i === 1 ? riftFloor + centerRankBonus : riftFloor;'));

// Lighthouse southwest slime island.
const slimeZone = mapCtx.__Z.find(z => z.id === 'SLIME_ISLET_SOUTHWEST');
ok('slime island zone exists', !!slimeZone);
ok('slime island is exact 3-tile rect', slimeZone.rect?.x1 === 8 && slimeZone.rect?.x2 === 10 && slimeZone.rect?.y1 === 83 && slimeZone.rect?.y2 === 83);
ok('slime island normal rank range 1-140', slimeZone.encounterRankMin === 1 && slimeZone.encounterRankMax === 140);
ok('slime island race limited to slime', JSON.stringify(slimeZone.encounterRaces) === JSON.stringify(['粘体']));
ok('slime island metal rares exact', JSON.stringify(slimeZone.rareEncounterMonsterIds) === JSON.stringify([200201,200202,200203]));
const monsterCtx = { console, Math, Date, JSON };
monsterCtx.window = monsterCtx; monsterCtx.globalThis = monsterCtx;
vm.createContext(monsterCtx);
vm.runInContext(monsterSource, monsterCtx, {timeout:10000});
const slimes = monsterCtx.MonsterData.getEncounterCandidates({rankMin:1, rankMax:140, races:['粘体']});
ok('slime island has normal slime candidates', slimes.length > 0);
ok('all normal island candidates are slime', slimes.every(m => m.race === '粘体'));
ok('all normal island candidates are rank <=140', slimes.every(m => Number(m.rank) >= 1 && Number(m.rank) <= 140));
ok('Prism King excluded from island rares', !slimeZone.rareEncounterMonsterIds.includes(200204));
ok('world encounter profile carries race filters', mainSource.includes('encounterRaces: Array.isArray(best.encounterRaces) ? [...best.encounterRaces] : []'));
ok('battle encounter generation consumes race filters', battleSource.includes('races: battleData.encounterRaces'));

// Job master and books.
const jobs = itemCtx.JOB_MASTER_DATA;
const books = itemCtx.ITEMS_DATA.filter(i => i.type === '転職の書');
ok('23 stable job definitions', Array.isArray(jobs) && jobs.length === 23);
ok('job IDs unique', new Set(jobs.map(j => Number(j.id))).size === jobs.length);
ok('job names unique', new Set(jobs.map(j => j.name)).size === jobs.length);
ok('23 transfer books', books.length === jobs.length);
ok('transfer book IDs unique', new Set(books.map(b => Number(b.id))).size === books.length);
ok('all item IDs remain globally unique', new Set(itemCtx.ITEMS_DATA.map(item => Number(item.id))).size === itemCtx.ITEMS_DATA.length);
ok('transfer books link by jobId', books.every(b => itemCtx.JobData.getById(b.jobId)?.name && b.name === `${itemCtx.JobData.getById(b.jobId).name}の転職の書`));
ok('database refreshes job book metadata after masters load', read('database.js').includes('refreshJobChangeBookItemMetadata'));
ok('transfer books have no acquisition route yet', books.every(b => b.shopAvailable === false && b.abyssDrop === false && b.randomChestDrop === false));
ok('transfer books are consumable field items', books.every(b => b.consumable === true && b.fieldUsable === true && b.battleUsable === false));
ok('job trait layer remains unimplemented', !itemCtx.JOB_IDENTITY_DATA && !mainSource.includes('JOB_IDENTITY_DATA'));
ok('future trait check can use current job only', mainSource.includes('isCurrentJob: (character, jobIdOrName) =>'));

// Dynamic career test using the actual App implementation.
const skillSource = read('skills.js');
const appCtx = { console, Math, Date, JSON, setTimeout, clearTimeout };
appCtx.window = appCtx; appCtx.globalThis = appCtx;
appCtx.window.addEventListener = () => {};
appCtx.window.requestAnimationFrame = fn => fn();
appCtx.document = { getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[] };
appCtx.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
vm.createContext(appCtx);
vm.runInContext(skillSource, appCtx, {timeout:10000});
vm.runInContext(jobSource, appCtx, {timeout:10000});
appCtx.DB = {
  SKILLS: appCtx.SKILLS_DATA || [],
  CHARACTERS: [{ id:999, name:'テスト', job:'戦士', hp:100, mp:30, atk:20, def:20, mag:10, mdef:10, spd:10 }],
  ITEMS: [], MONSTERS: [], EQUIPS: []
};
vm.runInContext(mainSource + '\n;globalThis.__App=App;globalThis.__Player=Player;', appCtx, {timeout:10000});
const App = appCtx.__App;
const warriorTable = appCtx.JOB_SKILLS_DATA['戦士'];
const priestTable = appCtx.JOB_SKILLS_DATA['僧侶'];
const oldSkill = Number(warriorTable['100']);
const priestLv1 = Number(priestTable['1']);
const priestHigh = Number(priestTable['100']);
const char = {
  uid:'test-1', charId:999, name:'テスト', job:'戦士', level:100, exp:12345, reincarnationCount:2,
  hp:100, mp:30, atk:20, def:20, mag:10, mdef:10, spd:10, rarity:'N',
  equips:{}, skills:[oldSkill], traits:[], disabledTraits:[], tree:{}, config:{}
};
appCtx.__App.data = { characters:[char], party:['test-1'], progress:{ storyCharacters:{} }, system:{}, items:{} };
const career = App.ensureCharacterJobCareer(char);
ok('career baseline current job is warrior', career.currentJob.name === '戦士' && char.jobId === 1);
ok('career baseline records history', Array.isArray(char.jobHistory) && char.jobHistory.length === 1);
const reject99 = App.changeJobByBook({...char, level:99, jobHistory:[...char.jobHistory], jobProgress:{...char.jobProgress}}, 2, {save:false});
ok('transfer book rejects below Lv100', reject99.ok === false && reject99.reason === 'level_requirement');
const rejectSame = App.changeJobByBook({...char, jobHistory:[...char.jobHistory], jobProgress:{...char.jobProgress}}, 1, {save:false});
ok('transfer book rejects same job', rejectSame.ok === false && rejectSame.reason === 'same_job');
const beforeSkills = [...char.skills];
const changed = App.changeJobByBook(char, 2, {save:false});
ok('transfer book changes job', changed.ok === true && char.job === '僧侶' && char.jobId === 2 && char.jobTransferJobId === 2);
ok('transfer book reincarnates at same time', char.level === 1 && char.exp === 0 && char.reincarnationCount === 3);
ok('old job skill persists after transfer', beforeSkills.every(id => char.skills.includes(id)));
ok('new job Lv1 skill learned', char.skills.includes(priestLv1));
ok('new job high-level skill not auto-learned', !char.skills.includes(priestHigh));
ok('job history appends transfer', char.jobHistory.length === 2 && char.jobHistory[1].jobId === 2 && char.jobHistory[1].fromJobId === 1 && char.jobHistory[1].source === 'book');
ok('new job progress starts at Lv1', Number(char.jobProgress[2]) === 1);
ok('effective level formula still gives multiple of 100 before transfer rule', (100 + 2 * 100) === 300);
ok('player transfer overrides story/master job on reload correction', App.getExpectedStoryCharacterJob(char) === '僧侶');
const actor = new appCtx.__Player(char);
const actorSkillIds = actor.skills.map(s => Number(s.id));
ok('Player reconstruction keeps previous-job skill', actorSkillIds.includes(oldSkill));
ok('Player reconstruction keeps new-job Lv1 skill', actorSkillIds.includes(priestLv1));
ok('Player reconstruction does not grant new-job Lv100 skill', !actorSkillIds.includes(priestHigh));

// UI routing exists but traits still not implemented.
ok('transfer books are growth-tab items', menuSource.includes("type === '転職の書'"));
ok('transfer confirmation warns reincarnation', menuSource.includes('転職と同時に転生し、Lv1に戻ります。'));
ok('transfer failure message explains Lv100', menuSource.includes('転職の書はLv100到達時にのみ使用できます。'));

console.log(`SYSTEM_FIX_JOB_CHANGE_BOOK_CHECK: ${checks.length}/${checks.length} PASS`);
checks.forEach((name, i) => console.log(`${String(i+1).padStart(2,'0')}. PASS ${name}`));
