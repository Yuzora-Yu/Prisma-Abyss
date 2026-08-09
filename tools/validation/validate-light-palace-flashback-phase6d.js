const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const assert = (cond, msg) => { if (!cond) { console.error(`[phase6d] FAIL: ${msg}`); process.exitCode = 1; } };

const main = read('main.js');
const battle = read('battle.js');
const dungeon = read('dungeon.js');
const storyLogic = read('story_logic.js');
const story = read('story.js');
const map = read('map.js');
const skills = read('skills.js');
const monsters = read('monsters.js');
const news = read('news.js');

assert(story.includes('"light_palace_flashback_start"'), 'flashback start event missing');
assert(story.includes('"visualPreset": "sepia"'), 'sepia scene context missing');
assert(story.includes('"isolateInventory": true') && story.includes('"mergeLoot": true'), 'flashback inventory isolation/merge missing');
assert(story.includes('"charId":204') && story.includes('"charId":401'), 'Layla + Luna initial party missing');
assert(story.includes('"charId":401,"initialLevel":52,"expMultiplierPct":100'), 'Saint Luna flashback 100% EXP setting missing');
assert(story.includes('"light_palace_flashback_hexagram_trap"'), 'hexagram trap event missing');
assert(story.includes('"value": 301064') && story.match(/"value": 301064/g)?.length >= 2, 'two Veld event battles missing');
assert(story.match(/"forceAutoOff": true/g)?.length >= 2, 'Veld AUTO lock missing');
assert(story.match(/"endAfterTurns": 5/g)?.length >= 2 && story.match(/"forcedLoss": true/g)?.length >= 2, 'Veld 5-turn forced-loss rules missing');
assert(story.includes('"party": [ {"charId":204}, {"charId":305,"initialLevel":46}, {"charId":304,"initialLevel":47,"skills":[716]} ]'), 'post-Veld Layla/Leon/Claude party missing');
assert(story.includes('{ "type": "HEAL" }'), 'post-Veld recovery before checkpoint missing');
assert(story.includes('"lightPalaceFlashbackCompleted"'), 'flashback completion flag missing');
assert(story.includes('白。黒。白。黒。焼きつくような明滅'), 'Flash Bomb event should show the alternating flash as a perceived phenomenon.');
assert(story.includes('レオンは、ルーナを抱えたクロードごと結界の外へ投げ飛ばした'), 'Leon throws Claude+Luna escape beat missing');

assert(skills.includes('"id": 716') && skills.includes('"name": "フラッシュボム"'), 'Flash Bomb skill missing');
assert(skills.includes('"dualCycleElements": ["光", "闇"]') && skills.includes('"claudeUnique": true'), 'Flash Bomb dual-cycle metadata missing');

assert(monsters.includes('"id":301064') && monsters.includes('"name":"聖騎士団長ヴェルド"'), 'flashback Veld monster missing');
assert(monsters.includes('"flashbackOnly":true') && monsters.includes('"bestiaryExcluded":true'), 'flashback Veld exclusion metadata missing');
assert(monsters.includes('return monster ? [monster] : [];'), 'rare encounter fallback corrupted by Veld insertion');

assert(main.includes('restartOnWipeout: options.restartOnWipeout === true'), 'scene wipeout restart support missing');
assert(main.includes('App.data.progress.openedChests = {}'), 'flashback chest-state isolation missing');
assert(main.includes('storyCharacterCarryover'), 'story character carryover state missing');
assert(main.includes('mergeSceneContextLoot'), 'scene loot merge missing');
assert(main.includes("if (effect.type === 'hunter' || effect.type === 'storyEvent') return null;"), 'hidden story trap should not appear on minimap');
assert(battle.includes('sceneWipeoutEventId'), 'battle loss does not route to scene checkpoint event');
assert(dungeon.includes("effect.type === 'storyEvent'"), 'contact story-event tile effect missing');
assert(dungeon.includes('getSceneContextExitEvent'), 'flashback exit interception missing');
assert(storyLogic.includes("action.type === 'SCENE_BEGIN'") && storyLogic.includes("action.type === 'SCENE_CHECKPOINT'") && storyLogic.includes("action.type === 'SCENE_END'"), 'scene story actions missing');

assert(map.includes('label: "聖女の部屋・回想"'), 'Saintess room flashback floor missing');
assert(map.includes('eventId: "light_palace_flashback_hexagram_trap"') && map.includes('x: 20') && map.includes('y: 6'), 'mandatory hexagram contact trigger missing');
assert(map.includes('missingFlag: "lightPalaceFlashbackActive"'), 'normal palace boss suppression during flashback missing');
assert(map.includes('entryEventId: "light_palace_present_assault_entry"') && story.includes('"LIGHT_PALACE_PRESENT_ASSAULT_ENTRY"'), 'present-day palace assault bridge missing');
assert(map.includes('"stateId": "claude_flashback_resume"') && map.includes('"eventId": "light_palace_flashback_start"'), 'flashback restart route after app/session interruption missing');

// Saintess room rows must exactly match its declared 17x13 footprint.
const saintStart = map.indexOf('label: "聖女の部屋・回想"');
const saintEnd = map.indexOf(']\n    },\n    GALVANIA_CAVE', saintStart);
const saint = map.slice(saintStart, saintEnd > saintStart ? saintEnd : saintStart + 2600);
const rows = [...saint.matchAll(/^\s+"([\^WTD]+)",?$/gm)].map(m => m[1]);
assert(rows.length === 13, `Saintess room expected 13 rows, got ${rows.length}`);
assert(rows.every(row => row.length === 17), `Saintess room has invalid row width: ${rows.map(r => r.length).join(',')}`);
assert(saint.includes('{ x: 7, y: 9, toFloor: 4, targetX: 17, targetY: 24'), 'Saintess room -> palace floor4 safe link missing');

assert(dungeon.includes('flags.lightPalaceFlashbackCompleted !== true'), 'Light Palace gate does not wait for flashback completion');
assert((news.match(/date: "2026\/08\/09"/g) || []).length === 1, 'NEWS_DATA must have exactly one 2026/08/09 record');
assert(news.includes('光の宮殿の回想プレイ区間'), '2026/08/09 news not updated');

if (!process.exitCode) console.log('[phase6d] PASS: Light Palace flashback route, isolation, checkpoints, Veld events, carryover, and news validated.');
