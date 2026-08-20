const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../../');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

const assets = read('assets.js');
const main = read('main.js');
const story = read('story_logic.js');
const sw = read('sw.js');
const characters = read('characters.js');

const checks = [
  ['invalid prologue portrait removed from precache', !assets.includes('assets/characters/char_face_301_past5y.png')],
  ['existing prologue face remains precached', assets.includes('assets/characters/face/301_past5y.png')],
  ['prologue portrait override uses existing face', main.includes("return 'assets/characters/face/301_past5y.png';")],
  ['prologueOnly portrait uses default face', main.includes('if (master?.prologueOnly === true) return App.getDefaultFaceIconPath(charOrId);')],
  ['Luna 403 is prologueOnly', /"id": 403[\s\S]*?"prologueOnly": true/.test(characters)],
  ['conversation fallback includes expression portrait', story.includes('App.getCharacterPortraitPath(charId, expression)')],
  ['conversation fallback includes normal portrait', story.includes("App.getCharacterPortraitPath(charId, 'normal')")],
  ['conversation fallback includes default face', story.includes('App.getDefaultFaceIconPath(charId)')],
  ['conversation fallback de-duplicates candidates', story.includes("filter((src, index, list) => src && list.indexOf(src) === index)")],
  ['service worker cache v100', sw.includes('prisma-abyss-v100.20260820')],
  ['required precache strict failure policy retained', sw.includes('throw new Error(`Required precache failed: ${batch[failedIndex]}`)')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) failed++;
}

if (failed) process.exit(1);
