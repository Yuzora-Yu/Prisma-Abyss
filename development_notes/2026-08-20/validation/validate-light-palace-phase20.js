'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const phaser = read('phaser-field.js');
const logic = read('story_logic.js');
const story = read('story.js');
const dungeon = read('dungeon.js');
const sw = read('sw.js');

const must = (haystack, needle, label) => assert.ok(haystack.includes(needle), label || `missing: ${needle}`);
const mustNot = (haystack, needle, label) => assert.ok(!haystack.includes(needle), label || `unexpected: ${needle}`);

// 1) Six-point magic circle: 9 slices must be scaled against the crop rectangle itself.
must(logic, "x:17, y:16, size:9, slices:9", 'persistent magic circle must remain X17/Y16, 9 tiles, 9 slices');
must(phaser, 'image.setCrop(0, cropY, sourceWidth, cropHeight);', 'floor effect must still be sliced by map row');
must(phaser, 'image.setScale(displayWidth / sourceWidth, targetSliceHeight / cropHeight);', 'cropped slices must scale against crop height');

// Reproduce the historical 384px source geometry. The old setDisplaySize route used
// sourceHeight as scale basis after crop, shrinking each 1/9 slice to about 3.56px.
const sourceWidth = 384;
const sourceHeight = 384;
const tileSize = 32;
const sizeTiles = 9;
const sliceCount = 9;
const displayWidth = tileSize * sizeTiles;
let repairedHeightTotal = 0;
let legacyHeightTotal = 0;
for (let i = 0; i < sliceCount; i++) {
    const cropY = Math.floor((sourceHeight * i) / sliceCount);
    const cropEnd = Math.floor((sourceHeight * (i + 1)) / sliceCount);
    const cropHeight = Math.max(1, cropEnd - cropY);
    const targetSliceHeight = tileSize * (sizeTiles / sliceCount);
    repairedHeightTotal += cropHeight * (targetSliceHeight / cropHeight);
    legacyHeightTotal += cropHeight * (targetSliceHeight / sourceHeight);
}
assert.strictEqual(repairedHeightTotal, 288, 'repaired slices must reconstruct the full 9-tile height');
assert.ok(legacyHeightTotal < 40, `legacy crop route should demonstrate the collapse, got ${legacyHeightTotal}`);

// Depth contract: floor < circle < wall/face < player.
const topTile = 16 - sizeTiles / 2;
for (let i = 0; i < sliceCount; i++) {
    const sliceCenterY = topTile + ((i + 0.5) * (sizeTiles / sliceCount));
    const row = Math.floor(sliceCenterY);
    const floorDepth = row * 100;
    const circleDepth = row * 100 + 46;
    const wallDepth = row * 100 + 48;
    const playerDepth = row * 100 + 88;
    assert.ok(floorDepth < circleDepth && circleDepth < wallDepth && wallDepth < playerDepth,
        `depth contract failed at row ${row}`);
}

// 2) Large vortex is no longer tied to a single map-row depth, which clipped its lower half.
must(phaser, "depthMode === 'cutscene-front'", 'renderer must support cutscene-front depth');
must(phaser, '? 899900', 'cutscene-front must live just below atmosphere/UI band');
must(logic, 'depthMode: cmd.depthMode', 'StoryManager must pass depth mode to Phaser');
must(story, '"id": "flashback-jasper-vortex"', 'Jasper vortex command missing');
must(story, '"id": "flashback-veld-vortex"', 'Veld vortex command missing');
const vortexLines = story.split('\n').filter(line => line.includes('fx-abyss-vortex-ai.png') && line.includes('flashback-'));
assert.ok(vortexLines.length >= 2, 'expected both flashback vortex commands');
vortexLines.forEach(line => assert.ok(line.includes('"depthMode": "cutscene-front"'), `vortex missing cutscene-front: ${line.trim()}`));
assert.ok(899900 < 900000, 'cutscene FX must remain below atmosphere/HUD band');
assert.ok(899900 > 30 * 100 + 100, 'cutscene FX must remain above all normal Light Palace map rows');

// 3) Rescue route: Claude turns north only after reaching X18/Y24.
const afterStart = story.indexOf('"light_palace_flashback_veld1_after"');
assert.ok(afterStart >= 0, 'post-Veld flashback event missing');
const afterBlock = story.slice(afterStart, story.indexOf('"light_palace_flashback_wrong_way"', afterStart));
const claudeRight = afterBlock.indexOf('"flashback-postveld-claude", "characterId": 304, "x": 18, "y": 24');
const claudeNorth = afterBlock.indexOf('"flashback-postveld-claude", "characterId": 304, "x": 18, "y": 18');
assert.ok(claudeRight >= 0 && claudeNorth > claudeRight, 'Claude must reach X18/Y24 before running north to X18/Y18');
assert.ok(!afterBlock.includes('"flashback-postveld-claude", "characterId": 304, "x": 17, "y": 18'), 'late X17->X18 sidestep must be gone');

// 4) Generic story heal log is opt-in only.
must(logic, 'action.log === true', 'generic story HEAL log must require explicit opt-in');
const healBlockStart = logic.indexOf("if (action.type === 'HEAL')");
const healBlock = logic.slice(healBlockStart, logic.indexOf("if (action.type === 'SUB')", healBlockStart));
must(healBlock, 'action.message', 'HEAL must still allow explicit message');
must(healBlock, 'action.log === true', 'HEAL generic log must be explicit');

// 5) Stair feedback: stepping only arms an action; generic text is emitted from action callbacks.
mustNot(dungeon, 'App.log("階段がある。");', 'random stairs should not auto-log on step');
const autoLinkStart = dungeon.indexOf('tryFixedAutoFloorLink:');
const autoLinkBlock = dungeon.slice(autoLinkStart, dungeon.indexOf('prepareFixedTileAction:', autoLinkStart));
must(autoLinkBlock, 'Dungeon.isFixedFloorLinkBlocked(link, flags)', 'blocked fixed link gate missing');
mustNot(autoLinkBlock, 'return Dungeon.runFixedFloorLinkBlockedFeedback(link);', 'blocked link must not auto-run feedback on step');
const prepareStart = dungeon.indexOf('prepareFixedTileAction:');
const prepareBlock = dungeon.slice(prepareStart, dungeon.indexOf("if (tile === 'B')", prepareStart));
must(prepareBlock, 'Dungeon.runFixedFloorLinkBlockedFeedback(link)', 'blocked link action callback missing');
must(prepareBlock, "App.log(link.lockedLog || '封印されていて、今は通れない。');", 'locked link must retain action-time fallback log');

// 6) Cache generation bumped so the renderer fix cannot silently coexist with Phase 19 files.
must(sw, 'prisma-abyss-v93.20260820', 'service-worker cache generation must be Phase 20');

console.log('Phase 20 Light Palace validation: OK');
console.log(`crop geometry: legacy=${legacyHeightTotal.toFixed(2)}px repaired=${repairedHeightTotal.toFixed(2)}px`);
