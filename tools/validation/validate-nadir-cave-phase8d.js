#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const map = fs.readFileSync(path.join(root, 'map.js'), 'utf8');
const story = fs.readFileSync(path.join(root, 'story.js'), 'utf8');
const news = fs.readFileSync(path.join(root, 'news.js'), 'utf8');

const errors = [];
function need(haystack, needle, label = needle) {
  if (!haystack.includes(needle)) errors.push(`missing: ${label}`);
}
function forbid(haystack, needle, label = needle) {
  if (haystack.includes(needle)) errors.push(`stale: ${label}`);
}

need(map, 'name: "奈落への洞窟"', 'Nadir Cave canonical name');
need(map, 'x: 38,\n                            y: 55', 'Nadir Cave entrance world coordinate');
need(map, 'x: 42,\n                            y: 55', 'Nadir Cave altar-side world coordinate');
need(map, 'setFlag: "nadirCaveCleared"', 'altar-side exit completion flag');

const hunterExpectations = [
  ['galvania_f1_black_scout_v2', '[802,803,851]', '黒岩の隙間から、侵食に追われた魔物が飛び出した！'],
  ['galvania_f3_ash_daemon_v2', '[851,855,861]', '溶岩霧の向こうから、侵食に濁った魔物が這い出した！'],
  ['galvania_f4_frost_hound_v2', '[851,857,863]', '氷壁の裂け目から、侵食獣が滑るように迫ってきた！'],
  ['galvania_f5_supply_overseer_v2', '[863,864,865]', '崩れた補給路から、深淵側の魔物がなだれ込んできた！'],
  ['galvania_f6_royal_rearguard_v2', '[901,904,911]', '最終防衛線を越えた魔物が、祭壇側から迫ってきた！']
];
for (const [id, compactIds, msg] of hunterExpectations) {
  need(map, `id: "${id}"`, id);
  need(map, msg, `${id} message`);
  const ids = compactIds.slice(1, -1).split(',');
  for (const idNum of ids) need(map, `                            ${idNum}`, `${id} monster ${idNum}`);
}

[
  '黒岩の陰から魔族の斥候が襲いかかった！',
  '溶岩霧の向こうから、灼熱の魔族が迫る！',
  '補給路を巡回する上級魔族が、こちらを捕捉した！',
  '撤退路を守る魔族の後衛が立ちはだかった！',
  '氷鎧の魔将に挑む',
  '横穴の守護魔に挑む'
].forEach(s => forbid(map, s));

[
  'nadir_cave_f1_defense_stakes_phase8d',
  'nadir_cave_f2_loop_marks_phase8d',
  'nadir_cave_f3_shared_bones_phase8d',
  'nadir_cave_f4_freeze_seal_phase8d',
  'nadir_cave_f5_resupply_marks_phase8d',
  'nadir_cave_f6_last_line_phase8d',
  'nadir_cave_f6_fresh_tracks_phase8d',
  'integration_altar_defense_direction_phase8d',
  'integration_altar_fresh_tracks_phase8d',
  'integration_altar_overlaid_ritual_lines_phase8d'
].forEach(id => {
  if (!map.includes(`eventId: "${id}"`) && !map.includes(`"eventId": "${id}"`)) errors.push(`missing: ${id} map action`);
  need(story, `"${id}":`, `${id} story event`);
});

[
  'NADIR_CAVE_F1_DEFENSE_STAKES_PHASE8D',
  'NADIR_CAVE_F2_LOOP_MARKS_PHASE8D',
  'NADIR_CAVE_F3_SHARED_BONES_PHASE8D',
  'NADIR_CAVE_F4_FREEZE_SEAL_PHASE8D',
  'NADIR_CAVE_F5_RESUPPLY_MARKS_PHASE8D',
  'NADIR_CAVE_F6_LAST_LINE_PHASE8D',
  'NADIR_CAVE_F6_FRESH_TRACKS_PHASE8D',
  'INTEGRATION_ALTAR_DEFENSE_DIRECTION_PHASE8D',
  'INTEGRATION_ALTAR_FRESH_TRACKS_PHASE8D',
  'INTEGRATION_ALTAR_OVERLAID_RITUAL_LINES_PHASE8D'
].forEach(key => need(story, `"${key}":`, `${key} conversation`));

need(map, 'actionLabel: "黒炎の侵食獣に挑む"');
need(map, 'actionLabel: "氷晶の異形に挑む"');
need(map, 'actionLabel: "白骨坑の異形に挑む"');
need(story, '黒い炎をまとった侵食獣が、赤い宝箱の島に居着いている。');
need(story, '氷漬けの保管区画に異形が潜んでいる。');
need(story, '白骨坑の横穴に異形がうずくまっている。');

// Phase8D intentionally leaves the legacy crack entry in place until Alan's rescue/death branch
// can ship together with the Appeal Document quest. This check prevents accidental softlock gating here.
need(map, '"eventId": "abyss_unsealed"', 'legacy crack entry remains for Phase8D');
need(story, '奈落への洞窟を越え、統合の祭壇へ向かおう', 'Step9 goal');

// The new environmental clues must not disclose the hidden identity of the advance party.
const phase8dScriptStart = story.indexOf('"NADIR_CAVE_F1_DEFENSE_STAKES_PHASE8D"');
const phase8dScriptEnd = story.indexOf('"MAP_SYSTEM_GALVANIA_CAVE_F3_BOSS_1"', phase8dScriptStart);
if (phase8dScriptStart < 0 || phase8dScriptEnd < 0) {
  errors.push('could not isolate Phase8D environmental scripts');
} else if (story.slice(phase8dScriptStart, phase8dScriptEnd).includes('アラン')) {
  errors.push('Phase8D environmental clues reveal Alan by name');
}

need(news, '奈落への洞窟の敵配置と深淵防衛線の演出を更新しました', 'NEWS Phase8D cave line');
need(news, '統合の祭壇へ向かう道中に調査ポイントを追加しました', 'NEWS Phase8D altar line');

if (errors.length) {
  console.error(`FAIL validate-nadir-cave-phase8d (${errors.length})`);
  errors.forEach(e => console.error(` - ${e}`));
  process.exit(1);
}
console.log('PASS validate-nadir-cave-phase8d');
