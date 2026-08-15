const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const assert = (condition, message) => {
    if (!condition) throw new Error(message);
};
const pass = message => console.log(`PASS ${message}`);

// story.js can be evaluated as data-only with the runtime master omitted; it falls back to static spirit definitions.
{
    const context = { console, globalThis: null };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(`${read('story.js')}\nglobalThis.__STORY = STORY_MANAGER_DATA;`, context, { filename: 'story.js' });
    const story = context.__STORY;
    assert(story?.events?.abyss_legacion_priest, 'abyss_legacion_priest missing');
    const priestActions = story.events.abyss_legacion_priest.actions;
    assert(priestActions[0]?.value === 'ABYSS_LEGACION_PRIEST', 'existing priest conversation no longer first');
    assert(priestActions.some(action => action.type === 'IF_FLAG' && action.key === 'abyssSpiritPilgrimageStarted' && action.state === false), 'pilgrimage proposal gate missing');

    const proposal = story.events.abyss_spirit_pilgrimage_proposal_phase17?.actions || [];
    assert(proposal.some(action => action.type === 'IF_ALLY' && action.charId === 402), 'Zenon optional dialogue branch missing');
    assert(proposal.some(action => action.type === 'IF_ALLY' && action.charId === 303), 'Leescia optional dialogue branch missing');
    assert(proposal.at(-1)?.type === 'FLAG' && proposal.at(-1)?.key === 'abyssSpiritPilgrimageStarted', 'pilgrimage start flag missing');

    const partyScripts = {
        fire: 'ABYSS_SPIRIT_TRIAL_FIRE_PARTY_INTRO_PHASE17',
        water: 'ABYSS_SPIRIT_TRIAL_WATER_PARTY_INTRO_PHASE17',
        wind: 'ABYSS_SPIRIT_TRIAL_WIND_PARTY_INTRO_PHASE17',
        thunder: 'ABYSS_SPIRIT_TRIAL_THUNDER_PARTY_INTRO_PHASE17',
        light: 'ABYSS_SPIRIT_TRIAL_LIGHT_PARTY_INTRO_PHASE17',
        dark: 'ABYSS_SPIRIT_TRIAL_DARK_PARTY_INTRO_PHASE17'
    };
    Object.values(partyScripts).forEach(id => assert(Array.isArray(story.scripts[id]) && story.scripts[id].length > 0, `${id} missing`));
    Object.values(story.abyssSpiritTrials || {}).forEach(def => {
        const event = story.events[def.introEventId];
        assert(event?.actions?.some(action => action.type === 'IF_ALLY'), `${def.introEventId}: party dialogue condition missing`);
        assert(event?.actions?.some(action => action.type === 'CHOICE' && /試練を受けますか/.test(action.text || '')), `${def.introEventId}: pre-battle confirmation missing`);
    });
    pass('Legacion proposal, optional ally branches, six spirit conversations, and pre-battle confirmations');
}

// IF_ALLY runtime evaluation: recruited / available / party, any/all, and inverted state.
{
    const recruited = new Set([303, 402]);
    const available = new Set([303]);
    const party = new Set([402]);
    const context = {
        console,
        App: {
            hasStoryAlly: id => recruited.has(Number(id)),
            isStoryAllyAvailable: id => available.has(Number(id)),
            isStoryAllyInParty: id => party.has(Number(id))
        },
        globalThis: null
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(`${read('story_logic.js')}\nglobalThis.__SM = StoryManager;`, context, { filename: 'story_logic.js' });
    const sm = context.__SM;
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charId:402, mode:'recruited' }) === true, 'recruited condition failed');
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charId:402, mode:'available' }) === false, 'available condition failed');
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charId:402, mode:'party' }) === true, 'party condition failed');
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charIds:[303,402], mode:'recruited', match:'all' }) === true, 'all condition failed');
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charIds:[999,402], mode:'recruited', match:'any' }) === true, 'any condition failed');
    assert(sm.evaluateAllyCondition({ type:'IF_ALLY', charId:999, mode:'recruited', state:false }) === true, 'inverted state failed');
    pass('IF_ALLY reusable condition semantics');
}

// Map access must be gated by the post-priest pilgrimage proposal rather than the priest hint alone.
{
    const map = read('map.js');
    const started = (map.match(/requiredFlags: \["abyssSpiritPilgrimageStarted",/g) || []).length;
    const legacy = (map.match(/requiredFlags: \["abyssSpiritPrismKnown",/g) || []).length;
    assert(started === 6, `expected six pilgrimage-gated spirit maps, got ${started}`);
    assert(legacy === 0, `legacy prismKnown gating remains (${legacy})`);
    pass('Six spirit map gates use abyssSpiritPilgrimageStarted');
}

// Job table and character master.
{
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(read('job_data.js'), context, { filename: 'job_data.js' });
    const jobs = context.window.JOB_SKILLS_DATA;
    const renamed = ['斥候','剣闘士','エンターテイナー','星詠師','聖拳士','聖騎士'];
    const removed = ['盗賊','バトルマスター','スーパースター','天地雷鳴士','ゴッドハンド','パラディン'];
    renamed.forEach(name => assert(jobs[name], `renamed job missing: ${name}`));
    removed.forEach(name => assert(!jobs[name], `legacy job key remains: ${name}`));
    ['狩人','魔弓使い','光魔剣士'].forEach(name => assert(jobs[name], `new job missing: ${name}`));

    const skillsText = read('skills.js');
    const skillIds = new Set([...skillsText.matchAll(/"id"\s*:\s*(\d+)/g)].map(m => Number(m[1])));
    ['狩人','魔弓使い','光魔剣士'].forEach(name => {
        Object.values(jobs[name]).forEach(id => assert(skillIds.has(Number(id)), `${name}: undefined skill id ${id}`));
    });
    assert(Object.values(jobs['狩人']).includes(116) && Object.values(jobs['狩人']).some(id => [300,301,304,309,310,311,313,315].includes(id)), 'Hunter lacks bow/breath provisional skills');
    assert(Object.values(jobs['魔弓使い']).includes(116) && Object.values(jobs['魔弓使い']).some(id => [400,401,404,407,412,413,414,418].includes(id)), 'Magic Archer lacks bow/healing provisional skills');
    assert(Object.values(jobs['光魔剣士']).some(id => [126,146,160].includes(id)) && Object.values(jobs['光魔剣士']).some(id => [218,227,228,232,246].includes(id)), 'Light Magic Swordsman lacks strong mid/late light skills');

    const charContext = { window: {} };
    vm.createContext(charContext);
    vm.runInContext(read('characters.js'), charContext, { filename: 'characters.js' });
    const charJobs = (charContext.window.CHARACTERS_DATA || []).map(c => c.job);
    removed.forEach(name => assert(!charJobs.includes(name), `character master retains legacy job: ${name}`));
    pass('Renamed jobs, three provisional jobs, skill IDs, and character job labels');
}

// Save compatibility hooks must exist for old job names and already-progressed spirit trials.
{
    const main = read('main.js');
    assert(main.includes("'天地雷鳴師':'星詠師'"), 'job typo alias 天地雷鳴師 missing');
    assert(main.includes("'天地雷鳴士':'星詠師'"), 'job legacy alias 天地雷鳴士 missing');
    assert(main.includes('migrateJobNamesV1'), 'job-name migration missing');
    assert(main.includes('migrateAbyssSpiritPilgrimageV1'), 'pilgrimage migration missing');
    assert(main.includes('touchedTrial || ownsBlessing || flags.abyssAllSpiritTrialsCleared === true || ownsOctaprism'), 'pilgrimage advanced-save detection missing');
    pass('Save compatibility hooks for job rename and pilgrimage progression');
}

// Canon correction: final battle is five wedges, Jasper is already eliminated.
{
    const canon = read('canon/PRISMA_SCENARIO_CANON_MASTER_v8.md');
    const roadmap = read('canon/PRISMA_DEVELOPMENT_ROADMAP_v2.md');
    const enc = read('canon/PRISMA_CHARACTER_BOSS_ENCYCLOPEDIA_v5.md');
    assert(canon.includes('深淵王は五楔を混沌の力で強制的に一体化し、**ヴェグナシス**を生み出す。'), 'scenario canon five-wedge statement missing');
    assert(canon.includes('ジャスパーは災禍の根ジャゴレアでアルスたちに敗れた段階で深淵王から見限られ、消滅済み'), 'scenario canon Jasper finality missing');
    assert(roadmap.includes('ヴェグナシス5柱'), 'roadmap five-wedge final missing');
    assert(enc.includes('|種別|終焉の祭壇・五楔融合体|'), 'encyclopedia five-wedge entry missing');
    assert(!canon.includes('深淵王は六楔を混沌の力で強制的に一体化し'), 'obsolete six-wedge canon remains');
    pass('Canon and roadmap corrected to five-wedge Vegnasis / no final Jasper');
}

console.log('ALL TARGETED CHECKS PASSED');
