const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const story = fs.readFileSync(path.join(ROOT, 'story.js'), 'utf8');
const dungeon = fs.readFileSync(path.join(ROOT, 'dungeon.js'), 'utf8');
const map = fs.readFileSync(path.join(ROOT, 'map.js'), 'utf8');

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const bannedPlayerFacingFragments = [
  '正史ではありません',
  '正規の歴史にはない道',
  'やり込みへの祝福',
  '回想中はアルスたちの道具・装備・所持金を使用できない',
  '光と闇が融合することなく、交互に高速循環する',
  '――記憶が巻き戻る',
  '次の本編目的として繋がった',
  '現在時間の光の祭壇',
  '光の宮殿へ向かう前に、雷の要塞でクロードから宮殿内部の出来事を聞く必要がある',
  '宮殿の回想を再開する',
  'クロードの話を最初から思い返す。'
];

for (const fragment of bannedPlayerFacingFragments) {
  assert(!story.includes(fragment) && !dungeon.includes(fragment) && !map.includes(fragment), `Developer-facing explanation leaked into player text: ${fragment}`);
}

assert(
  story.includes('"light_palace_flashback_retry_start": {') &&
  story.includes('"actions": [ {"type":"SCENE_RESTORE","id":"saint_room"} ]'),
  'Flashback first checkpoint retry should restore the scene without explanatory replay dialogue.'
);
assert(
  story.includes('"light_palace_flashback_retry_post_veld": {') &&
  story.includes('"actions": [ {"type":"SCENE_RESTORE","id":"post_veld"} ]'),
  'Flashback post-Veld checkpoint retry should restore the scene without explanatory replay dialogue.'
);
assert(
  story.includes('白。黒。白。黒。焼きつくような明滅'),
  'Flash Bomb should be shown as a perceived phenomenon instead of an elemental-theory explanation.'
);
assert(
  story.includes('ルーナの瞳に、幼馴染を見る色はない') &&
  !story.includes('ルーナは教団に保護される以前――五年前より前の記憶を失っている。'),
  'Luna memory loss should be demonstrated by the scene instead of immediately certified by narrator text.'
);

console.log('PASS validate-player-facing-information-boundary');
