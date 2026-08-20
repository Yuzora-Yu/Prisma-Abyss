const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../../');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const story = read('story_logic.js');
const phaser = read('phaser-field.js');
const assets = read('assets.js');
const sw = read('sw.js');
const news = read('news.js');
const checks = [
  ['special rupture key', story.includes("key:'special-rupture'")],
  ['special rupture src', story.includes("src:'assets/effect/fx_special_rupture.png'")],
  ['asset registered', assets.includes('"special-rupture": "assets/effect/fx_special_rupture.png"')],
  ['base alpha 0.77', story.includes('alpha:0.77')],
  ['pulse alpha 0.03', story.includes('pulseAlpha:0.03')],
  ['no factor pulse on ritual spec', !story.includes('pulseMin:0.74, pulseMax:0.80')],
  ['drift x fixed', story.includes('driftX:0')],
  ['drift y fixed', story.includes('driftY:0')],
  ['legacy additive pulse path', phaser.includes('Number(entry.alpha || 0) + (pulseWave * requestedPulseAlpha)')],
  ['cache v98', sw.includes('prisma-abyss-v98.20260820')],
  ['news fixed glow wording', news.includes('魔法陣を固定表示にし、発光の透明度と明滅を再調整しました')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) failed++;
}
const min = 0.77 - 0.03;
const max = 0.77 + 0.03;
console.log(`effective alpha range: ${min.toFixed(2)}..${max.toFixed(2)}`);
if (Math.abs(min - 0.74) > 1e-9 || Math.abs(max - 0.80) > 1e-9) failed++;
if (failed) process.exit(1);
