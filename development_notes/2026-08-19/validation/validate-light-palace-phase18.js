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
const main = read('main.js');
const phaser = read('phaser-field.js');
const assets = read('assets.js');

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
assert(!trap.includes('{ "op": "MOVE_PLAYER", "x": 17, "y": 19, "direction": "up", "duration": 120 }'),
  'trap must not warp Leila to X17 at event start');
assert(trap.includes('{ "type": "FLAG", "key": "lightPalaceFlashbackRitualVisible", "refreshField": true }'),
  'ritual visibility must redraw from persistent MAP state immediately');
assert(!trap.includes('"op": "SHOW_FLOOR_EFFECT"'),
  'hexagram event must not depend on a one-shot Phaser floor-effect command');
assert(trap.includes('{ "op": "ADVANCE_PLAYER_CENTER_NORTH", "centerX": 17, "stepDuration": 150 }'),
  'post-bind movement must center only when advancing toward Veld');
assert(trap.includes('"id": "flashback-jasper", "monsterId": 301070, "x": 20, "y": 15'));
assert(trap.includes('"id": "flashback-veld", "monsterId": 301064, "x": 17, "y": 16'));
assert(trap.includes('"key": "lightPalaceFlashbackJasperAppeared", "refreshField": true'));
assert(trap.includes('"key": "lightPalaceFlashbackVeldAppeared", "refreshField": true'));

const exitEvent = between(story,
  '"light_palace_flashback_exit_veld": {',
  '"light_palace_flashback_escape_end": {');
assert(exitEvent.includes('{ "op": "BARRIER_REPEL", "x": 17, "y": 26'),
  'barrier contact must flash/shake and repel before staging');

assert(logic.includes('const lightPalaceTrapRevision = 16;'), 'trap revision must be 16');
const floorBlock = between(logic, "case 'SHOW_FLOOR_EFFECT': {", "case 'REMOVE_FLOOR_EFFECT':");
assert(!floorBlock.includes('ensureStoryFloorEffectSprite'), 'story progression must not wait for Phaser floor effect readiness');
assert(!floorBlock.includes('world-space floor effect could not be rendered'), 'known Phaser fallback must not produce the old blocking warning');
assert(floorBlock.includes('Field.render?.();'), 'world-space effect must trigger the active renderer/fallback render path');
assert(logic.includes('getLightPalaceFlashbackPersistentVisualState: function()'), 'persistent visual state source missing');
assert(main.includes('const drawPersistentStoryFloorEffectCell ='), 'legacy Canvas floor-effect fallback missing');
assert(main.includes('drawPersistentStoryFloorEffectCell(tx, ty, drawX, drawY);'), 'legacy floor effect is not drawn in the tile pass');
assert(main.includes('const drawPersistentStoryActors ='), 'legacy persistent actor fallback missing');
assert(main.includes('drawPersistentStoryActors();'), 'legacy persistent actors are not rendered');
assert(main.includes('const refreshed = PhaserFieldRenderer.refresh();'), 'Field.refreshVisualState does not inspect Phaser refresh success');
assert(main.includes('if (refreshed === true) return true;'), 'successful Phaser refresh must short-circuit only on true');
assert(phaser.includes('if (!state.ready || state.failed || !state.pendingField) return false;'), 'Phaser refresh must report unavailable renderer state');
assert(phaser.includes('return true;\n            } catch (error)'), 'Phaser refresh must report successful repaint');
assert(assets.includes('if (refreshed !== true && typeof Field !== "undefined" && typeof Field.render === "function") Field.render();'), 'delayed image redraw must fall back to Field.render when Phaser cannot refresh');


// The trap tile and the retreat-warning tile intentionally overlap. Runtime lookup must
// skip a consumed/inactive story effect instead of stopping at the first authored entry.
const runtimeEffectMethods = between(main,
  '    isRuntimeTileEffectEnabled: (effect) => {',
  '    getTileEffectMarkerColor: (tileX = null, tileY = null) => {');
const runtimeSandbox = { console, Number, String, Array, Object, Math };
runtimeSandbox.App = {
  data: { progress: { flags: {
    lightPalaceFlashbackActive:true,
    lightPalaceFlashbackHexagramTriggered:true,
    lightPalaceFlashbackRetreatOrdered:true,
    lightPalaceFlashbackCompleted:false,
  } } },
  evaluateGameConditions(conditions) {
    const flags = this.data.progress.flags;
    const requiredFlags = [ ...(conditions.requiredFlags || []), ...(conditions.requiredFlag ? [conditions.requiredFlag] : []) ];
    const missingFlags = [ ...(conditions.missingFlags || []), ...(conditions.missingFlag ? [conditions.missingFlag] : []) ];
    return requiredFlags.every(flag => !!flags[flag]) && missingFlags.every(flag => !flags[flag]);
  }
};
runtimeSandbox.MapRegistry = {
  isTileEffectApplicableAt(_map, _effect, x, y) { return Number(x) >= 16 && Number(x) <= 18 && Number(y) === 19; },
  findTileEffect(){ return null; }
};
vm.runInNewContext(`globalThis.__runtimeEffectHelper = ({${runtimeEffectMethods}});`, runtimeSandbox, { filename:'runtime-effect-helper.js' });
runtimeSandbox.Field = runtimeSandbox.__runtimeEffectHelper;
runtimeSandbox.Field.currentMapData = { isFixed:true, tileEffects:[
  { type:'storyEvent', eventId:'light_palace_flashback_hexagram_trap', eventFlag:'lightPalaceFlashbackHexagramTriggered', conditions:{ requiredFlag:'lightPalaceFlashbackActive', missingFlags:['lightPalaceFlashbackRetreatOrdered'] } },
  { type:'storyEvent', eventId:'light_palace_flashback_wrong_way', conditions:{ requiredFlags:['lightPalaceFlashbackActive','lightPalaceFlashbackRetreatOrdered'], missingFlag:'lightPalaceFlashbackCompleted' } }
] };
const selectedRetreatEffect = runtimeSandbox.Field.getRuntimeTileEffectAt(17, 19);
assert.strictEqual(selectedRetreatEffect?.eventId, 'light_palace_flashback_wrong_way', 'retreat warning was masked by the consumed trap effect');

(async () => {
  const warnings = [];
  const sandbox = {
    console: { log(){}, info(){}, warn(...args){ warnings.push(args.join(' ')); }, error(){} },
    Set, Map, Math, JSON, Date, Promise, setTimeout, clearTimeout,
  };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  vm.runInNewContext(logic + '\n;globalThis.__SM = StoryManager;', sandbox, { filename:'story_logic.js' });
  const manager = sandbox.__SM;

  sandbox.App = {
    data: {
      location: { area:'LIGHT_PALACE', x:16, y:19 },
      progress: { floor:3, flags:{
        lightPalaceFlashbackActive:true,
        lightPalaceFlashbackCompleted:false,
        lightPalaceFlashbackRitualVisible:true,
        lightPalaceFlashbackJasperAppeared:true,
        lightPalaceFlashbackVeldAppeared:true,
      } }
    },
    save(){}, lockFieldInput(){},
  };
  sandbox.Dungeon = { floor:3 };
  let renders = 0;
  sandbox.Field = {
    x:16, y:19, dir:3,
    getCurrentAreaKey(){ return 'LIGHT_PALACE'; },
    ensureFieldVisualLayer(){ return { style:{}, innerHTML:'' }; },
    refreshVisualState(){ renders += 1; },
    refreshCurrentAction(){},
    render(){ renders += 1; },
  };
  let floorRequests = 0;
  sandbox.PhaserFieldRenderer = {
    showStoryFloorEffectSprite(){ floorRequests += 1; return false; },
    removeStoryFloorEffectSprite(){ return true; },
    isReady(){ return false; },
  };
  sandbox.GRAPHICS = {
    data: { 'ultimate-genesis-magic':'assets/effect/fx_ultimate_244_genesis_magic.png' },
    images: { 'ultimate-genesis-magic': { complete:true, naturalWidth:384, naturalHeight:384 } },
    request(){ throw new Error('should already be ready'); }
  };
  sandbox.document = { getElementById(){ return null; } };

  const state = manager.getLightPalaceFlashbackPersistentVisualState();
  assert.strictEqual(state.floorEffects.length, 1);
  assert.deepStrictEqual({x:state.floorEffects[0].x,y:state.floorEffects[0].y,size:state.floorEffects[0].size}, {x:17,y:16,size:9});
  assert.strictEqual(JSON.stringify(state.actors.map(a => [a.monsterId,a.x,a.y])), JSON.stringify([[301070,20,15],[301064,17,16]]));

  await manager.runStoryFieldVisualCommands([
    { op:'SHOW_FLOOR_EFFECT', id:'flashback-genesis-circle', key:'ultimate-genesis-magic', x:17, y:16, size:9, worldSpace:true }
  ]);
  assert.strictEqual(floorRequests, 1, 'Phaser request should still be queued when available');
  assert(renders >= 1, 'fallback render was not requested');
  assert(!warnings.some(w => w.includes('world-space floor effect could not be rendered')), 'old floor-effect warning still fires');

  sandbox.Field.x = 16; sandbox.Field.y = 19;
  sandbox.App.data.location.x = 16; sandbox.App.data.location.y = 19;
  await manager.runStoryFieldVisualCommands([{ op:'ADVANCE_PLAYER_CENTER_NORTH', centerX:17, stepDuration:1 }]);
  assert.strictEqual(sandbox.Field.x, 17); assert.strictEqual(sandbox.Field.y, 18);

  sandbox.Field.x = 18; sandbox.Field.y = 19;
  sandbox.App.data.location.x = 18; sandbox.App.data.location.y = 19;
  await manager.runStoryFieldVisualCommands([{ op:'ADVANCE_PLAYER_CENTER_NORTH', centerX:17, stepDuration:1 }]);
  assert.strictEqual(sandbox.Field.x, 17); assert.strictEqual(sandbox.Field.y, 18);

  sandbox.Field.x = 17; sandbox.Field.y = 27;
  sandbox.App.data.location.x = 17; sandbox.App.data.location.y = 27;
  manager.flashStoryFieldScreen = async () => true;
  manager.shakeStoryFieldScreen = async () => true;
  await manager.runStoryFieldVisualCommands([{ op:'BARRIER_REPEL', x:17, y:26, repelDelayMs:1, duration:1 }]);
  assert.strictEqual(sandbox.Field.x, 17); assert.strictEqual(sandbox.Field.y, 26);

  console.log('OK: Light Palace Phase18 validation passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
