const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const noop = () => {};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
let persisted = 0;
const fieldScene = { id:'field-scene', style:{ display:'flex', filter:'' } };
const document = {
    getElementById: id => id === 'field-scene' ? fieldScene : null,
    querySelectorAll: selector => selector === '.scene-layer' ? [fieldScene] : [],
    querySelector: () => null,
    addEventListener: noop,
    createElement: () => ({ style:{}, classList:{add:noop,remove:noop,toggle:noop}, appendChild:noop, addEventListener:noop, getContext:()=>({}) }),
    body:{appendChild:noop,classList:{add:noop,remove:noop}},
    documentElement:{style:{setProperty:noop}}
};
const window = {
    JOB_SKILLS:{}, CHARACTERS_DATA:[
        {id:301,name:'アルス',job:'戦士',rarity:'R',hp:10,mp:5,atk:3,def:3,mag:1,spd:2,mdef:1,sp:0},
        {id:777,name:'回想レイラ',job:'騎士',rarity:'R',hp:12,mp:4,atk:4,def:4,mag:1,spd:3,mdef:2,sp:0}
    ],
    addEventListener:noop, location:{href:''}, innerWidth:800, innerHeight:600, devicePixelRatio:1, requestAnimationFrame:()=>0
};
const context = {
    console, window, document,
    localStorage:{getItem:()=>null,setItem:()=>{persisted++;},removeItem:noop}, navigator:{}, performance:{now:()=>0},
    requestAnimationFrame:()=>0,cancelAnimationFrame:noop,setTimeout,clearTimeout,setInterval,clearInterval,
    Image:function(){},Audio:function(){},Blob:function(){},URL:{createObjectURL:()=>'',revokeObjectURL:noop},fetch:async()=>({ok:false}),crypto:{getRandomValues:v=>v},
    CONST:{SAVE_KEY:'test',EXP_BASE:100,RARITY_EXP_MULT:{R:1}}, DB:{SKILLS:[],CHARACTERS:[]}
};
context.globalThis=context; window.window=window; window.document=document;
vm.createContext(context);
vm.runInContext(`${mainSource}\nglobalThis.__App=App; globalThis.__Field=Field;`,context,{filename:'main.js'});
const App=context.__App;
const Field=context.__Field;
App.updateHUD=noop;
App.commitPlayTime=noop;
App.updateSaveMetadata=noop;
App.serializeSaveData=value=>JSON.stringify(value);
App.applyLevelUpGrowth=(char)=>{ char.level=Math.max(1,Number(char.level||1))+1; return []; };
App.data={
    system:{}, settings:{},
    location:{area:'THUNDER_FORT',worldKey:'WORLD',x:4,y:7},
    progress:{storyStep:5,subStep:2,floor:0,flags:{before:true},worldState:{...App.getDefaultWorldState(),lunaMemoryStage:1},storyCharacters:{},storyRewards:{},quests:{q1:{state:'accepted'}}},
    characters:[{uid:'ars',charId:301,name:'アルス',job:'戦士',rarity:'R',level:10,exp:0,hp:100,mp:20,atk:10,def:10,mag:3,spd:5,mdef:4,sp:0,equips:{},traits:[],tree:{},skills:[]}],
    party:['ars',null,null,null], items:{1:3}, inventory:[{uid:'eq1'}], gold:123, gems:4,
    book:{monsters:[1],killCounts:{1:2}}, stats:{maxGold:123}, dungeon:null, battle:{active:false}, mapReturnPoint:{worldKey:'WORLD',x:1,y:2}
};
Field.ready=false; Field.x=4; Field.y=7; Field.dir=2;
App.ensureWorldState(App.data); App.ensureStoryCharacterStates(App.data);

const original=JSON.parse(JSON.stringify({
    location:App.data.location, characters:App.data.characters, party:App.data.party, items:App.data.items,
    inventory:App.data.inventory, gold:App.data.gold, gems:App.data.gems, book:App.data.book, stats:App.data.stats,
    mapReturnPoint:App.data.mapReturnPoint, flags:App.data.progress.flags, worldState:App.data.progress.worldState,
    storyCharacters:App.data.progress.storyCharacters, storyRewards:App.data.progress.storyRewards, quests:App.data.progress.quests
}));

const scene=App.beginSceneContext({
    type:'flashback', area:'LIGHT_PALACE_MEMORY', x:9, y:11, dir:0,
    visualPreset:'sepia', temporaryParty:[{charId:777,initialLevel:20}], changeScene:false
});
assert(scene && App.getActiveSceneContext()?.token===scene.token, 'Scene context did not start.');
assert(App.data.location.area==='LIGHT_PALACE_MEMORY' && App.data.location.x===9, 'Scene context target location was not applied.');
assert(App.data.party[0] && App.data.party[0] !== 'ars', 'Temporary flashback party was not installed.');
assert(App.hasStoryAlly(777)===true && App.getStoryCharacterState(777).temporary===true, 'Temporary cast state was not created.');
assert(fieldScene.style.filter.includes('sepia'), 'Sepia visual preset was not applied.');

// Changes made inside the historical context must not leak back into present-day state.
App.data.items[1]=0; App.data.gold=999999; App.data.characters[0].level=99;
App.data.progress.flags.flashbackOnly=true; App.data.progress.worldState.lunaMemoryStage=9; App.data.progress.quests.q1.state='completed';
const persistedBefore=persisted;
assert(App.save()===true, 'Suppressed save should report handled success.');
assert(persisted===persistedBefore, 'Scene context save suppression wrote temporary state to localStorage.');

assert(App.endSceneContext(scene.token,{changeScene:false,saveAfter:false})===true, 'Scene context did not end.');
assert(App.getActiveSceneContext()===null, 'Scene context stack did not clear.');
assert(JSON.stringify(App.data.location)===JSON.stringify(original.location), 'Present-day location was not restored.');
assert(JSON.stringify(App.data.party)===JSON.stringify(original.party), 'Present-day party was not restored.');
assert(JSON.stringify(App.data.characters)===JSON.stringify(original.characters), 'Present-day characters were not restored.');
assert(JSON.stringify(App.data.items)===JSON.stringify(original.items) && App.data.gold===original.gold, 'Inventory/currency state leaked from flashback.');
assert(JSON.stringify(App.data.progress.flags)===JSON.stringify(original.flags), 'Flashback-only flags leaked to present-day state.');
assert(JSON.stringify(App.data.progress.worldState)===JSON.stringify(original.worldState), 'WorldState leaked from flashback.');
assert(JSON.stringify(App.data.progress.quests)===JSON.stringify(original.quests), 'Quest state leaked from flashback.');
assert(App.hasStoryAlly(777)===false, 'Temporary flashback cast leaked into present-day recruitment history.');
assert(fieldScene.style.filter==='', 'Scene visual filter was not restored.');
assert(Field.dir===2, 'Field facing direction was not restored.');

console.log('PASS: Scene Context snapshots present-day state, installs temporary flashback party/filter, suppresses saves, and fully restores present-day state.');
