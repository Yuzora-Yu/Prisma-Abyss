const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const assert = (cond, message) => { if (!cond) throw new Error(message); };

const story = read('story.js');
const mapSource = read('map.js');
const mainSource = read('main.js');

assert(story.includes('{"charId":204,"initialLevel":49,"expMultiplierPct":100,"equipmentPreset":"rank60Physical"}'), '回想開始時のレイラLv49が見つかりません。');
assert(story.includes('{"charId":204,"initialLevel":49,"equipmentPreset":"rank60Physical"}'), '救援後編成のレイラLv49が見つかりません。');
assert(story.includes('{"charId":305,"initialLevel":62,"equipmentPreset":"rank60Physical"}'), 'レオンLv62が見つかりません。');
assert(story.includes('{"charId":304,"initialLevel":58,"equipmentPreset":"rank60Physical","skills":[249]}'), 'クロードLv58が見つかりません。');

assert(story.includes('"LIGHT_PALACE_PRESENT_PRISON_DETOUR"'), '現在時間の地下牢優先会話がありません。');
assert(story.includes('まってくれ、レオンやレイラの安否がどうしても気になっちまう。'), 'ジョセフ1行目が一致しません。');
assert(story.includes('宮殿の西に地下牢がある。先に見に行かせてくれないか。'), 'ジョセフ2行目が一致しません。');
assert(story.includes('"light_palace_present_prison_detour"'), '地下牢優先イベントがありません。');

// main.js の実遭遇プロファイルで、未指定 rankMin / rankMax が 0 へ変換されないことを確認する。
// 旧実装は Number(null) === 0 を finite と判定し、後段で Rank1..1 の明示範囲になっていた。
assert(mainSource.includes('normalizeOptionalEncounterRankBound'), 'main.js に未指定Rank境界の正規化処理がありません。');
assert(!mainSource.includes('Number.isFinite(Number(best.encounterRankMin))'), 'world encounter profile に null→0 変換の旧処理が残っています。');
assert(!mainSource.includes('Number.isFinite(Number(best.encounterRankMax))'), 'world encounter profile に null→0 変換の旧処理が残っています。');

const mainSandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval };
mainSandbox.window = mainSandbox;
mainSandbox.globalThis = mainSandbox;
mainSandbox.window.JOB_SKILLS = {};
mainSandbox.window.addEventListener = () => {};
mainSandbox.window.requestAnimationFrame = fn => fn();
mainSandbox.document = {
  getElementById: () => null,
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
  body: { classList: { add() {}, remove() {}, toggle() {} }, style: {} },
  documentElement: { style: {} }
};
mainSandbox.navigator = {};
mainSandbox.location = {};
mainSandbox.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
mainSandbox.sessionStorage = mainSandbox.localStorage;
vm.createContext(mainSandbox);
vm.runInContext(`${mainSource}\n;globalThis.__APP_FOR_PHASE15 = App;`, mainSandbox, { timeout: 10000 });
const encounterApp = mainSandbox.__APP_FOR_PHASE15;
encounterApp.isFlying = () => false;
encounterApp.isWorldEncounterConnected = () => true;
mainSandbox.Field = { currentMapData: null, x: 67, y: 48 };
mainSandbox.MapRegistry = {
  getWorldSurfaceAt: () => ({ isSea: false }),
  getActiveWorldKey: () => 'WORLD'
};
mainSandbox.FIELD_ENCOUNTER_ZONES = [{
  id: 'LIGHT_PALACE_GROVE',
  mapId: 'MAP000022',
  name: '光の宮殿グランプリズマ周辺',
  rank: 61,
  centerX: 67,
  centerY: 48,
  radius: 18,
  priority: 3,
  encounterRankMin: null,
  encounterRankMax: null
}];
const runtimeProfile = encounterApp.getWorldEncounterProfile();
assert(runtimeProfile?.rank === 61, `runtime profileのRankが61ではありません: ${runtimeProfile?.rank}`);
assert(runtimeProfile?.encounterRankMin === null, `未指定encounterRankMinがnullではありません: ${runtimeProfile?.encounterRankMin}`);
assert(runtimeProfile?.encounterRankMax === null, `未指定encounterRankMaxがnullではありません: ${runtimeProfile?.encounterRankMax}`);

// map.js と monsters.js はブラウザ向けglobal scriptなので、windowをglobalへ寄せてロードする。
global.window = global;
require(path.join(root, 'map.js'));
require(path.join(root, 'monsters.js'));

const palace = global.FIXED_DUNGEON_MAPS?.LIGHT_PALACE;
assert(palace && Array.isArray(palace.floors), 'LIGHT_PALACE fixed dungeonが解決できません。');
const firstFloor = palace.floors[0];
const stair = (firstFloor.floorLinks || []).find(link => Number(link.x) === 17 && Number(link.y) === 5 && Number(link.toFloor) === 2);
assert(stair, '1F→2F階段が見つかりません。');
assert(stair.requiredFlag === 'lightPalacePrisonRescueSecured', '1F→2F階段の地下牢確認ゲートがありません。');
assert(stair.lockedEventId === 'light_palace_present_prison_detour', '1F→2F階段のジョセフイベントが接続されていません。');
assert(stair.blockedEventId === 'light_palace_flashback_wrong_way_stairs', '回想退却時のクロード制止が維持されていません。');

const derived = (global.DERIVED_PROGRESS_FLAGS || []).find(rule => rule.flag === 'lightPalacePrisonRescueSecured');
assert(derived && Array.from(derived.requires || []).includes('lightPalaceCleared'), 'クリア済み旧セーブの地下牢救出互換がありません。');

const zone = (global.FIELD_ENCOUNTER_ZONES || []).find(zone => zone.id === 'LIGHT_PALACE_GROVE');
assert(zone, 'LIGHT_PALACE_GROVE遭遇ゾーンがありません。');
assert(zone.mapId === global.MAP_IDS.LIGHT_PALACE_OUTSKIRTS, '光の宮殿周辺のmapIdがMAP000022ではありません。');
assert(Number(zone.rank) === 61, `光の宮殿周辺の基準Rankが61ではありません: ${zone.rank}`);

const candidates = global.MonsterData.getEncounterCandidates({
  mapId: zone.mapId,
  floor: 0,
  section: null,
  rank: zone.rank,
  rankMin: runtimeProfile.encounterRankMin,
  rankMax: runtimeProfile.encounterRankMax,
  races: []
});
assert(Array.isArray(candidates) && candidates.length >= 3, '光の宮殿周辺の生息地候補が不足しています。');
const candidateIds = new Set(candidates.map(m => Number(m.id)));
[556, 601, 602].forEach(id => assert(candidateIds.has(id), `光の宮殿周辺候補にmonster ${id}がありません。`));
assert(candidates.every(m => Number(m.rank) > 1), `Rank1候補が混入しています: ${candidates.map(m => `${m.id}:${m.rank}`).join(', ')}`);

for (let i = 0; i < 80; i++) {
  const enemy = global.MonsterData.generateEnemyForEncounter({
    mapId: zone.mapId,
    floor: 0,
    section: null,
    rank: zone.rank,
    rankMin: null,
    rankMax: null,
    races: [],
    allowRare: false
  });
  assert(enemy, `光の宮殿周辺の敵生成が${i + 1}回目でnullになりました。`);
  assert(Number(enemy.rank) > 1, `光の宮殿周辺でRank1が生成されました: ${enemy.id}:${enemy.name}`);
}

console.log('OK: Light Palace Phase15 validation passed.');
console.log(`Encounter candidates: ${candidates.map(m => `${m.name}(Rank${m.rank})`).join(', ')}`);
