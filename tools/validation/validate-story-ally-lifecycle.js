const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const noop = () => {};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const document = {
    getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[], addEventListener:noop,
    createElement:()=>({style:{},classList:{add:noop,remove:noop,toggle:noop},appendChild:noop,addEventListener:noop,getContext:()=>({})}),
    body:{appendChild:noop,classList:{add:noop,remove:noop}}, documentElement:{style:{setProperty:noop}}
};
const window={JOB_SKILLS:{},CHARACTERS_DATA:[],addEventListener:noop,location:{href:''},innerWidth:800,innerHeight:600,devicePixelRatio:1,requestAnimationFrame:()=>0};
const context={console,window,document,localStorage:{getItem:()=>null,setItem:noop,removeItem:noop},navigator:{},performance:{now:()=>0},requestAnimationFrame:()=>0,cancelAnimationFrame:noop,setTimeout,clearTimeout,setInterval,clearInterval,Image:function(){},Audio:function(){},Blob:function(){},URL:{createObjectURL:()=>'',revokeObjectURL:noop},fetch:async()=>({ok:false}),crypto:{getRandomValues:v=>v},CONST:{EXP_BASE:100,RARITY_EXP_MULT:{R:1}},DB:{SKILLS:[],CHARACTERS:[]}};
context.globalThis=context;window.window=window;window.document=document;
vm.createContext(context);
vm.runInContext(`${mainSource}\nglobalThis.__App=App;`,context,{filename:'main.js'});
const App=context.__App;
App.save=noop;
const sword={uid:'eq-sword',name:'剣'};
const shield={uid:'eq-shield',name:'盾'};
App.data={
  system:{},progress:{flags:{},worldState:App.getDefaultWorldState(),storyCharacters:{},storyRewards:{},quests:{}},
  characters:[{uid:'alan-u',charId:201,name:'アラン',level:20,equips:{'武器':sword,'副武器':sword,'盾':shield,'頭':null,'体':null,'足':null}}],
  party:['alan-u',null,null,null],inventory:[],items:{},book:{monsters:[],killCounts:{}}
};
App.ensureWorldState(App.data);App.ensureStoryCharacterStates(App.data);

const depart=App.departStoryAlly(201,{returnEquipment:true,save:false});
assert(depart.ok===true && depart.returnedCount===2, `Expected 2 unique returned equips, got ${depart.returnedCount}.`);
assert(App.data.inventory.length===2, 'Returned equipment was not moved into inventory.');
assert(Object.values(App.data.characters[0].equips).every(v=>v===null), 'Equipment slots were not cleared.');
assert(App.isStoryAllyAvailable(201)===false && App.isStoryAllyInParty(201)===false, 'Departed ally remained available/in party.');
assert(App.hasStoryAlly(201)===true, 'Departure erased recruitment history.');

const repeat=App.departStoryAlly(201,{returnEquipment:true,save:false});
assert(repeat.returnedCount===0 && App.data.inventory.length===2, 'Repeated departure duplicated returned equipment.');

let rejoin=App.rejoinStoryAlly(201,{save:false});
assert(rejoin.ok===true && App.isStoryAllyAvailable(201)===true && App.isStoryAllyInParty(201)===true, 'Normal rejoin failed.');

const permanent=App.departStoryAlly(201,{permanent:true,save:false});
assert(permanent.ok===true && App.getStoryCharacterState(201).permanentlyUnavailable===true, 'Permanent departure state was not recorded.');
rejoin=App.rejoinStoryAlly(201,{save:false});
assert(rejoin.ok===false && rejoin.reason==='permanently_unavailable', 'Permanent departure was bypassed by normal rejoin.');
rejoin=App.rejoinStoryAlly(201,{allowPermanentReturn:true,save:false});
assert(rejoin.ok===true && App.getStoryCharacterState(201).permanentlyUnavailable===false, 'Explicit permanent-return override failed.');

console.log('PASS: story ally equipment return is idempotent, departure preserves recruitment history, and normal/permanent rejoin rules behave as expected.');
