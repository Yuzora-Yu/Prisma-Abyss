const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const storySource = fs.readFileSync(path.join(root, 'story_logic.js'), 'utf8');
const bookSource = fs.readFileSync(path.join(root, 'menus_book.js'), 'utf8');
const statusSource = fs.readFileSync(path.join(root, 'menus_status.js'), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const App = { data: { battle: {} } };
const context = { console, App, document:{}, window:{}, setTimeout, clearTimeout };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(`${battleSource}\nglobalThis.__Battle = Battle;`, context, { filename:'battle.js' });
const Battle = context.__Battle;
Battle.renderEnemies = () => {};
Battle.party = [{ hp:100, isDead:false }];
Battle.finishState = 'idle';
Battle.finishToken = null;
Battle.active = true;
Battle.phase = 'input';

const grad = { id:8001, baseId:8001, name:'グラド試験体', hp:1000, maxHp:1000, baseMaxHp:1000, isDead:false, isFled:false };
Battle.enemies = [grad];
App.data.battle = {
    eventBattleRules:{
        bestiaryExcluded:true,
        noDrops:true,
        noExp:true,
        noGold:true,
        noQuestProgress:true,
        noRecruit:true,
        endAtHpPercent:50,
        storyVariantOf:1234,
        targetMonsterId:8001
    },
    completedTurns:0
};
let rules = Battle.getEventBattleRules();
assert(rules.active === true && rules.endAtHpPercent === 50, 'Event battle rules did not normalize.');
assert(rules.targetMonsterIds.length === 1 && rules.targetMonsterIds[0] === 8001, 'targetMonsterId normalization failed.');
assert(Battle.isEventBattleThresholdMet(rules) === false, 'HP threshold triggered too early.');
grad.hp = 499;
assert(Battle.isEventBattleThresholdMet(rules) === true, 'HP50% event threshold did not trigger.');
assert(Battle.getEventBattleFinishType(rules) === 'win', 'Default event threshold should resolve as win.');
assert(Battle.applyEventBattleHpFloor(grad, rules) === true, 'HP threshold floor was not applied.');
assert(grad.hp === 500 && grad.isDead === false, `HP floor should clamp to 50% (500), got ${grad.hp}.`);

grad.hp = 0; grad.isDead = false;
assert(Battle.markDefeated(grad, false) === false, 'Event HP floor should prevent markDefeated.');
assert(grad.hp === 500 && grad.isDead === false, 'markDefeated bypassed event HP floor.');

App.data.battle.eventBattleRules = { endAfterTurns:3, forcedLoss:true };
App.data.battle.completedTurns = 2;
rules = Battle.getEventBattleRules();
assert(Battle.isEventBattleThresholdMet(rules) === false, 'Turn threshold triggered before configured turn count.');
App.data.battle.completedTurns = 3;
assert(Battle.isEventBattleThresholdMet(rules) === true, 'Turn threshold did not trigger.');
assert(Battle.getEventBattleFinishType(rules) === 'loss', 'forcedLoss did not map event completion to loss.');

App.data.battle.eventBattleRules = { hpFloor:200 };
grad.hp = 0; grad.isDead = false;
rules = Battle.getEventBattleRules();
assert(Battle.applyEventBattleHpFloor(grad, rules) === true && grad.hp === 200, 'Absolute hpFloor did not clamp event target.');

// Authoring and reward/bestiary integration checks.
assert(storySource.includes("'endAtHpPercent'"), 'BOSS action does not accept endAtHpPercent.');
assert(storySource.includes('...(eventBattleRules ? { eventBattleRules } : {})'), 'BOSS action does not persist eventBattleRules into battle state.');
assert(battleSource.includes('if (!eventBattleRules.noExp) totalExp +='), 'noExp is not enforced in victory rewards.');
assert(battleSource.includes('if (!eventBattleRules.noGold) totalGold +='), 'noGold is not enforced in victory rewards.');
assert(battleSource.includes('const dropResultEnemies = eventBattleRules.noDrops ? [] : rewardResultEnemies;'), 'noDrops is not enforced.');
assert(battleSource.includes('!eventBattleRules.noQuestProgress'), 'noQuestProgress is not enforced.');
assert(battleSource.includes('!eventBattleRules.noRecruit'), 'noRecruit is not enforced.');
assert(battleSource.includes('eventBattleRules.bestiaryExcluded || base?.bestiaryExcluded === true'), 'bestiaryExcluded is not enforced at victory registration.');
assert(bookSource.includes("filter(monster => monster?.bestiaryExcluded !== true)"), 'Book list does not exclude bestiaryExcluded masters.');
assert(statusSource.includes("DB.MONSTERS.filter(monster => monster?.bestiaryExcluded !== true)"), 'Book completion denominator does not exclude bestiaryExcluded masters.');

console.log('PASS: event battle thresholds, HP floors, forced-loss timing, reward suppression, and bestiary exclusion are wired for story boss variants.');
