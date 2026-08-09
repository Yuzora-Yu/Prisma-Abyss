const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const databaseSource = fs.readFileSync(path.join(root, 'database.js'), 'utf8');
const noop = () => {};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const document = {
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop,
    createElement: () => ({ style:{}, classList:{add:noop,remove:noop,toggle:noop}, appendChild:noop, addEventListener:noop, getContext:()=>({}) }),
    body:{appendChild:noop,classList:{add:noop,remove:noop}}, documentElement:{style:{setProperty:noop}}
};
const window = { JOB_SKILLS:{}, CHARACTERS_DATA:[], addEventListener:noop, location:{href:''}, innerWidth:800, innerHeight:600, devicePixelRatio:1, requestAnimationFrame:()=>0 };
const context = {
    console, window, document,
    localStorage:{getItem:()=>null,setItem:noop,removeItem:noop}, navigator:{}, performance:{now:()=>0},
    requestAnimationFrame:()=>0,cancelAnimationFrame:noop,setTimeout,clearTimeout,setInterval,clearInterval,
    Image:function(){},Audio:function(){},Blob:function(){},URL:{createObjectURL:()=>'',revokeObjectURL:noop},fetch:async()=>({ok:false}),crypto:{getRandomValues:v=>v},
    CONST:{EXP_BASE:100,RARITY_EXP_MULT:{R:1,SSR:1}}, DB:{SKILLS:[],CHARACTERS:[]}
};
context.globalThis=context; window.window=window; window.document=document;
vm.createContext(context);
vm.runInContext(`${mainSource}\nglobalThis.__App=App;`,context,{filename:'main.js'});
const App=context.__App;
App.save=noop;
App.data={
    system:{},
    progress:{storyStep:0,subStep:0,flags:{},worldState:App.getDefaultWorldState(),storyCharacters:{},storyRewards:{},quests:{}},
    items:{},
    characters:[{uid:'u1',charId:999,name:'テスト',job:'戦士',rarity:'R',level:1,exp:0,hp:10,mp:5,atk:3,def:3,mag:1,spd:2,mdef:1,sp:0,equips:{},traits:[],tree:{},skills:[]}],
    party:['u1',null,null,null]
};
App.ensureStoryCharacterStates(App.data);
const char=App.data.characters[0];

char.expMultiplierPct=100;
const normalNeed=App.getNextExp(char);
char.expMultiplierPct=2000;
const sealedNeed=App.getNextExp(char);
assert(sealedNeed === normalNeed * 20, `2000% requirement should be exactly 20x: ${normalNeed} -> ${sealedNeed}`);
assert(App.setCharacterExpRequirementMultiplierPct(char, 1800, {save:false}) === true, 'Failed to set individual EXP multiplier.');
assert(App.getCharacterExpRequirementMultiplierPct(char) === 1800, 'EXP multiplier setter/getter mismatch.');

// Deterministic level-up harness for one-time story EXP behavior.
char.level=1; char.exp=0; char.expMultiplierPct=100; char.skills=[];
App.getNextExp=()=>100;
App.applyLevelUpGrowth=(target,options={})=>{ target.level++; return options.silent===true ? [] : [`LV${target.level}`]; };
const first=App.grantStoryExp(999,350,'test_reward',{save:false});
assert(first.ok === true, 'Story EXP first grant failed.');
assert(first.levelsGained === 3 && char.level === 4 && char.exp === 50, `Story EXP multi-level result was wrong: ${JSON.stringify(first)}`);
assert(App.hasStoryReward('test_reward') === true, 'Story reward one-time flag was not recorded.');
assert(first.logs.length === 1 && first.logs[0].includes('3レベル上がり'), 'Large level-up notification was not aggregated.');
const snapshot={level:char.level,exp:char.exp};
const duplicate=App.grantStoryExp(999,350,'test_reward',{save:false});
assert(duplicate.ok === false && duplicate.duplicate === true, 'Duplicate story EXP grant was not blocked.');
assert(char.level===snapshot.level && char.exp===snapshot.exp, 'Duplicate story EXP changed character progression.');

const missing=App.grantStoryExp(123456,300000,'missing_character_reward',{save:false});
assert(missing.ok===false && missing.reason==='character_missing', 'Missing character reward did not fail safely.');
assert(App.hasStoryReward('missing_character_reward')===false, 'Failed reward was incorrectly consumed.');

// addStoryAlly can now author Lv1 + 2000% without changing the legacy default-level table yet.
window.CHARACTERS_DATA=[{id:401,name:'ルーナ',job:'聖女',rarity:'R',hp:10,mp:10,atk:1,def:1,mag:5,spd:2,mdef:5,sp:0}];
App.data.characters=App.data.characters.filter(c=>Number(c.charId)!==401);
const luna=App.addStoryAlly(401,{initialLevel:1,expMultiplierPct:2000,available:false,joinParty:false,silent:true,save:false});
assert(luna && luna.level===1, 'Story ally initialLevel override failed.');
assert(luna.expMultiplierPct===2000, 'Story ally EXP multiplier initialization failed.');
assert(App.isStoryAllyAvailable(401)===false, 'Unavailable story join state was lost.');

assert(databaseSource.includes('storyRewards: {}'), 'database.js initial template is missing storyRewards.');
assert(mainSource.includes('individualExpMult = App.getCharacterExpRequirementMultiplierPct(charData) / 100'), 'getNextExp does not apply individual multiplier.');
assert(mainSource.includes('grantStoryExp: (charId, expGain, rewardKey, options = {})'), 'grantStoryExp helper is missing.');

console.log('PASS: individual EXP requirements, Lv1/2000% story joins, one-time Story EXP, and aggregated mass level-up logs behave as expected.');
