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

const between = (text, start, end) => {
  const a = text.indexOf(start);
  assert(a >= 0, `missing start marker: ${start}`);
  const b = text.indexOf(end, a + start.length);
  assert(b > a, `missing end marker: ${end}`);
  return text.slice(a, b);
};

// The requested 9-tile circle is not oversized at source level: it is a 384x384 texture.
// Rendering failed before display-size calculation because the lazy-loaded Image was not complete yet.
const png = fs.readFileSync(path.join(root, 'assets/effect/fx_ultimate_244_genesis_magic.png'));
assert.strictEqual(png.toString('ascii', 1, 4), 'PNG');
assert.strictEqual(png.readUInt32BE(16), 384, 'genesis magic width must be 384');
assert.strictEqual(png.readUInt32BE(20), 384, 'genesis magic height must be 384');

assert(logic.includes('ensureStoryGraphicReady: async function(keyOrSrc)'), 'generic story graphic preload helper missing');
assert(logic.includes('if (graphicRef) await this.ensureStoryGraphicReady(graphicRef);'), 'SHOW_FLOOR_EFFECT does not await lazy image load');
assert(logic.includes('for (const delay of [34, 80, 140])'), 'world-space floor effect retry window was not expanded');
assert(logic.includes('this.ensureStoryGraphicReady(floorEffectOptions.key).then((ready) =>'), 'persistent floor effect does not resync after lazy load');

const postVeld = between(story,
  '"light_palace_flashback_veld1_after": {',
  '"light_palace_flashback_wrong_way": {');
assert(postVeld.includes('"id": "flashback-postveld-leon", "characterId": 305, "x": 16, "y": 21'), 'Leon does not retreat 3 tiles south after flash bomb');
assert(postVeld.includes('"id": "flashback-postveld-claude", "characterId": 304, "x": 18, "y": 21'), 'Claude does not retreat 3 tiles south after flash bomb');
assert(postVeld.includes('"op": "MOVE_PLAYER", "x": 17, "y": 20'));
assert(postVeld.includes('"op": "MOVE_PLAYER", "x": 17, "y": 21'));
assert(postVeld.includes('"op": "MOVE_PLAYER", "x": 17, "y": 22'));
const retreatMoveIndex = postVeld.indexOf('"op": "MOVE_PLAYER", "x": 17, "y": 22');
const retreatFlagIndex = postVeld.indexOf('"key": "lightPalaceFlashbackRetreatOrdered"');
assert(retreatMoveIndex >= 0 && retreatFlagIndex > retreatMoveIndex, 'retreat flag must be armed after the scripted southward escape');

const map3f = between(map,
  'label: "3階・結界の聖廊"',
  'label: "4階・光の祭壇"');
const y19Rects = map3f.match(/rect: \{ x1: 16, y1: 19, x2: 18, y2: 19 \}/g) || [];
assert.strictEqual(y19Rects.length, 2, 'trap and post-battle wrong-way rows must both use X16-18/Y19 with disjoint flags');
assert(map3f.includes('eventId: "light_palace_flashback_hexagram_trap"'));
assert(map3f.includes('eventId: "light_palace_flashback_wrong_way"'));

(async () => {
  let requestCount = 0;
  const loadedImage = { complete: true, naturalWidth: 384, naturalHeight: 384 };
  const sandbox = {
    console: { log(){}, info(){}, warn(){}, error(){} },
    window: {},
    document: undefined,
    STORY_MANAGER_DATA: { events: {} },
    GRAPHICS: {
      data: { 'ultimate-genesis-magic': 'assets/effect/fx_ultimate_244_genesis_magic.png' },
      images: {},
      async request(key) {
        requestCount += 1;
        assert.strictEqual(key, 'ultimate-genesis-magic');
        this.images[key] = loadedImage;
        return loadedImage;
      }
    },
    App: { data: { progress: { flags: {} } } },
    setTimeout, clearTimeout, Date, Math, JSON, Map, Set, Promise
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.runInNewContext(`${logic}\n;globalThis.__StoryManager = StoryManager;`, sandbox, { filename: 'story_logic.js' });
  const manager = sandbox.__StoryManager;
  assert.strictEqual(manager.isStoryGraphicReady('ultimate-genesis-magic'), false);
  assert.strictEqual(await manager.ensureStoryGraphicReady('ultimate-genesis-magic'), true);
  assert.strictEqual(requestCount, 1, 'lazy story image should be requested once');
  assert.strictEqual(manager.isStoryGraphicReady('assets/effect/fx_ultimate_244_genesis_magic.png'), true, 'src path should resolve back to the registered graphics key');

  console.log('OK: Light Palace Phase16 validation passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
