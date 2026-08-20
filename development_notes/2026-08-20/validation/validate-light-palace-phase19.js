#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const story = read('story.js');
const logic = read('story_logic.js');
const assets = read('assets.js');
const sw = read('sw.js');

const pngInfo = rel => {
  const buf = fs.readFileSync(path.join(root, rel));
  assert(buf.length >= 24, `${rel}: PNG too small`);
  assert.strictEqual(buf.slice(1, 4).toString('ascii'), 'PNG', `${rel}: invalid PNG signature`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), bytes: buf.length };
};

const genesisRel = 'assets/effect/fx_ultimate_244_genesis_magic.png';
const slashRel = 'assets/effect/fx-neutral-slash-ai.png';
assert(fs.existsSync(path.join(root, genesisRel)), 'Genesis magic image is missing from runtime');
assert(fs.existsSync(path.join(root, slashRel)), 'Neutral slash AI image is missing from runtime');
assert(assets.includes(`"ultimate-genesis-magic": "${genesisRel}"`), 'Genesis asset registry path mismatch');
assert(assets.includes(`"neutral-slash-ai": "${slashRel}"`), 'Slash asset registry path mismatch');
assert.deepStrictEqual(pngInfo(genesisRel), { width:384, height:384, bytes:242578 });
assert.deepStrictEqual(pngInfo(slashRel), { width:384, height:384, bytes:77679 });

assert(!logic.includes('world-space floor effect could not be rendered'), 'obsolete blocking floor-effect warning remains in runtime logic');
assert(logic.includes("animateStoryFieldVerticalCurtainTransition: async function(cmd = {})"), 'vertical curtain transition implementation missing');
assert(logic.includes("case 'VERTICAL_CURTAIN':"), 'vertical curtain command handler missing');

const eventStart = story.indexOf('"light_palace_flashback_escape_end": {');
const eventEnd = story.indexOf('"thunder_fort_adventurer_crisis": {', eventStart);
assert(eventStart >= 0 && eventEnd > eventStart, 'flashback escape-end event block missing');
const escapeEvent = story.slice(eventStart, eventEnd);
const convIndex = escapeEvent.indexOf('{ "type": "CONV", "value": "LIGHT_PALACE_FLASHBACK_ESCAPE_END" }');
const closeIndex = escapeEvent.indexOf('{ "op": "VERTICAL_CURTAIN", "mode": "close"');
const sceneEndIndex = escapeEvent.indexOf('{ "type": "SCENE_END"');
const openIndex = escapeEvent.indexOf('{ "op": "VERTICAL_CURTAIN", "mode": "open"');
const aftermathIndex = escapeEvent.indexOf('{ "type": "CONV", "value": "LIGHT_PALACE_FLASHBACK_RETURN_AFTERMATH" }');
assert(convIndex >= 0 && closeIndex > convIndex, 'curtain close must start after the final flashback conversation');
assert(sceneEndIndex > closeIndex, 'SCENE_END must execute under the closed curtain');
assert(openIndex > sceneEndIndex, 'curtain must open only after returning to current time');
assert(aftermathIndex > openIndex, 'current-time aftermath must begin after curtain opens');

assert(sw.includes('const CACHE_NAME = "prisma-abyss-v92.20260820";'), 'service-worker cache version not bumped');
assert(sw.includes('const cache = await caches.open(CACHE_NAME);\n    const cached = await cache.match(request);'), 'App Shell fallback must use only current cache generation');
assert(!sw.includes('const cached = await caches.match(request);\n    if (cached) return cached;\n    throw error;\n  }\n};\n\nconst markWarmCacheComplete'), 'cross-generation App Shell fallback still present');

console.log('OK: Light Palace Phase19 validation passed.');
console.log(`  Genesis effect: ${genesisRel} (${pngInfo(genesisRel).width}x${pngInfo(genesisRel).height})`);
console.log(`  Slash effect:   ${slashRel} (${pngInfo(slashRel).width}x${pngInfo(slashRel).height})`);
