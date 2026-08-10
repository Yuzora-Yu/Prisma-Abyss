const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8b-dark-castle] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const mapSource = read('map.js');
const storySource = read('story.js');
const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const encyclopedia = read('canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md');
const draft = read('docs/scenario/38_DARK_CASTLE_OFFICERS_AND_EMPIRE_SHOPS_PHASE8B_20260810.md');
const queue = read('docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md');
const handoff = read('PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');
const news = read('news.js');

const mapCtx = { window: {}, console };
vm.createContext(mapCtx);
vm.runInContext(mapSource, mapCtx, { filename: 'map.js' });
const { FIXED_MAPS, FIXED_DUNGEON_MAPS } = mapCtx.window;
assert(FIXED_MAPS && FIXED_DUNGEON_MAPS, 'map registries did not load.');

const empire = FIXED_MAPS.GALVANIA_EMPIRE;
assert(empire, 'GALVANIA_EMPIRE map is missing.');
const shops = (empire.mapActors || []).filter(a => /^galvania_empire_(item|weapon|armor)_shop$/.test(a.actorId || ''));
assert(shops.length === 3, 'Galvania Empire must contain exactly three migrated shop actors.');
const expected = {
  galvania_empire_item_shop: { x: 9, y: 11, type: 'item', title: 'ガルヴァニア帝国 雑貨店' },
  galvania_empire_weapon_shop: { x: 9, y: 21, type: 'weapon', title: 'ガルヴァニア帝国 武器店' },
  galvania_empire_armor_shop: { x: 45, y: 21, type: 'armor', title: 'ガルヴァニア帝国 防具店' }
};
for (const actor of shops) {
  const e = expected[actor.actorId];
  assert(e, `Unexpected empire shop actor ${actor.actorId}.`);
  assert(actor.x === e.x && actor.y === e.y, `${actor.actorId} coordinate is wrong.`);
  assert(empire.tiles?.[actor.y]?.[actor.x] === 'T', `${actor.actorId} must stand on a passable T tile.`);
  const open = (actor.states || []).find(s => s.stateId === 'open');
  const closed = (actor.states || []).find(s => s.stateId === 'closed');
  assert(open?.when?.requiredFlag === 'darkCastleCleared', `${actor.actorId} open state must require darkCastleCleared.`);
  assert(open?.action?.type === 'shop' && open?.action?.shopType === e.type, `${actor.actorId} open state shop type is wrong.`);
  assert(open?.action?.shopRank === 65 && open?.action?.title === e.title, `${actor.actorId} must preserve Rank65 and use Empire shop title.`);
  assert(closed?.when?.missingFlag === 'darkCastleCleared', `${actor.actorId} closed state must exist before castle clear.`);
  assert(closed?.action?.type !== 'shop', `${actor.actorId} must not trade before castle clear.`);
}

const castle = FIXED_DUNGEON_MAPS.DARK_CASTLE;
assert(castle, 'DARK_CASTLE fixed dungeon is missing.');
const castleShopStates = [];
for (const floor of castle.floors || []) {
  for (const actor of floor.mapActors || []) {
    for (const state of actor.states || []) {
      if (state?.action?.type === 'shop') castleShopStates.push({ floor: floor.label, actor: actor.actorId, state: state.stateId });
    }
  }
}
assert(castleShopStates.length === 0, 'Post-clear shops must no longer remain inside Dark Castle.');

const storyCtx = { console };
storyCtx.window = storyCtx;
storyCtx.globalThis = storyCtx;
vm.createContext(storyCtx);
vm.runInContext(storySource, storyCtx, { filename: 'story.js' });
const scripts = storyCtx.STORY_MANAGER_DATA?.scripts || {};
const textOf = key => (scripts[key] || []).map(line => `${line.name || ''}:${line.text || ''}`).join('\n');
const zeldras = textOf('DARK_CASTLE_ZELDRAS_ENCOUNTER') + '\n' + textOf('DARK_CASTLE_ZELDRAS_CLEAR');
const elmenas = textOf('DARK_CASTLE_ELMENAS_ENCOUNTER') + '\n' + textOf('DARK_CASTLE_ELMENAS_CLEAR');
const belet = textOf('DARK_CASTLE_BELET_ELM_ENCOUNTER') + '\n' + textOf('DARK_CASTLE_BELET_ELM_CLEAR');
assert(zeldras.includes('聖女を置いて、貴様ら人間は去れ'), 'Zeldras must explicitly distrust the human party and demand the Saint remain.');
assert(zeldras.includes('聖女もプリズムも二度と使わせん'), 'Zeldras must protect both Luna and the Dark Prism from human exploitation.');
assert(elmenas.includes('王国は一度それを奪った'), 'Elmenas must ground distrust in the prior Dark Prism seizure.');
assert(elmenas.includes('見たものを自分で考えろ'), 'Elmenas must retain the analytical/test-oriented voice.');
assert(belet.includes('思想の差異になど興味はない'), 'Belet must be uninterested in ideological difference.');
assert(belet.includes('魔王様への謁見にふさわしい実力'), 'Belet must test audience-worthiness by strength.');
for (const legacyFeminine of ['鈴のような声', '遠ざかるわ', 'あなた次第よ', 'ただの敵ではないわ']) {
  assert(!elmenas.includes(legacyFeminine), `Elmenas must not retain legacy feminine expression: ${legacyFeminine}`);
}
assert(textOf('DARK_CASTLE_ZELDRAS_ENCOUNTER').includes('大剣を背負った男'), 'Zeldras staging must identify a male figure.');
assert(textOf('DARK_CASTLE_ELMENAS_ENCOUNTER').includes('低い男の声'), 'Elmenas staging must identify a male voice.');
assert(textOf('DARK_CASTLE_BELET_ELM_ENCOUNTER').includes('一人の騎士'), 'Belet staging must remain singular and masculine-coded by his dialogue/persona.');

assert(canon.includes('三名とも男性'), 'Scenario canon must explicitly state all three officers are male.');
for (const name of ['常闇のゼルドラス', '風詠のエルメナス', '冥騎士ベレト']) {
  const start = encyclopedia.indexOf(`## ${name}`);
  assert(start >= 0, `${name} encyclopedia entry is missing.`);
  const next = encyclopedia.indexOf('\n## ', start + 4);
  const block = encyclopedia.slice(start, next >= 0 ? next : undefined);
  assert(block.includes('|性別|男性|'), `${name} encyclopedia entry must record male gender.`);
}
assert(draft.includes('三名とも男性') && draft.includes('ガルヴァニア帝国 雑貨店'), 'Phase8B approved-direction draft must document gender and shop migration.');
assert(queue.includes('DR-Phase8B-dark-castle-three-officers') && queue.includes('Status: implemented'), 'Dialogue review queue must record the approved three-officer rewrite.');
assert(handoff.includes('**Phase:** 8B') && handoff.includes('雑貨 `x9,y11` / 武器 `x9,y21` / 防具 `x45,y21`'), 'Latest handoff must describe Phase8B shop placement.');
assert(news.includes('ガルヴァニア帝国へ道具・武器・防具店を移し、魔王城攻略後に利用できるようにしました'), 'NEWS must mention Empire shop migration and clear gate.');
assert(news.includes('魔王城の三幹部戦の会話と人物描写を調整しました'), 'NEWS must mention the three-officer dialogue update.');

if (!process.exitCode) console.log('[phase8b-dark-castle] PASS: three male officers, revised battle motives, Castle shop removal, and post-clear Empire shop activation are wired.');
