#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const story = read('story.js');
const logic = read('story_logic.js');
const battle = read('battle.js');
const main = read('main.js');
const phaser = read('phaser-field.js');
const assets = read('assets.js');
const map = read('map.js');
const sw = read('sw.js');
const polish = read('polish.js');

const between = (text, start, end) => {
  const a = text.indexOf(start);
  assert(a >= 0, `missing start marker: ${start}`);
  const b = text.indexOf(end, a + start.length);
  assert(b > a, `missing end marker: ${end}`);
  return text.slice(a, b);
};

const trap = between(story,
  '"light_palace_flashback_hexagram_trap": {',
  '"light_palace_flashback_veld1_after": {');
const postVeld = between(story,
  '"light_palace_flashback_veld1_after": {',
  '"light_palace_flashback_wrong_way": {');
const wrongWay = between(story,
  '"light_palace_flashback_wrong_way": {',
  '"light_palace_flashback_retry_start": {');

assert(trap.includes('"op": "SHOW_FLOOR_EFFECT"'));
assert(trap.includes('"src": "assets/effect/fx_ultimate_244_genesis_magic.png"'));
assert(trap.includes('"x": 17, "y": 16, "size": 4'));
assert(trap.includes('"dx": 3, "dy": -4'));
assert(trap.includes('"persistKey": "lightPalaceFlashbackJasper"'));
assert(trap.includes('"dy": -2'));
assert(trap.includes('"persistKey": "lightPalaceFlashbackVeld"'));
assert(!trap.includes('"op": "REMOVE_SPRITE", "id": "flashback-jasper"'));
assert(!trap.includes('"op": "REMOVE_SPRITE", "id": "flashback-veld"'));
assert(trap.includes('"finisherSkillName": "黒白の葬閃"'));
assert(trap.includes('"finisherEffectImage": "assets/effect/fx-neutral-slash-ai.png"'));
assert(trap.includes('"finisherFlashCount": 2'));

const idxRemove = trap.indexOf('"type": "SCENE_REMOVE_ALLY"');
const idxParty = trap.indexOf('"type": "SCENE_PARTY"');
const idxStep = trap.indexOf('"op": "MOVE_PLAYER", "dy": -1');
const idxVeldConv = trap.indexOf('"value": "LIGHT_PALACE_FLASHBACK_VELD_ARRIVAL"');
const idxResolved = trap.indexOf('"key": "lightPalaceFlashbackHexagramResolved"');
const idxBoss = trap.indexOf('"type": "BOSS"');
assert(idxRemove >= 0 && idxRemove < idxParty, 'Luna must leave before party is rebuilt');
assert(idxParty < idxStep, 'party rebuild must happen before Leila steps forward');
assert(idxStep < idxVeldConv, 'Leila step must precede Veld dialogue');
assert(idxVeldConv < idxResolved && idxResolved < idxBoss, 'trap completion flag must be late and before battle');

assert(postVeld.includes('"op": "SYNC_PERSISTENT_VISUALS"'), 'post-battle field must force persistent boss/NPC restore');
assert(wrongWay.includes('"op": "SYNC_PERSISTENT_VISUALS"'), 'wrong-way warning must restore threat visuals first');

const exitApproach = between(story,
  '"LIGHT_PALACE_FLASHBACK_EXIT_VELD": [',
  '"LIGHT_PALACE_FLASHBACK_ESCAPE_END": [');
const stepMatches = exitApproach.match(/"op": "MENACING_STEP"/g) || [];
assert.strictEqual(stepMatches.length, 3, 'Veld entrance approach must be three one-tile menacing steps');
assert(exitApproach.includes('"y": 21') && exitApproach.includes('"y": 22') && exitApproach.includes('"y": 23'));

const escapeEnd = between(story,
  '"LIGHT_PALACE_FLASHBACK_ESCAPE_END": [',
  '"LIGHT_PALACE_FLASHBACK_RETURN_AFTERMATH": [');
assert(escapeEnd.includes('"op": "START_MOVE_SPRITE", "id": "flashback-exit-claude"'));
assert(escapeEnd.indexOf('START_MOVE_SPRITE') < escapeEnd.indexOf('レオン――！'), 'Claude must start flying out while his line is displayed');

assert(logic.includes("case 'SYNC_PERSISTENT_VISUALS':"));
assert(logic.includes("flags.lightPalaceFlashbackJasperAppeared === true"));
assert(logic.includes("flags.lightPalaceFlashbackVeldAppeared === true"));
assert(logic.includes("getStoryFieldVisualAnchorState('lightPalaceFlashbackJasper')"));
assert(logic.includes("getStoryFieldVisualAnchorState('lightPalaceFlashbackVeld')"));
assert(logic.includes("showStoryFloorEffectSprite?.('flashback-genesis-circle'"));
assert(logic.includes("lightPalaceTrapRevision = 13"));
assert(logic.includes("journal.active.status === 'error'"));

assert(phaser.includes('storyFloorEffects: new Map()'));
assert(phaser.includes('const showStoryFloorEffectSprite = (id, options = {}) =>'));
assert(phaser.includes('const rowDepth = Math.floor(sliceCenterTileY) * 100 + depthOffset'));
assert(phaser.includes('onUpdate: syncMovingDepth'), 'long moving actors must update depth continuously');

assert(battle.includes("finisherEffectImage:null, finisherFlashCount:null"));
assert(battle.includes("fx.screenEffect('neutral-slash'"));
assert(polish.includes('const regionId = target && this.isParty(target) ? \"battle-party-bar\" : \"enemy-container\";'), 'finisher target region must resolve to the ally party bar');
const visualCall = battle.indexOf('await Battle.playEventBattleFinisherVisual(rules, living);');
const damageLoop = battle.indexOf('living.forEach(member => {', visualCall);
assert(visualCall >= 0 && damageLoop > visualCall, 'slash/flashes must finish before 9999 damage logs');
assert(battle.includes("battleData.eventFinisherTriggerReason = hpFloorReady ? 'hp_floor' : 'turn_limit'"));

assert(main.includes('StoryManager.syncLightPalaceFlashbackPersistentVisuals'));
assert(assets.includes('"neutral-slash-ai": "assets/effect/fx-neutral-slash-ai.png"'));
assert(sw.includes('prisma-abyss-v86.20260819'));

assert(map.includes('rect: { x1: 16, y1: 20, x2: 18, y2: 20 }'));
assert(map.includes('eventId: "light_palace_flashback_hexagram_trap"'));
assert(map.includes('rect: { x1: 16, y1: 19, x2: 18, y2: 19 }'));
assert(map.includes('eventId: "light_palace_flashback_wrong_way"'));

// Reproduce the important compatibility case that Phase 12 could still miss:
// old hexagram event cursor is already in ERROR, HexagramResolved may be false,
// and action indices no longer match the current definition. Phase 13 must restart it.
const sandbox = {
  console: { log(){}, info(){}, warn(){}, error(){} },
  window: {},
  STORY_MANAGER_DATA: {
    events: {
      light_palace_flashback_hexagram_trap: { actions: [{}], winActions: [] }
    }
  },
  App: {
    data: {
      progress: {
        flags: {
          lightPalaceFlashbackActive: true,
          lightPalaceFlashbackHexagramResolved: false,
          lightPalaceFlashbackVeldEncounterStarted: false,
          lightPalaceFlashbackRetreatOrdered: false
        },
        eventJournal: {
          version: 2,
          queue: [],
          active: {
            token: 'old-error',
            eventId: 'light_palace_flashback_hexagram_trap',
            phase: 'actions',
            status: 'error',
            currentPath: [4],
            completedActions: { '0': true, '1': true, '2': true, '3': true },
            selectedBranches: {},
            effectStates: {},
            meta: {},
            error: { message: '回想パーティを変更できませんでした。' }
          }
        }
      }
    },
    save() {}
  },
  setTimeout, clearTimeout, Date, Math, JSON, Map, Set, Promise
};
sandbox.globalThis = sandbox;
vm.runInNewContext(logic + '\n;globalThis.__StoryManager = StoryManager;', sandbox, { filename: 'story_logic.js' });
const journal = sandbox.__StoryManager.ensureEventJournal();
assert(journal?.active, 'old error journal must stay active for recovery');
assert.strictEqual(journal.active.status, 'running');
assert.strictEqual(journal.active.currentPath, null);
assert.deepStrictEqual(Object.keys(journal.active.completedActions), []);
assert.strictEqual(journal.active.meta.lightPalaceTrapRevision, 13);
assert.strictEqual(journal.active.meta.lightPalaceTrapRecovery, 'phase13-restart-before-veld');
assert.strictEqual(sandbox.App.data.progress.flags.lightPalaceFlashbackHexagramResolved, false);

for (const rel of [
  'assets/effect/fx-neutral-slash-ai.png',
  'assets/effect/fx_ultimate_244_genesis_magic.png',
  'assets/effect/fx-abyss-vortex-ai.png'
]) {
  assert(fs.existsSync(path.join(root, rel)), `missing runtime effect asset: ${rel}`);
}

console.log('Phase 13 Light Palace validation: OK');
console.log('  - hexagram ordering / persistent Jasper+Veld / genesis floor effect: OK');
console.log('  - old ERROR cursor replay compatibility: OK');
console.log('  - menacing Veld approach / Claude moving depth support: OK');
console.log('  - black-white finisher effect before 9999 logs: OK');
