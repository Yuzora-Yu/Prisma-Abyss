const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8f-jasper] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

function loadStory() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(read('story.js') + '\n;globalThis.__DATA=STORY_MANAGER_DATA;', ctx);
  return ctx.__DATA;
}
function loadMaps() {
  const ctx = { console };
  vm.createContext(ctx);
  vm.runInContext(read('map.js') + '\n;globalThis.__FM=FIXED_MAPS;', ctx);
  return ctx.__FM;
}

const story = loadStory();
const maps = loadMaps();
const battleSource = read('battle.js');
const storyLogic = read('story_logic.js');
const skills = read('skills.js');
const news = read('news.js');

const flatten = key => (story.scripts[key] || []).map(x => `${x.name}:${x.text}`).join('\n');
const common = flatten('ABYSS_JASPER');
assert(common.includes('混沌呪縛'), 'Jasper must spring the chaos-bind trap before battle.');
assert(common.includes('王国には救済の儀と信じ込ませた') && common.includes('異を唱える者は反逆者'), 'Jasper must boast about manipulating the kingdom and silencing dissent.');
assert(common.includes('聖女も、騎士も、プリズムも') && common.includes('すべての生命を使って研究を完成'), 'Jasper must boast about the human/prism experiments and eventual all-life research plan.');
assert(common.includes('亡骸を深淵王様へ捧げ') && common.includes('幹部として重用'), 'Jasper must expect to offer the party corpses and remain valued by the Abyss King.');

const alanEntry = flatten('ABYSS_JASPER_ALAN_ENTRY_PHASE8F');
assert(alanEntry.includes('混沌に染まった光') && alanEntry.includes('混沌呪縛の術式へ逆流'), 'Surviving Alan must break the chaos-bind with chaos-tainted light.');
assert(alanEntry.includes('黒幕の口から') && alanEntry.includes('共に戦わせてくれ'), 'Alan must hear the truth from Jasper and ask Ars to fight together.');
assert(alanEntry.includes('ガイル') || story.scripts.ABYSS_JASPER_ALAN_ENTRY_PHASE8F.some(x => x.name === 'ガイル'), 'Gail must react to Alan’s return.');

const ev = story.events.abyss_jasper_battle;
const evText = JSON.stringify(ev);
assert(evText.includes('alanSavedAtIntegrationAltar'), 'Jasper battle must branch on Alan survival.');
assert(evText.includes('"ambush":true'), 'Alan-dead Jasper battle must start as an ambush.');
assert(evText.includes('openingPartyStatDebuff') && evText.includes('"multiplier":0.5'), 'Alan-dead battle must start with 50% party stat debuff.');
assert(evText.includes('externalTurnSupports') && evText.includes('alan_jagorea_phase8f'), 'Alan-survives battle must configure external NPC turn support.');
for (const id of [146,115,508,232]) assert(evText.includes(String(id)), `Alan support skill ${id} must be configured.`);

assert(skills.includes('"id": 115') && skills.includes('"name": "霊脈断ち"'), '霊脈断ち skill master missing.');
assert(skills.includes('"id": 146') && skills.includes('"name": "アステリア"'), 'アステリア skill master missing.');
assert(skills.includes('"id": 232') && skills.includes('"name": "ルクシオン・ノナ"'), 'ルクシオン・ノナ skill master missing.');
assert(skills.includes('"id": 508') && skills.includes('"name": "戦神の律動"'), '戦神の律動 skill master missing.');

assert(storyLogic.includes('externalTurnSupports') && storyLogic.includes('openingPartyStatDebuff'), 'Story BOSS action must persist generic external support and opening stat debuff config.');
assert(battleSource.includes('getExternalTurnSupportConfigs') && battleSource.includes('appendExternalTurnSupportCommands'), 'Generic external turn support runtime is missing.');
assert(battleSource.includes('findExternalTurnSupportSourceCharacter') && battleSource.includes('App.calcStats(source)'), 'External support must derive stats from a configured character.');
assert(battleSource.includes('Battle.appendExternalTurnSupportCommands(queuedCommands'), 'External NPC support must be injected every turn.');
assert(battleSource.includes('applyOpeningPartyStatDebuff') && battleSource.includes('openingPartyStatDebuffApplied'), 'Opening party stat debuff runtime is missing or not idempotent.');

// Exercise the generic support selector with a protagonist-stat source and the four Alan skills.
class Player {
  constructor(c) { Object.assign(this, c); this.name = c.name; this.uid = c.uid; this.hp = c.currentHp || 1; this.mp = c.currentMp || 0; this.skills = []; }
}
const hero = { uid:'p1', charId:301, isHero:true, name:'アルス', currentHp:500, currentMp:100 };
const App = {
  data:{ characters:[hero], battle:{ externalTurnSupports:[{ supportId:'alan_test', name:'アラン', sourceCharId:301, skillIds:[146,115,508,232], selection:'cycle' }] } },
  calcStats:() => ({ maxHp:1000, maxMp:200, atk:222, def:180, mdef:170, spd:160, mag:190, hit:100, eva:12, cri:6, elmAtk:{}, elmRes:{}, resists:{} })
};
const DB = { SKILLS:[
  {id:146,name:'アステリア',type:'物理',target:'ランダム',mp:35},
  {id:115,name:'霊脈断ち',type:'物理',target:'単体',mp:15},
  {id:508,name:'戦神の律動',type:'強化',target:'全体',mp:45},
  {id:232,name:'ルクシオン・ノナ',type:'魔法',target:'ランダム',mp:70}
]};
const ctx = { console, App, DB, Player, Monster:class{}, document:{}, window:{}, setTimeout, clearTimeout };
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(battleSource + '\n;globalThis.__Battle=Battle;', ctx, {filename:'battle.js'});
const Battle = ctx.__Battle;
Battle.isSupportSkill = skill => skill.type === '強化';
Battle.initBattleStatus = actor => { actor.battleStatus = {buffs:{},debuffs:{},ailments:{}}; };
Battle.getBattleStat = (actor,key) => actor[key] || 0;
Battle.isBattleAlive = unit => !!unit && Number(unit.hp || 0) > 0;
Battle.getUnitBaseId = unit => Number(unit.baseId || unit.id || 0);
Battle.party = [{name:'アルス', hp:100, battleStatus:{buffs:{},debuffs:{},ailments:{}}}];
Battle.enemies = [{name:'ジャスパー', hp:1000, baseId:302060}];
Battle.initializeExternalTurnSupports();
const generated = [1,2,3,4].map(turn => Battle.buildExternalTurnSupportCommand(App.data.battle.externalTurnSupports[0], turn, 1));
assert(generated.every(Boolean), 'Generic support command generation failed.');
assert(generated.map(c => c.data.name).join('|') === 'アステリア|霊脈断ち|戦神の律動|ルクシオン・ノナ', 'Alan support must cycle through the four configured skills in order.');
assert(generated.every(c => c.actor.name === 'アラン' && c.actor.atk === 222), 'Alan support actor must use the protagonist-derived final stats while retaining Alan identity.');
assert(generated[2].target === 'all_ally', '戦神の律動 must support the player party rather than target Jasper.');
assert(generated[1].target?.baseId === 302060, 'Single-target Alan support must prefer the fixed boss target.');

const clearText = JSON.stringify(story.events.abyss_jasper_clear);
assert(clearText.includes('alanSavedAtIntegrationAltar'), 'Alan post-Jasper scene must only occur on saved route.');
assert(clearText.includes('"amount":1000000') && clearText.includes('alan_jagorea_join_1000k'), 'Alan rejoin must grant once-only 1,000,000 Story EXP.');
assert(clearText.includes('"yesLabel":"仲間に迎える"') && clearText.includes('"noLabel":"今は断る"'), 'Post-Jasper Alan rejoin must remain a player choice.');
assert(clearText.includes('alanWaitingAtLegacionAfterJasper'), 'Refused Alan must move to Legacion waiting state.');

const legacion = maps.LEGACION;
const alanActor = legacion.mapActors.find(a => a.actorId === 'alan_waiting_legacion_phase8f');
assert(alanActor && alanActor.imageKey === 'overlay_companion_alan', 'Refused Alan must appear as a person actor in Legacion.');
const waiting = alanActor.states.find(s => s.stateId === 'alan_waiting_after_jasper');
assert(waiting?.when?.requiredFlag === 'alanWaitingAtLegacionAfterJasper' && waiting?.when?.missingFlag === 'alanRejoinedAfterJasper', 'Legacion Alan actor must only appear while waiting and not yet rejoined.');
assert(waiting?.action?.eventId === 'abyss_legacion_alan_rejoin_phase8f', 'Legacion Alan actor must invoke rejoin event.');
const rejoinText = JSON.stringify(story.events.abyss_legacion_alan_rejoin_phase8f);
assert(rejoinText.includes('"amount":1000000') && rejoinText.includes('alan_jagorea_join_1000k'), 'Delayed Legacion rejoin must grant the same once-only 1,000,000 EXP reward.');

assert(news.includes('ジャゴレアのジャスパー戦') && news.includes('アラン生存時の援護戦闘'), 'NEWS must mention Phase8F Jasper/Alan battle changes.');

if (!process.exitCode) console.log('[phase8f-jasper] PASS: Jasper trap/boast scene, death-route ambush+half stats, generic external NPC turn support, Alan four-skill cycle, post-battle rejoin choice, Legacion fallback, and 1,000,000 EXP are wired.');
