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

// 1) Light Palace ritual presentation contract.
must(logic, "x:17, y:16, size:9, slices:9, alpha:0.72, depthOffset:46, seamBleed:0.5",
    'magic circle must stay X17/Y16 at 9 tiles with softened alpha and seam bleed');
must(logic, "animate:true, pulseAlpha:0.08, driftX:0.8, driftY:0.55, motionDuration:3000",
    'magic circle motion profile missing');

// 2) The split renderer must reconstruct every band using one full-image scale.
must(phaser, 'const effectScaleY = displayHeight / sourceHeight;', 'shared vertical scale missing');
must(phaser, 'const nominalCropY = (sourceHeight * i) / sliceCount;', 'fractional nominal crop boundary missing');
must(phaser, 'const seamBleedSource = effectScaleY > 0 ? seamBleed / effectScaleY : 0;', 'seam bleed conversion missing');
must(phaser, 'image.setOrigin(0.5, cropCenterY / sourceHeight);', 'Phaser crop-origin compensation missing');
must(phaser, 'image.setScale(effectScaleX, effectScaleY);', 'all strips must use the same full-image scale');
assert.ok(!phaser.includes('targetSliceHeight / cropHeight'), 'per-strip vertical scaling must not return');

// 384x384 -> 9 tiles (=288px) is exactly 0.75 scale. Fractional 1/9 crop boundaries
// preserve the original image mapping, while 0.5px bleed on both sides of an internal
// boundary creates a 1px overlap instead of exposing a seam.
const sourceHeight = 384;
const tileSize = 32;
const sizeTiles = 9;
const sliceCount = 9;
const displayHeight = tileSize * sizeTiles;
const scaleY = displayHeight / sourceHeight;
const seamBleed = 0.5;
const seamBleedSource = seamBleed / scaleY;
assert.strictEqual(scaleY, 0.75, 'expected 384px source -> 288px display scale');

const bands = [];
for (let i = 0; i < sliceCount; i++) {
    const nominalTop = sourceHeight * i / sliceCount;
    const nominalBottom = sourceHeight * (i + 1) / sliceCount;
    const cropTop = Math.max(0, nominalTop - (i > 0 ? seamBleedSource : 0));
    const cropBottom = Math.min(sourceHeight, nominalBottom + (i < sliceCount - 1 ? seamBleedSource : 0));
    bands.push({ top: cropTop * scaleY, bottom: cropBottom * scaleY });
}
for (let i = 1; i < bands.length; i++) {
    const overlap = bands[i - 1].bottom - bands[i].top;
    assert.ok(Math.abs(overlap - 1) < 1e-9, `expected 1px seam overlap, got ${overlap}`);
}
assert.strictEqual(bands[0].top, 0, 'first band must keep original image top');
assert.strictEqual(bands.at(-1).bottom, displayHeight, 'last band must keep original image bottom');

// 3) Motion is coherent across all slices, so animation cannot re-open the seams.
must(phaser, 'const dx = Math.sin(phase) * requestedDriftX;', 'coherent X drift missing');
must(phaser, 'const dy = Math.sin((phase * 2) + 0.65) * requestedDriftY;', 'coherent Y drift missing');
must(phaser, 'image.setPosition(base.x + dx, base.y + dy);', 'all slices must receive the same drift delta');
must(phaser, 'const animatedAlpha = Math.max(0, Math.min(1, Number(entry.alpha || 0) + pulse));', 'alpha pulse missing');
must(phaser, 'entry.motionTween?.stop?.();', 'floor-effect motion tween cleanup missing');

const alphaBase = 0.72;
const pulseAlpha = 0.08;
assert.ok(alphaBase - pulseAlpha >= 0.6 && alphaBase + pulseAlpha <= 0.85,
    'pulse range should remain visibly translucent and restrained');

// 4) Depth contract remains floor < circle < wall < player for all 9 rows.
const topTile = 16 - (sizeTiles / 2);
for (let i = 0; i < sliceCount; i++) {
    const sliceCenterY = topTile + i + 0.5;
    const row = Math.floor(sliceCenterY);
    const floorDepth = row * 100;
    const circleDepth = row * 100 + 46;
    const wallDepth = row * 100 + 48;
    const playerDepth = row * 100 + 88;
    assert.ok(floorDepth < circleDepth && circleDepth < wallDepth && wallDepth < playerDepth,
        `depth contract failed at row ${row}`);
}

// 5) Delivery/cache bookkeeping.
must(sw, 'prisma-abyss-v96.20260820', 'service-worker cache generation must be Phase 23');
must(news, '魔法陣の継ぎ目を抑え、透過・明滅・微動の演出を追加しました', '2026/08/20 news entry missing Phase 23 note');

console.log('Phase 23 Light Palace validation: OK');
console.log(`shared scale=${scaleY}, seam overlap=1px, alpha=${alphaBase - pulseAlpha}..${alphaBase + pulseAlpha}`);
