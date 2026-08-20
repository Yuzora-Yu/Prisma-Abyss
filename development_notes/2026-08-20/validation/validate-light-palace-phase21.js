'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../../..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const assetsSource = read('assets.js');
const phaser = read('phaser-field.js');
const logic = read('story_logic.js');
const main = read('main.js');
const news = read('news.js');
const sw = read('sw.js');

const must = (haystack, needle, label) => assert.ok(haystack.includes(needle), label || `missing: ${needle}`);

// 1) Canonical ownership stays in battleFx; runtime GRAPHICS must resolve both key and path.
must(assetsSource, 'resolveKey(keyOrSrc)', 'GRAPHICS cross-registry key resolver missing');
must(assetsSource, 'PRISMA_ASSETS.battleFx?.[raw]', 'battleFx keys must be visible to GRAPHICS resolver');
must(assetsSource, 'resolveSource(keyOrSrc)', 'GRAPHICS cross-registry source resolver missing');
must(assetsSource, 'PRISMA_ASSETS.battleFx?.[key]', 'battleFx sources must be visible to GRAPHICS loader');

global.window = globalThis;
global.requestAnimationFrame = (callback) => setImmediate(callback);
class FakeImage {
    constructor() {
        this.complete = false;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this._src = '';
    }
    set src(value) {
        this._src = String(value || '');
        setImmediate(() => {
            this.complete = true;
            this.naturalWidth = 384;
            this.naturalHeight = 384;
            if (typeof this.onload === 'function') this.onload();
        });
    }
    get src() {
        return this._src;
    }
}
global.Image = FakeImage;

require(path.join(root, 'assets.js'));

const key = 'ultimate-genesis-magic';
const src = 'assets/effect/fx_ultimate_244_genesis_magic.png';

assert.strictEqual(global.PRISMA_ASSETS.battleFx[key], src, 'genesis magic canonical path must stay in battleFx');
assert.strictEqual(global.GRAPHICS.data[key], undefined, 'fix must not duplicate battleFx definition into graphics registry');
assert.strictEqual(global.GRAPHICS.resolveKey(key), key, 'battleFx key must resolve');
assert.strictEqual(global.GRAPHICS.resolveKey(src), key, 'battleFx source path must reverse-resolve to its key');
assert.strictEqual(global.GRAPHICS.resolveSource(key), src, 'battleFx key must resolve to its source path');

// 2) Both story and Phaser paths must use the central resolver.
must(logic, "graphics.resolveKey(raw)", 'StoryManager must use GRAPHICS cross-registry resolver');
must(phaser, "graphicsRuntime.resolveKey(keyOrPath)", 'Phaser field renderer must use GRAPHICS cross-registry resolver');

// 3) The persistent effect contract and Phase 20 crop fix remain intact.
must(logic, "x:17, y:16, size:9, slices:9", 'magic circle must remain X17/Y16 at 9 tiles');
must(phaser, 'image.setScale(displayWidth / sourceWidth, targetSliceHeight / cropHeight);', 'Phase 20 crop scaling fix must remain active');
must(main, "if (key && typeof GRAPHICS?.get === 'function') GRAPHICS.get(key);", 'legacy Canvas must request the same GRAPHICS key when image is absent');

// 4) Cache generation must advance so old assets.js cannot remain active.
must(sw, 'prisma-abyss-v94.20260820', 'service-worker cache generation must be Phase 21');
must(news, '魔法陣画像の読み込み', '2026/08/20 player-facing news must mention the loading fix');

(async () => {
    const image = await global.GRAPHICS.request(key, { maxAttempts: 1, redraw: false });
    assert.ok(image, 'battleFx image request must return an Image');
    assert.strictEqual(image.src, src, 'battleFx image request must use the canonical source path');
    assert.strictEqual(global.GRAPHICS.images[key], image, 'loaded battleFx image must be cached under the canonical key');

    const byPath = await global.GRAPHICS.request(src, { maxAttempts: 1, redraw: false });
    assert.strictEqual(byPath, image, 'key and source-path requests must share the same cached Image');

    console.log('Phase 21 Light Palace validation: OK');
    console.log(`runtime registry: ${key} -> ${image.src}`);
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
