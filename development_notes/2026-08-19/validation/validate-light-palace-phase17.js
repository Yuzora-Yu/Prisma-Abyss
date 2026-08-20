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
const phaser = read('phaser-field.js');
const main = read('main.js');

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

const centerIndex = trap.indexOf('{ "op": "MOVE_PLAYER", "x": 17, "y": 19');
const circleIndex = trap.indexOf('"id": "flashback-genesis-circle"');
assert(centerIndex >= 0 && circleIndex > centerIndex, 'Leila must be centered at X17/Y19 before the ritual proceeds');
assert(!trap.includes('"key": "lightPalaceFlashbackTrapOrigin"'), 'trap actor positions must not depend on a captured player anchor');
assert(trap.includes('"id": "flashback-jasper-vortex", "src": "assets/effect/fx-abyss-vortex-ai.png", "x": 20, "y": 15'));
assert(trap.includes('"id": "flashback-jasper", "monsterId": 301070, "x": 20, "y": 15'));
assert(trap.includes('"id": "flashback-veld-vortex", "src": "assets/effect/fx-abyss-vortex-ai.png", "x": 17, "y": 16'));
assert(trap.includes('"id": "flashback-veld", "monsterId": 301064, "x": 17, "y": 16'));
assert(trap.includes('"id": "flashback-genesis-circle", "key": "ultimate-genesis-magic"'));
assert(trap.includes('"x": 17, "y": 16, "size": 9, "slices": 9'));

assert(logic.includes('const lightPalaceTrapRevision = 15;'), 'trap journal revision was not bumped for fixed-position replay');
assert(logic.includes("const jasperAnchor = { x:20, y:15, monsterId:301070, size:2.1 };"), 'persistent Jasper position is not canonical');
assert(logic.includes("const veldAnchor = { x:17, y:16, monsterId:301064, size:2.1 };"), 'persistent Veld position is not canonical');

assert(phaser.includes('storyFloorEffectSpecs: new Map()'), 'Phaser renderer does not retain pending world-space floor effect specs');
assert(phaser.includes('state.storyFloorEffectSpecs.set(idKey, spec);'), 'world-space floor effect spec is not queued');
assert(phaser.includes('syncStoryFloorEffectSprites();'), 'queued floor effects are not reconciled during renderer sync');
assert(phaser.includes('syncPersistentStoryVisuals();'), 'persistent story visuals are not re-synced after Phaser startup/resize');
assert(phaser.includes('const ensureStoryFloorEffectSprite = async (id, options = {}, timeoutMs = 2500)'), 'renderer lacks an awaitable floor-effect readiness path');
assert(logic.includes("shown = await renderer.ensureStoryFloorEffectSprite(id, floorEffectOptions, 2500);"), 'story event does not wait for the ritual circle to be actually rendered');
assert(phaser.includes('return true;\n    };\n\n    const syncStoryFloorEffectSprites'), 'showStoryFloorEffectSprite must accept a valid world-space spec even while renderer startup is pending');

// Runtime smoke: a valid floor effect submitted before Phaser has a scene must be accepted and retained,
// not rejected with the warning path that caused the Phase16 failure.
(async () => {
  let requestCount = 0;
  const sandbox = {
    console: { log(){}, info(){}, warn(){}, error(){} },
    Map, Set, Math, JSON, Promise, setTimeout, clearTimeout,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    document: { getElementById(){ return null; } },
    ResizeObserver: undefined,
    window: {
      MapRenderShared: {},
      GRAPHICS: {
        data: { 'ultimate-genesis-magic': 'assets/effect/fx_ultimate_244_genesis_magic.png' },
        images: {},
        async request(key) {
          requestCount += 1;
          assert.strictEqual(key, 'ultimate-genesis-magic');
          return { complete:true, naturalWidth:384, naturalHeight:384 };
        }
      }
    }
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.document = sandbox.document;
  sandbox.window.console = sandbox.console;
  sandbox.window.requestAnimationFrame = sandbox.requestAnimationFrame;
  sandbox.globalThis = sandbox.window;
  vm.runInNewContext(phaser, sandbox, { filename:'phaser-field.js' });
  const renderer = sandbox.window.PhaserFieldRenderer;
  assert(renderer, 'PhaserFieldRenderer export missing');
  assert.strictEqual(renderer.showStoryFloorEffectSprite('phase17-test-circle', {
    key:'ultimate-genesis-magic', x:17, y:16, size:9, slices:9, alpha:0.92, depthOffset:46
  }), true, 'valid floor effect must be accepted before renderer readiness');
  assert.strictEqual(renderer.removeStoryFloorEffectSprite('phase17-test-circle'), true, 'queued effect spec was not retained');
  await Promise.resolve();
  assert(requestCount >= 1, 'queued floor effect did not request its texture');

  assert(story.includes('"returnConstraint": { "areaKey": "THUNDER_FORT", "floor": 1, "fallbackX": 18, "fallbackY": 22 }'), 'flashback start lacks explicit present-time return constraint');
  assert(main.includes("if (String(context?.exitTrigger?.eventId || '') === 'light_palace_flashback_exit_veld')"), 'pre-Phase17 flashback contexts lack return compatibility fallback');
  assert(main.includes("return { areaKey:'THUNDER_FORT', floor:1, fallbackX:18, fallbackY:22 };"), 'return fallback target is not Thunder Fort 1F');
  assert(main.includes('App.applySceneContextReturnConstraint?.(context);'), 'SCENE_END does not enforce return constraint');

  console.log('OK: Light Palace Phase17 validation passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
