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
const map = read('map.js');
const dungeon = read('dungeon.js');
const main = read('main.js');
const phaser = read('phaser-field.js');
const sw = read('sw.js');

const between = (text, start, end) => {
  const a = text.indexOf(start);
  assert(a >= 0, `missing start marker: ${start}`);
  const b = text.indexOf(end, a + start.length);
  assert(b > a, `missing end marker: ${end}`);
  return text.slice(a, b);
};

// --- 3F event text / coordinates / flow ---
assert(story.includes('広間を出ようとした瞬間、床に六芒星が閃きルーナの足に絡みついた。'));
assert(!story.includes('六芒星の間へ踏み込んだ瞬間、床の光条が閉じ、ルーナの足元へ六つの楔が走った。'));

const trap = between(story,
  '"light_palace_flashback_hexagram_trap": {',
  '"light_palace_flashback_veld1_after": {');
// Phase17 supersedes the Phase14 captured-player anchor with fixed MAP coordinates.
assert(trap.includes('{ "op": "CAPTURE_ANCHOR", "key": "lightPalaceFlashbackTrapOrigin" }') || trap.includes('{ "op": "MOVE_PLAYER", "x": 17, "y": 19'));
assert(trap.includes('"x": 17, "y": 16, "size": 9, "slices": 9'));
assert(trap.includes('"depthOffset": 46, "worldSpace": true'));
assert(trap.includes('"op": "FLASH_SHAKE"'));
assert(trap.includes('"value": "LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRIGGER"'));
assert(trap.includes('"anchorKey": "lightPalaceFlashbackTrapOrigin", "dx": 3, "dy": -4') || trap.includes('"x": 20, "y": 15'));
assert(trap.includes('"persistKey": "lightPalaceFlashbackJasper"'));
assert(trap.includes('"anchorKey": "lightPalaceFlashbackTrapOrigin", "dy": -3') || trap.includes('"x": 17, "y": 16'));
assert(trap.includes('"persistKey": "lightPalaceFlashbackVeld"'));
assert(!trap.includes('"base": "player"'), 'persistent 3F actors must not follow the live player position');

const idxCircle = trap.indexOf('"op": "SHOW_FLOOR_EFFECT"');
const idxShake = trap.indexOf('"op": "FLASH_SHAKE"');
const idxTriggerText = trap.indexOf('"value": "LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRIGGER"');
const idxSecondFlash = trap.indexOf('"op": "SCREEN_FLASH"', idxTriggerText);
const idxJasperFx = trap.indexOf('"id": "flashback-jasper-vortex"');
const idxJasper = trap.indexOf('"id": "flashback-jasper"');
const idxJasperConv = trap.indexOf('"value": "LIGHT_PALACE_FLASHBACK_HEXAGRAM_TRAP"');
assert(idxCircle >= 0 && idxCircle < idxShake && idxShake < idxTriggerText,
  'circle + flash/shake must happen before trigger narration');
assert(idxTriggerText < idxSecondFlash && idxSecondFlash < idxJasperFx && idxJasperFx < idxJasper && idxJasper < idxJasperConv,
  'Jasper appearance flow must be narration -> flash -> vortex -> Jasper -> dialogue');

const postVeld = between(story,
  '"light_palace_flashback_veld1_after": {',
  '"light_palace_flashback_wrong_way": {');
assert(postVeld.includes('"op": "MOVE_PLAYER", "x": 17, "y": 19'));
assert(postVeld.includes('"x": 16, "y": 18, "direction": "up"'));
assert(postVeld.includes('"x": 18, "y": 18, "direction": "up"'));

const map3f = between(map,
  'label: "3階・結界の聖廊"',
  'label: "4階・光の祭壇"');
assert(map3f.includes('rect: { x1: 16, y1: 19, x2: 18, y2: 19 }'));
assert(map3f.includes('eventFlag: "lightPalaceFlashbackHexagramTriggered"'));
assert(map3f.includes('rect: { x1: 16, y1: 19, x2: 18, y2: 19 }')); // Phase16で退却後の制止判定を1マス南へ戻した
assert(map3f.includes('eventId: "light_palace_flashback_wrong_way"'));

// --- Down means no going back up during the retreat ---
const blockedStairMatches = map.match(/blockedEventId: "light_palace_flashback_wrong_way_stairs"/g) || [];
assert.strictEqual(blockedStairMatches.length, 2, 'both 1F->2F and 2F->3F return stairs must be blocked during retreat');
assert(map.includes('blockedLabel: "2階へ戻る"'));
assert(map.includes('blockedLabel: "3階へ戻る"'));
assert(dungeon.includes('isFixedFloorLinkBlocked: (link, flags = App.data?.progress?.flags || {}) =>'));
assert(dungeon.includes('runFixedFloorLinkBlockedFeedback: (link) =>'));

// --- One-shot tile events: persist the latch before async event execution ---
const storyEffect = between(dungeon,
  "if (effect.type === 'storyEvent') {",
  "if (effect.type === 'hunter') {");
assert(storyEffect.includes("const flags = App.data.progress.flags || (App.data.progress.flags = {});"));
const idxLatch = storyEffect.indexOf('flags[flagKey] = true;');
const idxSave = storyEffect.indexOf('App.save?.();');
const idxExecute = storyEffect.indexOf('StoryManager.executeEvent(eventId);');
assert(idxLatch >= 0 && idxLatch < idxSave && idxSave < idxExecute,
  'story-event latch must be saved before asynchronous execution starts');

// --- Shared map-coordinate rendering stability ---
assert(logic.includes('const storedAnchor = cmd?.anchorKey ? this.getStoryFieldVisualAnchorState(cmd.anchorKey) : null;'));
assert(logic.includes("case 'CAPTURE_ANCHOR':"));
assert(logic.includes('syncLightPalaceFlashbackPersistentVisuals: function()'));
const syncBlock = between(logic,
  'syncLightPalaceFlashbackPersistentVisuals: function()',
  'setStoryUiCutsceneHidden: function');
assert(syncBlock.includes("x: 17,\n                y: 16,\n                size: 9"));
assert(syncBlock.includes("const jasperAnchor = { x:20, y:15, monsterId:301070, size:2.1 };") || syncBlock.includes("getStoryFieldVisualAnchorState('lightPalaceFlashbackJasper')"));
assert(syncBlock.includes("const veldAnchor = { x:17, y:16, monsterId:301064, size:2.1 };") || syncBlock.includes("getStoryFieldVisualAnchorState('lightPalaceFlashbackVeld')"));
assert(!/flags\.lightPalaceFlashback\w+\s*=(?!=)/.test(syncBlock),
  'render synchronization must not mutate progression flags');
assert(main.includes('refreshFieldVisualLayerPositions: () =>'));
assert(main.includes("layer.querySelectorAll('[data-tile-x][data-tile-y]')"));
assert(phaser.includes('storyObjects: new Map()'));
assert(phaser.includes('storyFloorEffects: new Map()'));
assert(phaser.includes('Number(existing.x) === x'));
assert(phaser.includes('Number(existing.y) === y'));
assert(phaser.includes('const requestedDepthOffset = Number.isFinite(Number(options.depthOffset)) ? Number(options.depthOffset) : 46;'));
assert(phaser.includes('const rowDepth = Math.floor(sliceCenterTileY) * 100 + depthOffset'));

// Revision must be identical in recovery and new executions. A mismatch used to
// restart a live event every time ensureEventJournal() ran.
assert(logic.includes('const lightPalaceTrapRevision = 15;'));
assert(logic.includes('active.meta.lightPalaceTrapRevision = 15;'));
assert(!logic.includes('active.meta.lightPalaceTrapRevision = 13;')); 

// Runtime smoke: persistent visuals stay on the same map tiles when the player/camera moves.
const calls = { floor: [], monsters: [] };
const sandbox = {
  console: { log(){}, info(){}, warn(){}, error(){} },
  window: {},
  document: undefined,
  STORY_MANAGER_DATA: { events: { light_palace_flashback_hexagram_trap: { actions: [{}], winActions: [] } } },
  Dungeon: { floor: 3 },
  Field: {
    x: 16,
    y: 19,
    getCurrentAreaKey: () => 'LIGHT_PALACE'
  },
  PhaserFieldRenderer: {
    isReady: () => true,
    showStoryFloorEffectSprite(id, options) { calls.floor.push({ id, ...options }); return true; },
    showStoryMonsterSprite(id, options) { calls.monsters.push({ id, ...options }); return true; },
    removeStoryFloorEffectSprite() { return true; },
    removeStoryCharacterSprite() { return true; },
    clearStoryCharacterSprites() {},
    clearStoryFloorEffectSprites() {}
  },
  App: {
    data: {
      location: { area: 'LIGHT_PALACE' },
      progress: {
        floor: 3,
        flags: {
          lightPalaceFlashbackActive: true,
          lightPalaceFlashbackCompleted: false,
          lightPalaceFlashbackRitualVisible: true,
          lightPalaceFlashbackJasperAppeared: true,
          lightPalaceFlashbackVeldAppeared: true,
          lightPalaceFlashbackVeldEncounterStarted: true
        },
        storyVisualAnchors: {
          lightPalaceFlashbackTrapOrigin: { x: 16, y: 19, areaKey: 'LIGHT_PALACE', floor: 3 },
          lightPalaceFlashbackJasper: { x: 19, y: 15, areaKey: 'LIGHT_PALACE', floor: 3, monsterId: 301070, size: 2.1 },
          lightPalaceFlashbackVeld: { x: 16, y: 16, areaKey: 'LIGHT_PALACE', floor: 3, monsterId: 301064, size: 2.1 }
        }
      }
    },
    save() {}
  },
  setTimeout, clearTimeout, Date, Math, JSON, Map, Set, Promise
};
sandbox.globalThis = sandbox;
vm.runInNewContext(logic + '\n;globalThis.__StoryManager = StoryManager;', sandbox, { filename: 'story_logic.js' });
const manager = sandbox.__StoryManager;
manager.syncLightPalaceFlashbackPersistentVisuals();
sandbox.Field.x = 27;
sandbox.Field.y = 7;
manager.syncLightPalaceFlashbackPersistentVisuals();
assert.strictEqual(calls.floor.length, 2);
calls.floor.forEach(call => {
  assert.strictEqual(call.x, 17);
  assert.strictEqual(call.y, 16);
  assert.strictEqual(call.size, 9);
});
assert.strictEqual(calls.monsters.length, 4);
for (const call of calls.monsters.filter(c => c.id === 'flashback-jasper')) {
  assert.strictEqual(call.x, 20);
  assert.strictEqual(call.y, 15);
}
for (const call of calls.monsters.filter(c => c.id === 'flashback-veld')) {
  assert.strictEqual(call.x, 17);
  assert.strictEqual(call.y, 16);
}
const anchored = manager.resolveStoryFieldVisualTile({ anchorKey: 'lightPalaceFlashbackTrapOrigin', dx: 3, dy: -4 }, { x: 999, y: 999 });
assert.strictEqual(anchored.x, 19);
assert.strictEqual(anchored.y, 15);

const active = manager.beginEventExecution('light_palace_flashback_hexagram_trap', 'actions', { token: 'phase14' });
assert.strictEqual(active.meta.lightPalaceTrapRevision, 15);

// Compatibility smoke for the user's old validation save: an ERROR cursor from an
// older trap definition is rewound to the idempotent beginning instead of trusting
// obsolete action indices. This cannot recreate a missing pre-flashback snapshot,
// but it does keep recoverable journals from looping on the old failing action.
const recoverySandbox = {
  console: { log(){}, info(){}, warn(){}, error(){} },
  window: {},
  STORY_MANAGER_DATA: { events: { light_palace_flashback_hexagram_trap: { actions: [{}], winActions: [] } } },
  App: {
    data: {
      progress: {
        flags: {
          lightPalaceFlashbackActive: true,
          lightPalaceFlashbackHexagramTriggered: true,
          lightPalaceFlashbackHexagramResolved: false,
          lightPalaceFlashbackVeldEncounterStarted: false,
          lightPalaceFlashbackRetreatOrdered: false
        },
        eventJournal: {
          version: 2, queue: [],
          active: {
            token: 'phase13-error', eventId: 'light_palace_flashback_hexagram_trap', phase: 'actions',
            status: 'error', currentPath: [4], completedActions: { '0': true, '1': true, '2': true, '3': true },
            selectedBranches: {}, effectStates: {}, meta: { lightPalaceTrapRevision: 13 },
            error: { message: '回想パーティを変更できませんでした。' }
          }
        }
      }
    },
    save() {}
  },
  setTimeout, clearTimeout, Date, Math, JSON, Map, Set, Promise
};
recoverySandbox.globalThis = recoverySandbox;
vm.runInNewContext(logic + '\n;globalThis.__StoryManager = StoryManager;', recoverySandbox, { filename: 'story_logic.js' });
const recovered = recoverySandbox.__StoryManager.ensureEventJournal().active;
assert.strictEqual(recovered.status, 'running');
assert.strictEqual(recovered.currentPath, null);
assert.deepStrictEqual(Object.keys(recovered.completedActions), []);
assert.strictEqual(recovered.meta.lightPalaceTrapRevision, 15);
assert.strictEqual(recoverySandbox.App.data.progress.flags.lightPalaceFlashbackHexagramResolved, false);

assert(/prisma-abyss-v\d+\.20260819/.test(sw)); // cumulative current-state cache version

console.log('Phase 14 Light Palace validation: OK');
console.log('  - 9-tile fixed hexagram / new narration / Jasper flow: OK');
console.log('  - one-tile north shift / rescue staging / current wrong-way row: OK');
console.log('  - world-coordinate persistence across player/camera movement: OK');
console.log('  - one-shot event latch saved before execution: OK');
console.log('  - 2F->3F and 1F->2F retreat stairs blocked: OK');
console.log('  - trap journal revision consistency / old ERROR cursor rewind: OK');
