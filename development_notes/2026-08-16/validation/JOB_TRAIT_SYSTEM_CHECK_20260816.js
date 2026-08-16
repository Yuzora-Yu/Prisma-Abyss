const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '../../..');

global.window = globalThis;
global.App = { data: { battle: { turnNumber: 1, jobTraitRuntime: {} } } };
global.DB = { SKILLS: [], CHARACTERS: [] };
vm.runInThisContext(fs.readFileSync(path.join(root, 'job_data.js'), 'utf8'), { filename:'job_data.js' });
vm.runInThisContext(fs.readFileSync(path.join(root, 'job_traits.js'), 'utf8'), { filename:'job_traits.js' });

let passed = 0;
let failed = 0;
const failures = [];
function ok(cond, label) {
  if (cond) { passed++; console.log(`PASS ${label}`); }
  else { failed++; failures.push(label); console.log(`FAIL ${label}`); }
}
function near(a,b,eps,label){ ok(Math.abs(Number(a)-Number(b)) <= eps, `${label} (${a} ~= ${b})`); }
function reset(turn=1){ App.data.battle = { turnNumber:turn, jobTraitRuntime:{} }; }
function unit(jobId, { level=100, reinc=0, hp=1000, mp=500, atk=200, mag=180, name=null, equips={} } = {}) {
  const job = JobData.getById(jobId);
  const source = { uid:`c${jobId}-${Math.random()}`, charId:300+jobId, jobId, job:job.name, level, reincarnationCount:reinc, equips, jobHistory:[1,jobId] };
  return {
    uid:source.uid, charId:source.charId, name:name || job.name, originData:source,
    hp, mp, baseMaxHp:1000, baseMaxMp:500, atk, def:160, mag, mdef:150, spd:120, eva:5, cri:5,
    battleStatus:{ buffs:{}, debuffs:{}, ailments:{}, jobTraits:{} }, isDead:false, isFled:false
  };
}
function battle(party=[], enemies=[]) {
  return {
    party, enemies,
    isBattleAlive:u=>!!u && !u.isDead && !u.isFled && Number(u.hp)>0,
    getBattleStat:(u,key)=>u[key] ?? (key==='elmRes'?{}:0),
    log:()=>{}, playRecoverySe:()=>{}, applyPersistentBattlePassives:()=>{},
    markDefeated:u=>{ if(u.isDead) return false; u.isDead=true; u.hp=0; return true; },
    tryGutsSurvive:()=>false,
    processAction:async()=>{}, executeReactionAttack:async()=>{}
  };
}

(async () => {
// Master/data coverage and current-job-only semantics.
ok(Object.keys(JOB_TRAIT_DATA).length === 23, '23職すべてに職業特性定義がある');
for (const job of JobData.getAll()) {
  ok(!!JOB_TRAIT_DATA[job.id], `jobId ${job.id} ${job.name} に特性定義がある`);
  const u=unit(job.id); ok(JobTraits.jobIdOf(u)===job.id, `${job.name}: 現在jobIdを正しく参照`);
}
const formerHunter=unit(1); formerHunter.originData.jobHistory=[15,1];
ok(!JobTraits.isJob(formerHunter,15) && JobTraits.isJob(formerHunter,1), '職歴ではなく現在職だけが特性判定に使われる');
const reinc=unit(1,{level:50,reinc:3}); ok(JobTraits.effectiveLevel(reinc)===350, '実質Lv=表示Lv+転生回数×100を使用');

// 1 戦士
reset(1); { const u=unit(1); const b=battle([u],[]); JobTraits.onDefend(b,u); App.data.battle.turnNumber=2; near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'},isPhysical:true}),3,1e-9,'戦士Lv100: 防御次ターンは+200%=3倍'); }
reset(1); { const u=unit(1,{level:100,reinc:3}); const b=battle([u],[]); JobTraits.onDefend(b,u); App.data.battle.turnNumber=2; near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'},isPhysical:true}),4,1e-9,'戦士: 最大+300%=4倍'); }

// 2 僧侶
reset(); { const u=unit(2); near(JobTraits.getMpCostMultiplier(u,{type:'回復'}),0.7,1e-9,'僧侶Lv100: 回復MP30%減'); ok(JobTraits.adjustEffectTurns(u,{type:'強化'},5,'buff')===6,'僧侶: 強化効果+1ターン'); ok(JobTraits.adjustEffectTurns(u,{type:'強化'},5,'debuff')===5,'僧侶: 強化技の代償デバフは延長しない'); }

// 3 魔法使い
reset(); { const u=unit(3,{mp:0}); const b=battle([u],[]); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'魔法'},cmd:{targetScope:'単体'}}),1.5,1e-9,'魔法使い: MP0で与ダメ+50%'); u.mp=500; near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'魔法'},cmd:{targetScope:'単体'}}),1,1e-9,'魔法使い: MP満タンでは低MP補正なし'); const e={name:'敵',hp:0,isDead:true}; b.enemies=[e]; u.mp=0; JobTraits.onKill(b,u,e); ok(u.mp===50,'魔法使いLv100: 討伐で最大MP10%回復'); }

// 4 武闘家
reset(); { const u=unit(4); const b=battle([u],[]); for(let i=0;i<8;i++) JobTraits.onSuccessfulHit(b,{actor:u,target:{},data:{type:'物理'},cmd:{}}); ok(JobTraits.getCritBonus(u)===16,'武闘家: 8連続ヒットで会心率+16%'); near(JobTraits.criticalDamageMultiplier(u),1.32,1e-9,'武闘家: 8連続ヒットで会心ダメ+32%'); JobTraits.onMissedHit(u); ok(JobTraits.getCritBonus(u)===0,'武闘家: ミスで連続ヒット解除'); }

// 5 斥候
reset(); { const u=unit(5); const e=unit(1,{name:'敵'}); const b=battle([u],[e]); let counter=0; b.executeReactionAttack=async()=>{counter++}; const old=Math.random; Math.random=()=>0; await JobTraits.onEvadedAttack(b,u,e,{isEnemy:true,isReaction:false}); Math.random=old; ok(counter===1,'斥候: 敵攻撃回避時に通常反撃'); ok(!!e.battleStatus.ailments.Poison,'斥候: 反撃後に4ターン状態異常を付与'); }

// 6 踊り子
reset(); { const u=unit(6,{level:100,reinc:2}); const ally=unit(1); const e=unit(1,{name:'敵'}); const b=battle([u,ally],[e]); window.JOB_SKILLS_DATA.__test={1:900001}; DB.SKILLS=[{id:900001,name:'試験鼓舞',type:'強化',target:'全体',mp:999,buff:{atk:1.2},turn:3}]; let follow=0; b.processAction=async cmd=>{ if(cmd.isJobTraitFollowup) follow++; }; const old=Math.random; Math.random=()=>0; await JobTraits.onActionComplete(b,u,{type:'特殊'},{isReaction:false}); Math.random=old; delete window.JOB_SKILLS_DATA.__test; ok(follow===1,'踊り子: 最大20%抽選成功時に習得可能な全体強化/弱体を追加発動'); }

// 7 魔法剣士
reset(); { const u=unit(7); const b=battle([u],[]); JobTraits.onActionStart(u,{type:'物理'},{type:'skill',jobTraitActionToken:'m1'}); JobTraits.onActionStart(u,{type:'魔法'},{type:'skill',jobTraitActionToken:'m2'}); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'}}),1.05,1e-9,'魔法剣士: 物理→魔法で+5%蓄積'); }

// 8 賢者
reset(); { const u=unit(8,{mp:500}); const b=battle([u],[]); near(JobTraits.getMpCostMultiplier(u,{type:'物理'}),0.7,1e-9,'賢者Lv100: 全スキルMP30%減'); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'魔法'},cmd:{targetScope:'単体'}}),1.5,1e-9,'賢者: MP満タンで与ダメ+50%'); }

// 9 侍
reset(); { const u=unit(9,{equips:{}}); const b=battle([u],[]); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'}}),1.75,1e-9,'侍: 頭体足すべて未装備で与ダメ+75%'); ok(JobTraits.adjustBattleStat(b,u,'eva',5)===50,'侍: 回避+45%'); ok(JobTraits.adjustBattleStat(b,u,'cri',5)===35,'侍: 会心+30%'); }

// 10 剣闘士
reset(); { const u=unit(10); const b=battle([u],[]); for(let i=0;i<50;i++) JobTraits.onDamageTaken(b,u,1); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'}}),2,1e-9,'剣闘士: 50被ダメージで+100%上限'); }

// 11 エンターテイナー
reset(1); { const u=unit(11); const ally=unit(1); const b=battle([u,ally],[]); await JobTraits.onEndOfRound(b); await JobTraits.onEndOfRound(b); await JobTraits.onEndOfRound(b); near(JobTraits.outgoingMultiplier(b,{actor:ally,data:{type:'物理'},cmd:{targetScope:'単体'}}),1.15,1e-9,'エンターテイナー: 3生存ターンで味方与ダメ+15%'); }

// 12 星詠師
reset(2); { const star=unit(12); const ally=unit(1,{hp:500}); const b=battle([star,ally],[]); const old=Math.random; Math.random=()=>0; await JobTraits.onEndOfRound(b); Math.random=old; ok(ally.hp===600,'星詠師: 偶数ターン終了時にHP/MP/バフのいずれかが必ず発動'); }

// 13 聖拳士
reset(); { const u=unit(13,{hp:500}); const b=battle([u],[]); ok(JobTraits.canPayHolyFistCost(u,{type:'物理'},100),'聖拳士: HPが消費MPより多ければ使用可能'); ok(JobTraits.spendHolyFistHp(u,{type:'物理'},100)===100 && u.hp===400,'聖拳士: 物理特技で消費MPと同量HP消費'); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'},isPhysical:true,holyFistHpCost:100}),1.5,1e-9,'聖拳士: HP100消費で与ダメ+50%'); }

// 14 聖騎士
reset(); { const pal=unit(14,{level:100,reinc:2}); const ally=unit(1); const b=battle([pal,ally],[]); near(JobTraits.incomingMultiplier(b,ally),0.7,1e-9,'聖騎士: 味方被ダメ30%減上限'); }

// 15 狩人
reset(1); { const u=unit(15); const b=battle([u],[]); JobTraits.onDefend(b,u); App.data.battle.turnNumber=2; ok(JobTraits.forceCritical(u,true),'狩人: 防御次ターンは物理攻撃が強制会心'); ok(!JobTraits.forceCritical(u,false),'狩人: 魔法攻撃は必殺の強制会心対象外'); near(JobTraits.criticalDamageMultiplier(u,true),1.75,1e-9,'狩人Lv100: 会心ダメ+75%'); }

// 16 魔弓使い
reset(); { const u=unit(16,{atk:200,mag:180}); const b=battle([u],[]); ok(JobTraits.adjustBattleStat(b,u,'mag',180)===280,'魔弓使い: 攻撃力の半分を魔力へ加算'); }

// 17 光魔剣士
reset(); { const u=unit(17); const e=unit(1,{name:'敵'}); const b=battle([u],[e]); JobTraits.onSuccessfulHit(b,{actor:u,target:e,data:{type:'物理'},cmd:{jobTraitActionToken:'a'}}); JobTraits.onSuccessfulHit(b,{actor:u,target:e,data:{type:'魔法'},cmd:{jobTraitActionToken:'b'}}); near(JobTraits.incomingMultiplier(b,e),1.05,1e-9,'光魔剣士: 同対象へ交互に命中で被ダメ+5%'); }

// 18 忍者
reset(); { const ninja=unit(18); const ally=unit(1); const b=battle([ninja,ally],[]); near(JobTraits.getItemEffectMultiplier(ninja),2.5,1e-9,'忍者Lv100: 道具効果+150%=2.5倍'); const candidates=JobTraits.filterEnemySingleTargetCandidates(b,[ninja,ally]); ok(!candidates.includes(ninja) && candidates.includes(ally),'忍者: 他仲間生存時は敵の単体指定対象外'); ally.isDead=true; ally.hp=0; ok(JobTraits.filterEnemySingleTargetCandidates(b,[ninja]).includes(ninja),'忍者: 最後の生存者なら単体指定対象になる'); }

// 19 竜騎士
reset(); { const u=unit(19,{hp:1000}); const b=battle([u],[]); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理',target:'全体'},cmd:{targetScope:'全体'}}),1.5,1e-9,'竜騎士: HP100%で全体与ダメ+50%'); near(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'}}),1,1e-9,'竜騎士: HP100%で単体補正0%'); u.hp=100; ok(JobTraits.outgoingMultiplier(b,{actor:u,data:{type:'物理'},cmd:{targetScope:'単体'}})>8,'竜騎士: HP10%で単体補正が大幅上昇'); }

// 20 聖女
reset(); { const saint=unit(20); const ally=unit(1,{hp:500,mp:250}); const b=battle([saint,ally],[]); const old=Math.random; Math.random=()=>0.49; JobTraits.onDefend(b,saint); Math.random=old; ok(!!ally.battleStatus.jobTraits.saintessBuff,'聖女: 防御時に既存バフと別枠の慈愛強化を付与'); ok(Object.keys(ally.battleStatus.jobTraits.saintessBuff.stats).length===5 && ally.battleStatus.jobTraits.saintessBuff.elementRes,'聖女: 各能力/全属性耐性を独立50%判定'); }

// 21 魔王
reset(); { const demon=unit(21,{level:100,reinc:3}); const e=unit(1,{name:'敵'}); const b=battle([demon],[e]); const old=Math.random; Math.random=()=>0; ok(JobTraits.tryDemonKingSuppress(b,e),'魔王: 発動率抽選成功で敵行動を停止'); Math.random=old; near(JobTraits.incomingMultiplier(b,e),1.2,1e-9,'魔王: 行動不能対象の被ダメ+20%'); ok(e.battleStatus.jobTraits.demonKingVulnerability.turns===2,'魔王: 発動ラウンド末を越えて1ターン分維持できる内部値'); }

// 22 神
reset(); { const god=unit(22,{level:100,reinc:2}); const ally=unit(1,{hp:0,mp:0}); ally.isDead=true; const b=battle([god,ally],[]); const old=Math.random; Math.random=()=>0; ok(JobTraits.onUnitDefeated(b,ally)===true && !ally.isDead && ally.hp===1000 && ally.mp===500,'神: 味方死亡時にHPMP全回復蘇生'); Math.random=old; ok(JobTraits.overrideElementResistance(god,{},{},0)===0,'神: 光以外の耐性は上書きしない'); ok(JobTraits.overrideElementResistance(god,{},'光',999)===-100,'神: 攻撃時の光耐性を-100%として計算'); }

// 23 勇者
reset(); { const hero=unit(23,{level:100,reinc:2}); const ally=unit(1); const b=battle([hero,ally],[]); ok(JobTraits.adjustBattleStat(b,ally,'atk',100)===130,'勇者: 自分以外の味方ステータス+30%上限'); const fallen=unit(2,{hp:0}); fallen.isDead=true; b.party.push(fallen); JobTraits.onUnitDefeated(b,fallen); ok(JobTraits.adjustBattleStat(b,hero,'atk',100)===110,'勇者: 仲間死亡1回で自身ステータス+10%'); }

// Static integration contract checks.
const battleJs=fs.readFileSync(path.join(root,'battle.js'),'utf8');
const indexHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const itemRuntime=fs.readFileSync(path.join(root,'item_runtime.js'),'utf8');
[
  'JobTraits.adjustFinalDamage', 'JobTraits.onEvadedAttack', 'JobTraits.tryDemonKingSuppress',
  'JobTraits.onEndOfRound', 'JobTraits.getCritBonus', 'JobTraits.forceCritical',
  'JobTraits.onActionStart', 'JobTraits.onActionComplete', 'JobTraits.filterEnemySingleTargetCandidates'
].forEach(token=>ok(battleJs.includes(token),`battle.js integration: ${token}`));
ok(indexHtml.includes('<script src="job_traits.js"></script>'),'index.html loads job_traits.js');
ok(indexHtml.indexOf('<script src="job_traits.js"></script>') < indexHtml.indexOf('<script src="battle.js"></script>'),'job_traits.js is loaded before battle.js');
const swJs=fs.readFileSync(path.join(root,'sw.js'),'utf8');
ok(swJs.includes('job_traits.js'),'sw.js precaches job_traits.js');
ok(swJs.includes('prisma-abyss-v65.20260816'),'sw.js cache version is bumped for job traits');
ok(battleJs.includes('jobTraitRuntime: {}'),'new battle initializes a fresh jobTraitRuntime');
ok(battleJs.includes('d.battleStatus = p.battleStatus'),'battle save persists player job-trait status with battleStatus');
ok(battleJs.includes('battleStatus: clone(enemy.battleStatus'),'enemy snapshots persist job-trait status');
ok(itemRuntime.includes('JobTraits.getItemEffectMultiplier'),'item_runtime.js applies Ninja item multiplier');
vm.runInThisContext(itemRuntime, { filename:'item_runtime.js' });
reset(); {
  const ninja=unit(18); const target=unit(1,{hp:100}); const b=battle([ninja,target],[]);
  App.data.items={990001:1};
  const result=ItemRuntime.applyBattleItem({ Battle:b, App, item:{id:990001,name:'試験薬',type:'HP回復',val:100,battleUsable:true}, command:{actor:ninja,target} });
  ok(result.handled && target.hp===350,'忍者: 戦闘中のHP回復道具100が2.5倍の250回復になる');
}

console.log(`RESULT ${passed}/${passed+failed} PASS`);
if (failed) {
  console.error(`FAILED ${failed}: ${failures.join(', ')}`);
  process.exit(1);
}

})().catch(error => { console.error(error); process.exit(1); });
