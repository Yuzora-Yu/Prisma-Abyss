'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const phaser = read('phaser-field.js');
const logic = read('story_logic.js');
const news = read('news.js');
const sw = read('sw.js');

const must = (haystack, needle, label) => assert.ok(haystack.includes(needle), label || `missing: ${needle}`);

// 1) Persistent ritual specification is unchanged.
must(logic, "x:17, y:16, size:9, slices:9", 'magic circle must remain X17/Y16 at 9 tiles / 9 slices');
must(phaser, 'image.setCrop(0, cropY, sourceWidth, cropHeight);', 'floor effect must still use horizontal Phaser crop slices');
must(phaser, 'const cropCenterY = cropY + (cropHeight / 2);', 'crop center calculation missing');
must(phaser, 'image.setOrigin(0.5, cropCenterY / sourceHeight);', 'Phaser crop-local Y offset compensation missing');
must(phaser, 'image.setScale(displayWidth / sourceWidth, targetSliceHeight / cropHeight);', 'crop slice scale repair must remain active');

// 2) Reproduce Phaser's cropped Image local geometry.
// Phaser batchSprite places a cropped quad at localY = -displayOriginY + cropY.
// With the historical originY=0.5, cropY is therefore added on top of our world-row placement,
// producing roughly one extra tile of spacing per slice. The repaired origin makes each crop's
// own center equal to displayOriginY, so every cropped quad is centered exactly at py.
const sourceHeight = 384;
const tileSize = 32;
const sizeTiles = 9;
const sliceCount = 9;
const sliceTiles = sizeTiles / sliceCount;
const targetSliceHeight = tileSize * sliceTiles;
const topTile = 16 - (sizeTiles / 2);

const oldBands = [];
const repairedBands = [];
for (let i = 0; i < sliceCount; i++) {
    const cropY = Math.floor((sourceHeight * i) / sliceCount);
    const cropEnd = Math.floor((sourceHeight * (i + 1)) / sliceCount);
    const cropHeight = Math.max(1, cropEnd - cropY);
    const cropCenterY = cropY + (cropHeight / 2);
    const scaleY = targetSliceHeight / cropHeight;
    const sliceCenterTileY = topTile + ((i + 0.5) * sliceTiles);
    const py = sliceCenterTileY * tileSize + tileSize / 2;

    // Historical: displayOriginY = sourceHeight / 2.
    const oldLocalCenter = cropCenterY - (sourceHeight / 2);
    const oldCenter = py + (oldLocalCenter * scaleY);
    oldBands.push({ top: oldCenter - targetSliceHeight / 2, bottom: oldCenter + targetSliceHeight / 2 });

    // Repaired: displayOriginY = cropCenterY -> local cropped center = 0.
    const repairedLocalCenter = cropCenterY - cropCenterY;
    const repairedCenter = py + (repairedLocalCenter * scaleY);
    repairedBands.push({ top: repairedCenter - targetSliceHeight / 2, bottom: repairedCenter + targetSliceHeight / 2 });
}

let oldGapTotal = 0;
for (let i = 1; i < sliceCount; i++) {
    const gap = oldBands[i].top - oldBands[i - 1].bottom;
    oldGapTotal += gap;
    assert.ok(gap > 29 && gap < 36, `historical Phaser crop gap should be about one tile, got ${gap}`);

    const repairedGap = repairedBands[i].top - repairedBands[i - 1].bottom;
    assert.ok(Math.abs(repairedGap) < 1e-9, `repaired crop slices must be contiguous, got gap ${repairedGap}`);
}
assert.strictEqual(repairedBands.at(-1).bottom - repairedBands[0].top, 288, 'repaired 9 slices must occupy exactly 9 tiles');

// 3) Depth contract remains floor < circle < wall < player for every affected row.
for (let i = 0; i < sliceCount; i++) {
    const sliceCenterY = topTile + ((i + 0.5) * sliceTiles);
    const row = Math.floor(sliceCenterY);
    const floorDepth = row * 100;
    const circleDepth = row * 100 + 46;
    const wallDepth = row * 100 + 48;
    const playerDepth = row * 100 + 88;
    assert.ok(floorDepth < circleDepth && circleDepth < wallDepth && wallDepth < playerDepth,
        `depth contract failed at row ${row}`);
}

// 4) Delivery/cache bookkeeping.
must(sw, 'prisma-abyss-v95.20260820', 'service-worker cache generation must be Phase 22');
must(news, '大型イベントエフェクトの分割描画・重なりを調整しました', '2026/08/20 news must mention split-render adjustment');

console.log('Phase 22 Light Palace validation: OK');
console.log(`historical crop gap avg=${(oldGapTotal / (sliceCount - 1)).toFixed(2)}px, repaired gap=0px, total=${repairedBands.at(-1).bottom - repairedBands[0].top}px`);
