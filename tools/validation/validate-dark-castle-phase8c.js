const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8c-dark-castle] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const storySource = read('story.js');
const logicSource = read('story_logic.js');
const mapSource = read('map.js');
const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
const encyclopedia = read('canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md');
const coding = read('canon/PRISMA_CODING_HANDOFF_v5.md');
const draft = read('docs/scenario/39_DARK_CASTLE_TRUTH_AND_SECOND_INTEGRATION_PHASE8C_DRAFT_20260810.md');
const queue = read('docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md');
const foreshadow = read('docs/scenario/03_FORESHADOWING_LEDGER.md');
const news = read('news.js');

const storyCtx = { console };
storyCtx.window = storyCtx; storyCtx.globalThis = storyCtx;
vm.createContext(storyCtx);
vm.runInContext(storySource, storyCtx, { filename: 'story.js' });
const scripts = storyCtx.STORY_MANAGER_DATA?.scripts || {};
const events = storyCtx.STORY_MANAGER_DATA?.events || {};
const textOf = key => (scripts[key] || []).map(line => `${line.name || ''}:${line.text || ''}`).join('\n');

const mapCtx = { window: {}, console };
vm.createContext(mapCtx);
vm.runInContext(mapSource, mapCtx, { filename: 'map.js' });
const { FIXED_MAPS, FIXED_DUNGEON_MAPS } = mapCtx.window;
assert(FIXED_MAPS && FIXED_DUNGEON_MAPS, 'map registries did not load.');

// Empire: evidence before exposition and Luna's moral shock.
const empire = FIXED_MAPS.GALVANIA_EMPIRE;
assert(empire?.entryEventId === 'galvania_empire_arrival_phase8c', 'Empire must trigger the Phase8C arrival scene.');
assert(empire?.entryEventFlag === 'galvaniaEmpireArrivalSeen', 'Empire arrival must be one-shot.');
assert(empire?.entryEventConditions?.requiredFlag === 'crystalTreeCleared', 'Empire arrival must require Crystal Tree clear.');
assert(empire?.entryEventConditions?.missingFlag === 'darkCastleCleared', 'Empire arrival must not fire after Dark Castle clear.');
const expectedActors = {
  galvania_empire_wounded_soldier_phase8c: [16,11],
  galvania_empire_rations_phase8c: [38,11],
  galvania_empire_evacuees_phase8c: [16,31],
  galvania_empire_wall_engineer_phase8c: [38,31]
};
for (const [id,[x,y]] of Object.entries(expectedActors)) {
  const actor = (empire.mapActors || []).find(a => a.actorId === id);
  assert(actor && actor.x === x && actor.y === y, `${id} must exist at local x${x},y${y}.`);
  assert(empire.tiles?.[y]?.[x] === 'T', `${id} must stand on a T tile.`);
}
assert(empire.nextActorPlacementId >= 8, 'Empire nextActorPlacementId must advance beyond Phase8C actors.');
const arrival = textOf('GALVANIA_EMPIRE_ARRIVAL_PHASE8C');
assert(arrival.includes('……子どもが、いる。'), 'Luna must react to demon children in Galvania Empire.');
assert(arrival.includes('魔族の討伐に出たことがあります'), 'Luna must acknowledge her prior demon extermination participation.');
assert(arrival.includes('知らなかったから仕方ない、とは……言いたくありません'), 'Luna must reject ignorance as an excuse.');
assert(arrival.includes('……今は、見よう。'), 'Alus must answer briefly instead of lecturing Luna.');

// Castle evidence before Zenon.
const castle = FIXED_DUNGEON_MAPS.DARK_CASTLE;
const f1 = castle?.floors?.[0];
for (const [id,x,y] of [
  ['dark_castle_lower_patrol_priority_phase8c',13,14],
  ['dark_castle_rift_emplacement_phase8c',19,14],
  ['dark_castle_repair_layers_phase8c',10,16]
]) {
  const action = (f1?.mapActions || []).find(a => a.eventId === id);
  assert(action?.x === x && action?.y === y, `${id} must exist at the approved M0 coordinate.`);
  assert(f1?.tiles?.[y]?.[x] === 'T', `${id} must use a passable T tile.`);
}
assert(textOf('DARK_CASTLE_LOWER_PATROL_PRIORITY_PHASE8C').includes('下を空ける方が先に城が落ちる'), 'Castle soldiers must prioritize the lower defense line.');
assert(textOf('DARK_CASTLE_RIFT_EMPLACEMENT_PHASE8C').includes('深い裂け目へ向けて固定'), 'Castle weapons must visibly point toward the abyss-side fissure.');
assert(textOf('DARK_CASTLE_REPAIR_LAYERS_PHASE8C').includes('何年も塞ぎ直してきた'), 'Castle must show repeated long-term repairs.');

// Officers retain Phase8B identities while Luna develops.
const zeldras = textOf('DARK_CASTLE_ZELDRAS_ENCOUNTER');
const elmenas = textOf('DARK_CASTLE_ELMENAS_ENCOUNTER');
const belet = textOf('DARK_CASTLE_BELET_ELM_ENCOUNTER');
assert(zeldras.includes('聖女を置いて、貴様ら人間は去れ') && zeldras.includes('聖女もプリズムも二度と使わせん'), 'Zeldras Phase8B motive must remain.');
assert(zeldras.includes('魔族の討伐にも参加しました') && zeldras.includes('許してもらうために言ったのではありません'), 'Zeldras scene must advance Luna accountability.');
assert(elmenas.includes('王国は一度それを奪った') && elmenas.includes('見たものを自分で考えろ'), 'Elmenas Phase8B motive must remain.');
assert(elmenas.includes('魔族から闇のプリズムを保護した') && elmenas.includes('教えられた答えではなく'), 'Elmenas scene must confront Luna with false history.');
assert(belet.includes('思想の差異になど興味はない') && belet.includes('魔王様への謁見にふさわしい実力'), 'Belet Phase8B persona must remain.');
assert(belet.includes('後悔は、消しません。でも、もう目は逸らしません'), 'Belet scene must show Luna carrying regret without freezing.');

// Dark Prism / memory / truth sequence.
const clear = textOf('DARK_CASTLE_CLEAR');
for (const required of [
  '触れてみます。',
  '記憶の前と後が、境目を失って一度に流れ込む',
  'ルーナの膝から力が抜ける',
  'もういい。無理に戻さなくていい。',
  '私にとっても、きっと大切な思い出だから',
  '倒れたら支える。',
  '私、その子の手を握ってた。',
  '……暗かったのに。\n安心してた。',
  '闇のプリズムも。戦場に残った魔力も。死んだ人間も、魔族も。',
  'エクリプスが滅びた時点で',
  '許してほしいとは言いません',
  '自分で見て、自分で選びます',
  'リーシアが守った遺稿',
  'ソフィアが受け継いだ失敗の記録',
  'ミネルバが結晶樹で見つけた循環',
  '余が、魔術で確かめた実測',
  '属性は、一つになりたがってるんじゃない',
  '『調和』と『統合』',
  '余を善と呼ぶ気ならやめろ',
  '統合だ。',
  'この城の先に、我らが深淵の浸食を抑えてきた地下路がある。',
  '奈落への洞窟だ。その先が、統合の祭壇へ続く。',
  '余は命じていない。',
  '分かってる。\nだから行く。',
  '勝手に消えないで。'
]) assert(clear.includes(required), `DARK_CASTLE_CLEAR is missing approved Phase8C beat: ${required}`);
assert(!clear.includes('その子はアルス') && !clear.includes('妹の手') && !clear.includes('アルスの手を握って'), 'The identity of the remembered sleeping person must remain hidden.');
assert(!storySource.includes('門を破壊したのはアラン') && !storySource.includes('アランが門を破壊'), 'Runtime must not reveal Alan as the Gorge gate destroyer.');

// Commit order and safe replay.
const actions = events.dark_castle_clear?.actions || [];
const idx = typeOrPred => typeof typeOrPred === 'function' ? actions.findIndex(typeOrPred) : actions.findIndex(a => a.type === typeOrPred);
assert(actions[0]?.type === 'CONV' && actions[0]?.value === 'DARK_CASTLE_CLEAR', 'Dark Castle truth conversation must occur before state commits.');
const reward = actions.find(a => a.type === 'STORY_EXP');
assert(reward?.charId === 401 && reward?.amount === 300000 && reward?.rewardKey === 'luna_dark_castle_300k', 'Luna must receive the once-only Dark Castle +300,000 Story EXP reward.');
const memory = actions.find(a => a.type === 'WORLD_STATE' && a.key === 'lunaMemoryStage');
assert(memory?.value === 3 && memory?.mode === 'max', 'Luna memory stage must advance to at least 3 without regression.');
const mult = actions.find(a => a.type === 'SET_EXP_MULTIPLIER' && a.charId === 401);
assert(mult?.pct === 1600 && mult?.onlyDecrease === true, 'Luna multiplier must move to 1600% without raising later saves.');
const truthIndex = actions.findIndex(a => a.type === 'FLAG' && a.key === 'darkCastleTruthPhase8CSeen');
const clearIndex = actions.findIndex(a => a.type === 'FLAG' && a.key === 'darkCastleCleared');
const stepIndex = idx('STEP');
assert(truthIndex > 0 && clearIndex > truthIndex && stepIndex > clearIndex, 'Truth/reward commits must precede darkCastleCleared, which must precede Step9.');
for (const key of ['prismBlessingsComplete','secondIntegrationStarted']) {
  const i = actions.findIndex(a => a.type === 'FLAG' && a.key === key);
  assert(i > 0 && i < clearIndex, `${key} must commit before darkCastleCleared.`);
}
assert(logicSource.includes("action.mode === 'max'") && logicSource.includes('Math.max(current, requested)'), 'Story logic must support non-regressive WORLD_STATE max mode.');
assert(logicSource.includes('action.onlyDecrease === true') && logicSource.includes('Math.min(current, pct)'), 'Story logic must support non-regressive EXP multiplier replay.');

const throne = (castle?.floors || []).find(f => f.label === '本館3階・謁見の間');
const revisit = (throne?.mapActions || []).find(a => a.eventId === 'dark_castle_truth_phase8c_revisit');
assert(revisit?.x === 16 && revisit?.y === 7, 'Old-save truth revisit must use the former Zenon tile x16,y7.');
assert(revisit?.requiredFlag === 'darkCastleCleared' && revisit?.missingFlag === 'darkCastleTruthPhase8CSeen', 'Old-save revisit must be gated to old cleared saves missing the new truth flag.');
const replay = events.dark_castle_truth_phase8c_revisit?.actions || [];
assert(replay.some(a => a.type === 'STORY_EXP' && a.rewardKey === 'luna_dark_castle_300k'), 'Old-save replay must route through the same once-only Story EXP key.');
assert(replay.some(a => a.type === 'WORLD_STATE' && a.mode === 'max'), 'Old-save replay must not lower Luna memory stage.');
assert(replay.some(a => a.type === 'SET_EXP_MULTIPLIER' && a.onlyDecrease === true), 'Old-save replay must not raise a later Luna multiplier.');
assert(!replay.some(a => a.type === 'STEP'), 'Old-save replay must not roll later storyStep backward.');

// Canon and review records.
assert(canon.includes('聖女として植え付けられた魔族史と討伐歴') && canon.includes('自分で見て、自分で選び'), 'Scenario canon must record Luna false-history accountability and self-chosen justice.');
assert(canon.includes('記憶を急かさない関係') && canon.includes('今ここにいるルーナをルーナとして扱う'), 'Scenario canon must record the Alus/Luna non-pressure relationship rule.');
assert(encyclopedia.includes('魔族史教育・討伐・ガルヴァニアでの再起') && encyclopedia.includes('本人の見えないところで涙する'), 'Character encyclopedia must record both Luna moral arc and Alus private emotional release.');
assert(coding.includes('WORLD_STATE mode:max') && coding.includes('SET_EXP_MULTIPLIER onlyDecrease:true'), 'Coding handoff must document Phase8C save-safe actions.');
assert(draft.includes('approved / implementation authorized') && draft.includes('闇のプリズムへ直接触れてから'), 'Phase8C draft must record the approved direct-prism amendment.');
assert(queue.includes('DR-20260810-dark-castle-truth-second-integration-phase8c') && queue.includes('decision: approved_with_additions'), 'Dialogue review queue must record user approval with additions.');
assert(foreshadow.includes('FS-Phase8C-Luna-Dark-Prism-Memory') && foreshadow.includes('FS-Galvania-Gate-Destroyer-Alan-Hidden'), 'Foreshadowing ledger must track Luna memory and Alan information boundary.');
assert(news.includes('ガルヴァニア帝国と魔王城に、負傷兵・避難民・地下防衛の生活描写を追加しました'), 'NEWS must mention Phase8C environmental storytelling.');
assert(news.includes('魔王戦後の闇のプリズム、ルーナの記憶、第二次統合、シャニー加入までの本編を再構成しました'), 'NEWS must mention Phase8C main-story reconstruction.');

if (!process.exitCode) console.log('[phase8c-dark-castle] PASS: Luna accountability, Dark Prism memory pain, Alus non-pressure support, Galvania defense evidence, Zenon truth, second integration, Shanny choice, commit order, and old-save rescue are wired.');
