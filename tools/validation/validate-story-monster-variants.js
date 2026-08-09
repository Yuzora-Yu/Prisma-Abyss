const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const monsterContext = { window:{}, console, Math };
monsterContext.window = monsterContext;
monsterContext.globalThis = monsterContext;
vm.createContext(monsterContext);
vm.runInContext(read('monsters.js'), monsterContext, { filename:'monsters.js' });
assert(monsterContext.MonsterData && typeof monsterContext.MonsterData.getStoryMonsterVariant === 'function', 'Story monster variant getter is unavailable.');
assert(monsterContext.MonsterData.storyMonsterVariants && typeof monsterContext.MonsterData.storyMonsterVariants === 'object', 'Story monster variant registry is unavailable.');
assert(Object.keys(monsterContext.MonsterData.storyMonsterVariants).length === 0, 'Phase 2 foundation must not invent a concrete story boss before its combat data is approved.');
assert(monsterContext.MonsterData.getStoryMonsterVariant('UNDEFINED_VARIANT') === null, 'Unknown story variant must resolve to null.');

const storyLogic = read('story_logic.js');
const battle = read('battle.js');
assert(storyLogic.includes('storyMonsterVariantKey'), 'Story BOSS actions cannot carry a string-key monster variant.');
assert(storyLogic.includes('getStoryMonsterVariant'), 'Story BOSS action does not validate monster variants against monsters.js.');
assert(battle.includes('battleData.storyMonsterVariantKey'), 'Battle does not read the story monster variant key.');
assert(battle.includes('getStoryMonsterVariant(storyMonsterVariantKey)'), 'Battle does not generate the story-only variant from monsters.js.');

console.log('PASS: string-key story monster variants are supported without issuing a numeric bestiary ID; no unapproved concrete boss has been invented.');
