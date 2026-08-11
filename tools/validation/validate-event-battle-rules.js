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

// Omitted optional numeric rules must stay disabled. Number(null) === 0 must never create a 1-turn event battle.
App.data.battle.eventBattleRules = { bestiaryExcluded:true, noDrops:true, storyVariantOf:2 };
App.data.battle.completedTurns = 999;
grad.hp = 1000; grad.isDead = false;
rules = Battle.getEventBattleRules();
assert(rules.endAfterTurns === null && rules.endAtHpPercent === null && rules.hpFloor === null,
    'Omitted event-battle numeric rules must normalize to null.');
assert(Battle.isEventBattleThresholdMet(rules) === false,
    'An event battle with omitted thresholds still auto-finishes while the enemy is alive.');
assert(Battle.getEventBattleHpFloorValue(grad, rules) === null,
    'Omitted HP-floor rules were reinterpreted as a numeric floor.');
assert(Battle.isBattleFinishConditionMet('win') === false,
    'An ordinary event battle must not win until the enemy is defeated.');
grad.hp = 0; grad.isDead = true;
assert(Battle.isBattleFinishConditionMet('win') === true,
    'An ordinary event battle must resolve normally when the enemy dies.');
grad.hp = 1000; grad.isDead = false;

// Event-authored guaranteed equipment bypasses random noDrops while still using the shared equipment generator.
App.data.inventory = [];
let equipmentFactoryCall = null;
App.createEquipByFloor = (source, rank, plus, options) => {
    equipmentFactoryCall = { source, rank, plus, options };
    return { name:'検証用装備', rank, plus, type:'武器', opts:[], data:{} };
};
const rewardDrops = [];
const guaranteed = Battle.grantGuaranteedEquipmentRewards(rewardDrops, {
    guaranteedEquipmentReward:{ rank:10, plus:3, count:1, balancedDropBase:true }
});
assert(guaranteed.length === 1 && App.data.inventory.length === 1 && rewardDrops.length === 1,
    'Guaranteed event equipment was not granted exactly once.');
assert(equipmentFactoryCall?.source === 'drop' && Number(equipmentFactoryCall?.rank) === 10 && Number(equipmentFactoryCall?.plus) === 3,
    'Guaranteed event equipment did not use Rank10/+3 through the shared equipment generator.');
assert(equipmentFactoryCall?.options?.balancedDropBase === true,
    'Guaranteed event equipment lost balancedDropBase.');
assert(rewardDrops[0]?.guaranteedEventReward === true,
    'Guaranteed event equipment is not marked in battle result drops.');

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
assert(storySource.includes('const guaranteedEquipmentReward = action.guaranteedEquipmentReward'), 'BOSS action does not accept guaranteedEquipmentReward.');
assert(storySource.includes('...(guaranteedEquipmentReward ? { guaranteedEquipmentReward } : {})'), 'BOSS action does not persist guaranteedEquipmentReward into battle state.');

console.log('PASS: event battle thresholds, omitted-rule death semantics, guaranteed equipment, reward suppression, and bestiary exclusion are wired for story boss variants.');
