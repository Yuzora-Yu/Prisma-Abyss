const fs = require('fs');
const path = require('path');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_MAPS;
const events = context.StoryManager.events || {};
const scripts = context.StoryManager.scripts || {};
const vm = require('vm');
const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const monsterApi = monsterContext.MonsterData;
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const logicSource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');
function assert(v, msg) { if (!v) throw new Error(msg); }

assert(maps.REES_MOUNTAIN_HUT, 'Missing minimal Rees mountain hut transition map.');
assert(maps.REES_MOUNTAIN_HUT.entryEventId === 'prologue_present_wake', 'Rees hut does not trigger present-day wake event.');
const southActions = maps.PROLOGUE_SOUTH_VILLAGE?.mapActions || [];
assert(southActions.some(a => a.eventId === 'prologue_home_loss' && a.missingFlag === 'prologueHomeLostSeen'), 'South map has no one-time home-loss interaction.');
assert(southActions.some(a => a.eventId === 'prologue_south_exit_boss' && a.requiredFlag === 'prologueHomeLostSeen'), 'South exit does not advance to first abyss boss after home loss.');

const rescue = events.prologue_south_arrival;
assert(rescue?.winActions?.some(a => a.type === 'TEMP_ALLY' && Number(a.charId) === 403), 'Dedicated prologue Luna 403 is not used.');
assert(!rescue?.winActions?.some(a => a.type === 'TEMP_ALLY' && Number(a.charId) === 401), 'Adult Luna 401 is incorrectly used in prologue.');

const home = events.prologue_home_loss;
assert(home?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueHomeLostSeen'), 'Home-loss event is not persisted.');
assert(home?.actions?.some(a => a.type === 'WORLD_STATE' && a.key === 'prologueStage' && Number(a.value) === 4), 'Home-loss event does not advance prologue stage 4.');

const boss = events.prologue_south_exit_boss;
const bossAction = boss?.actions?.find(a => a.type === 'BOSS');
assert(bossAction && Number(bossAction.value) === 802001, 'First prologue abyss boss variant is not wired.');
assert(bossAction.lossEventId === 'prologue_first_boss_loss' && bossAction.winEventId === 'prologue_first_boss_win', 'First boss does not preserve win/loss branching.');
assert(bossAction.forceAutoOff === true, 'First boss must force manual battle.');
assert(bossAction.noExp === true && bossAction.noDrops === true && bossAction.bestiaryExcluded === true, 'First boss event rewards/bestiary rules are incomplete.');
assert(boss?.actions?.some(a => a.type === 'TEMP_LB_START' && Number(a.value) === 99), 'First boss does not activate temporary LB99 blessing.');

const normal = events.prologue_first_boss_loss;
assert(normal?.actions?.some(a => a.type === 'ITEM' && Number(a.id) === 701009), 'Normal route does not grant burned pendant.');
assert(normal?.actions?.some(a => a.type === 'RESET_TEMP_ALLY' && Number(a.charId) === 403), 'Normal route does not remove prologue Luna.');
assert(normal?.actions?.some(a => a.type === 'RESET_HERO_BASELINE'), 'Normal route does not reset prologue growth from Ars.');
assert(normal?.actions?.some(a => a.type === 'START_FIXED_MAP' && a.value === 'REES_MOUNTAIN_HUT'), 'Normal route does not transition to Rees hut.');

const win = events.prologue_first_boss_win;
const illuminacia = win?.actions?.find(a => a.type === 'BOSS');
assert(illuminacia && Number(illuminacia.value) === 802002, 'First-boss victory does not reveal prologue Illuminacia battle.');
assert(illuminacia.lossEventId === 'prologue_illuminacia_loss', 'Illuminacia loss convergence is missing.');
assert(illuminacia.winEventId === 'prologue_hidden_route_pending', 'Illuminacia victory must remain a distinct hidden-route continuation.');
assert(events.prologue_hidden_route_pending?.actions?.some(a => a.type === 'FLAG' && a.key === 'prologueResult4'), 'Hidden route does not mark result 4 after Illuminacia victory.');

assert(monsterApi?.getMonsterById?.(802001)?.storyVariantOf === 302000, 'First prologue boss event monster does not identify its source variant.');
assert(monsterApi?.getMonsterById?.(802002)?.storyVariantOf === 302070, 'Prologue Illuminacia event monster does not identify its source variant.');

for (const key of ['PROLOGUE_HOME_LOST','PROLOGUE_SOUTH_EXIT_BOSS','PROLOGUE_COLLAPSE_AND_PENDANT','PROLOGUE_FIRST_BOSS_WIN','PROLOGUE_PRESENT_WAKE']) {
  assert(Array.isArray(scripts[key]) && scripts[key].length, `Missing prologue script: ${key}`);
}
assert(mainSource.includes('resetTemporaryStoryAlly:'), 'Runtime lacks temporary ally reset helper.');
assert(mainSource.includes('resetHeroAfterPlayablePrologue:'), 'Runtime lacks prologue hero reset helper.');
assert(logicSource.includes("action.type === 'RESET_TEMP_ALLY'"), 'Story runtime lacks RESET_TEMP_ALLY adapter.');
assert(logicSource.includes("action.type === 'RESET_HERO_BASELINE'"), 'Story runtime lacks RESET_HERO_BASELINE adapter.');
assert(battleSource.includes("if (App.data?.battle?.forceAutoOff === true)"), 'Battle auto toggle is not locked for forced-manual story battles.');

console.log('PASS validate-playable-prologue-phase2b');
