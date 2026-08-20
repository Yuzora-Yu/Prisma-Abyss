const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../../');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const story = read('story_logic.js');
const phaser = read('phaser-field.js');
const assets = read('assets.js');
const sw = read('sw.js');
const checks = [
  ['special rupture key', story.includes("key:'special-rupture'")],
  ['special rupture src', story.includes("src:'assets/effect/fx_special_rupture.png'")],
  ['asset registered', assets.includes('"special-rupture": "assets/effect/fx_special_rupture.png"')],
  ['base alpha 0.5', story.includes('alpha:0.5')],
  ['pulse factor 0.74..0.80', story.includes('pulseMin:0.74, pulseMax:0.80')],
  ['drift x 0.4', story.includes('driftX:0.4')],
  ['drift y 0.35', story.includes('driftY:0.35')],
  ['factor pulse implementation', phaser.includes('Number(entry.alpha || 0) * (pulseFactorMin')],
  ['legacy pulse fallback kept', phaser.includes('pulseWave * requestedPulseAlpha')],
  ['cache v97', sw.includes('prisma-abyss-v97.20260820')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) failed++;
}
const min = 0.5 * 0.74;
const max = 0.5 * 0.80;
console.log(`effective alpha range: ${min.toFixed(3)}..${max.toFixed(3)}`);
if (Math.abs(min - 0.37) > 1e-9 || Math.abs(max - 0.40) > 1e-9) failed++;
if (failed) process.exit(1);
