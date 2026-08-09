const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
const { context } = loadMapStoryRuntime(root);
const events = context.StoryManager?.events || {};
const scripts = context.StoryManager?.scripts || {};
const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const monsterApi = monsterContext.MonsterData;
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
function assert(v, msg) { if (!v) throw new Error(msg); }

const source = monsterApi?.getMonsterById?.(301010);
const variant = monsterApi?.getMonsterById?.(803010);
assert(source?.name === '炎楔のグラド', 'Original Grad 301010 must remain intact.');
assert(variant?.storyVariantOf === 301010, 'First Grad event variant must identify source 301010.');
assert(variant?.bestiaryExcluded === true, 'First Grad event variant must be excluded from bestiary.');
const variantActs = new Set((variant?.acts || []).map(a => Number(a.id)));
assert(variantActs.has(223) && variantActs.has(224), 'First Grad variant must attempt authored large fire spells.');
assert((source?.acts || []).some(a => Number(a.id) === 300), 'Original Grad actions were unexpectedly replaced.');

const battleActions = [];
function collect(actions) {
  for (const action of actions || []) {
    if (!action) continue;
    if (action.type === 'BOSS' && Number(action.value) === 803010) battleActions.push(action);
    collect(action.then); collect(action.else);
  }
}
for (const id of ['fire_volcano_soldiers_encounter','fire_volcano_soldiers_clear','fire_volcano_glad_retry']) collect(events[id]?.actions);
assert(battleActions.length === 3, `Expected all three first-Grad battle entries to use 803010; got ${battleActions.length}.`);
for (const action of battleActions) {
  assert(Number(action.endAtHpPercent) === 50, 'First Grad battle must end as story victory at 50% HP.');
  assert(Number(action.targetMonsterId) === 803010, 'First Grad threshold must target event variant 803010.');
  assert(Number(action.storyVariantOf) === 301010, 'First Grad event battle must retain storyVariantOf 301010.');
  assert(action.bestiaryExcluded === true && action.noDrops === true && action.noExp === true && action.noGold === true, 'First Grad event rewards/bestiary suppression is incomplete.');
  assert(action.noQuestProgress === true && action.noRecruit === true, 'First Grad event must not leak kill/recruit progress.');
  assert(action.forceAutoOff === true, 'First Grad event battle must remain player-controlled.');
  const failRules = action.eventBattleRules?.skillFailureRules || [];
  assert(failRules.length === 1, 'First Grad battle must have one authored overload failure rule.');
  assert([223,224].every(id => failRules[0].skillIds?.includes(id)), 'Grad overload failure rule does not cover both large fire spells.');
  assert(Number(failRules[0].chance) === 1, 'Grad large-fire failure must be deterministic in this event battle.');
  assert((failRules[0].failureMessages || []).length >= 4, 'Grad battle should rotate several failure messages.');
}

const clear = scripts.FIRE_VOLCANO_CLEAR || [];
const clearText = clear.map(x => x.text || '').join('\n');
assert(clearText.includes('倒し切ったわけではない'), 'Clear dialogue must explicitly avoid treating Grad as fully defeated.');
assert(clearText.includes('次は万全の炎'), 'Clear dialogue must foreshadow a complete Grad rematch.');
assert(clearText.includes('赤い光'), 'Clear dialogue must leave a fair clue that something inside the fire prism resisted.');
const preText = (scripts.FIRE_VOLCANO_GLAD || []).map(x => x.text || '').join('\n');
assert(preText.includes('流れが乱れた') || preText.includes('収束'), 'Pre-battle dialogue must establish Grad fire instability.');

assert(battleSource.includes('tryHandleEventBattleSkillFailure:'), 'Battle runtime lacks generic event skill failure handler.');
assert(battleSource.includes('if (Battle.tryHandleEventBattleSkillFailure(cmd)) return;'), 'Battle runtime does not intercept authored event skill failures before action execution.');
assert(battleSource.includes('skillFailureRules:'), 'Event battle rule normalization drops skillFailureRules.');

console.log('PASS validate-grad-first-battle-phase4');
