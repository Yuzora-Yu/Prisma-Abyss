const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../../');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const main = read('main.js');
const storyData = read('story.js');
const story = read('story_logic.js');
const phaser = read('phaser-field.js');
const assets = read('assets.js');
const sw = read('sw.js');
const news = read('news.js');

const checks = [
  ['special rupture key', story.includes("key:'special-rupture'")],
  ['special rupture src', story.includes("src:'assets/effect/fx_special_rupture.png'")],
  ['asset registered', assets.includes('"special-rupture": "assets/effect/fx_special_rupture.png"')],
  ['base alpha fixed 0.60', story.includes('alpha:0.60')],
  ['base alpha pulse disabled', story.includes('pulseAlpha:0')],
  ['drift x fixed', story.includes('driftX:0')],
  ['drift y fixed', story.includes('driftY:0')],
  ['glow enabled', story.includes('glow:true')],
  ['glow alpha 0.10..0.32', story.includes('glowAlphaMin:0.10, glowAlphaMax:0.32')],
  ['glow tint', story.includes('glowTint:0xffe59a')],
  ['glow cycle 2200ms', story.includes('motionDuration:2200')],
  ['glow image lifecycle', phaser.includes('(entry.glowImages || []).forEach(image => image?.destroy?.())')],
  ['additive glow blend', phaser.includes('glowImage.setBlendMode(Phaser.BlendModes.ADD)')],
  ['filled glow tint', phaser.includes('glowImage.setTintFill(requestedGlowTint)')],
  ['glow stays below wall depth', phaser.includes('glowImage.setDepth(rowDepth + 0.2)')],
  ['glow alpha pulse path', phaser.includes('glowImage.setAlpha(animatedGlowAlpha)')],
  ['legacy additive fallback', main.includes("ctx.globalCompositeOperation = 'lighter'")],
  ['custom light palace memory preset', main.includes("key === 'light-palace-memory'")],
  ['light palace filter tuning', main.includes("sepia(0.55) saturate(0.88) contrast(1.10) brightness(0.99)")],
  ['old sepia save migration', main.includes('flags.lightPalaceFlashbackActive === true && flags.lightPalaceFlashbackCompleted !== true')],
  ['new scene uses custom preset', storyData.includes('"visualPreset": "light-palace-memory"')],
  ['legacy recovered scene uses custom preset', main.includes("visualPreset: 'light-palace-memory'")],
  ['cache v99', sw.includes('prisma-abyss-v99.20260820')],
  ['news glow wording', news.includes('光の宮殿回想の色味を調整し、魔法陣に光量が脈動する発光表現を追加しました')],
];
let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`);
  if (!ok) failed++;
}

const todayCount = (news.match(/date: "2026\/08\/20"/g) || []).length;
console.log(`2026/08/20 NEWS_DATA records: ${todayCount}`);
if (todayCount !== 1) failed++;

const glowMin = 0.10;
const glowMax = 0.32;
console.log(`glow alpha range: ${glowMin.toFixed(2)}..${glowMax.toFixed(2)} (delta ${(glowMax - glowMin).toFixed(2)})`);
console.log('base alpha: 0.60 (fixed), drift: 0px / 0px');
if (failed) process.exit(1);
