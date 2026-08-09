const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { loadMapStoryRuntime } = require('./validation-helpers');
const root = path.resolve(__dirname, '..', '..');
function assert(v, msg) { if (!v) throw new Error(msg); }

const { context } = loadMapStoryRuntime(root);
const maps = context.FIXED_DUNGEON_MAPS || {};
const story = context.StoryManager || {};
const events = story.events || {};
const scripts = story.scripts || {};

const monsterContext = {}; monsterContext.globalThis = monsterContext; vm.createContext(monsterContext);
vm.runInContext(fs.readFileSync(path.join(root, 'monsters.js'), 'utf8'), monsterContext);
const grad = monsterContext.MonsterData?.getMonsterById?.(301063);
assert(grad, 'Undersea Grad 301063 is missing.');
assert(grad.name === '炎楔のグラド', 'Undersea Grad must keep the canonical name 炎楔のグラド.');
assert(Number(grad.imageId) === 301010, 'Undersea Grad should reuse the current Grad image until a replacement asset exists.');
assert(Number(grad.rank) === 64 && Number(grad.hp) === 10800, 'Undersea Grad new stats are not the authored Phase 6C values.');
assert(Number(grad.actCount) === 2, 'Undersea Grad must act twice.');
const actIds = new Set((grad.acts || []).map(a => Number(a.id)));
for (const id of [700201,700202,700203,700204,700205]) assert(actIds.has(id), `Undersea Grad is missing new skill ${id}.`);
for (const id of [62,63,64]) assert((grad.traits || []).some(t => Number(t.id) === id), `Undersea Grad is missing new trait ${id}.`);
assert(Number(grad.elmRes?.['火']) >= 80 && Number(grad.elmRes?.['水']) < 0, 'Undersea Grad fire/water affinity does not express complete fire adaptation.');

const skillContext = { window: {} }; skillContext.globalThis = skillContext; vm.createContext(skillContext);
vm.runInContext(fs.readFileSync(path.join(root, 'skills.js'), 'utf8'), skillContext);
const skillMap = new Map((skillContext.window.SKILLS_DATA || []).map(s => [Number(s.id), s]));
for (const id of [700201,700202,700203,700204,700205]) assert(skillMap.has(id), `New Grad skill ${id} is missing from skills.js.`);
assert(skillMap.get(700205)?.name === '炎楔・天穿', 'Grad finisher skill is not configured.');

const passiveContext = {}; passiveContext.globalThis = passiveContext; vm.createContext(passiveContext);
vm.runInContext(fs.readFileSync(path.join(root, 'passiveSkill.js'), 'utf8') + '\nglobalThis.PassiveSkill=PassiveSkill;', passiveContext);
for (const id of [62,63,64]) {
  assert(passiveContext.PassiveSkill?.MASTER?.[id]?.bossOnly === true, `Trait ${id} must be bossOnly.`);
  assert(!passiveContext.PassiveSkill.TRAIT_BOOK_TRAIT_IDS.includes(id), `Boss-only trait ${id} leaked into trait books.`);
}
const passiveSource = fs.readFileSync(path.join(root, 'passiveSkill.js'), 'utf8');
const battleSource = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const menuTraitSource = fs.readFileSync(path.join(root, 'menus_trait_detail.js'), 'utf8');
assert(passiveSource.includes('!PassiveSkill.MASTER[id]?.bossOnly') || passiveSource.includes('!PassiveSkill.MASTER[id].bossOnly'), 'Random trait API does not filter bossOnly traits.');
assert(battleSource.includes('!PassiveSkill.MASTER[tid].bossOnly'), 'Deep random monster traits can still roll bossOnly traits.');
assert(menuTraitSource.includes('!m.bossOnly'), 'Trait reroll UI can still roll bossOnly traits.');

const volcano = maps.UNDERSEA_VOLCANO;
assert(volcano?.floors?.length === 5, 'Undersea Volcano must remain exactly five floors in the minimal version.');
const boss = volcano.floors[4]?.bosses?.find(b => Number(b.monsterId) === 301063);
assert(boss, 'Undersea Grad is not placed on the fifth-floor battle arena.');
assert(boss.startEventId === 'undersea_grad_encounter' && boss.storyEventId === 'undersea_grad_clear', 'Undersea Grad boss events are not wired correctly.');
assert(boss.clearedFlag === 'underseaVolcanoCleared', 'Undersea Grad must clear the volcano progression flag.');

const enc = events.undersea_grad_encounter?.actions || [];
assert(enc.some(a => a.type === 'BOSS' && Number(a.value) === 301063 && a.winEventId === 'undersea_grad_clear'), 'Undersea Grad encounter does not launch 301063.');
const clear = events.undersea_grad_clear?.actions || [];
assert(clear.some(a => a.type === 'FLAG' && a.key === 'underseaVolcanoCleared'), 'Undersea Grad clear does not set underseaVolcanoCleared.');
assert(clear.some(a => a.type === 'WORLD_STATE' && a.key === 'underseaVolcanoState' && Number(a.value) === 5), 'Undersea Grad clear does not set underseaVolcanoState=5.');
assert(clear.some(a => a.type === 'WORLD_STATE' && a.key === 'thunderFortState' && Number(a.value) === 4), 'Undersea Grad clear does not advance thunderFortState=4.');
assert(clear.some(a => a.type === 'SUB' && Number(a.value) === 5), 'Undersea Grad clear must return the story to 6-5.');

const briefing = events.thunder_guild_undersea_volcano_briefing?.actions || [];
assert(briefing.some(a => a.type === 'FLAG' && a.key === 'underseaVolcanoRouteOpened'), 'Thunder Fort briefing must open the Undersea Volcano route.');
assert(!events.big_tower_clear?.actions?.some(a => a.type === 'FLAG' && a.key === 'underseaVolcanoRouteOpened'), 'Big Tower clear must not bypass the Thunder Fort briefing.');

const thunderActors = (maps.THUNDER_FORT?.floors?.[0]?.mapActors || []);
const claude = thunderActors.find(a => a.actorId === 'claude_light_palace_memory');
assert(claude, 'Claude return/flashback actor is missing from Thunder Fort.');
assert(claude.states?.some(s => s.action?.eventId === 'thunder_fort_claude_luna_arrival'), 'Claude actor does not reveal Luna after the volcano.');
assert(events.thunder_fort_claude_luna_arrival?.actions?.some(a => a.type === 'FLAG' && a.key === 'lunaSurvivalRevealed'), 'Luna survival reveal flag is missing.');
const revealText = (scripts.THUNDER_FORT_CLAUDE_LUNA_ARRIVAL || []).map(x => x.text || '').join('\n');
assert(revealText.includes('ルーナ') && revealText.includes('生きている'), 'Luna survival reveal does not clearly happen at Thunder Fort.');

const dungeonSource = fs.readFileSync(path.join(root, 'dungeon.js'), 'utf8');
assert(dungeonSource.includes('lightPalaceFlashbackCompleted') && dungeonSource.includes("'locked_light_palace_recall'"), 'Light Palace can be entered before the delayed palace flashback is completed.');

console.log('PASS validate-undersea-grad-phase6c');
