const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8e-infra] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const logic = read('story_logic.js');
const main = read('main.js');
const draft = read('docs/scenario/41_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_DRAFT_20260810.md');
const audit = read('docs/project-status/PHASE8C_PHASE8D_AUDIT_20260810.md');
const queue = read('docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md');
const handoff = read('PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');
const news = read('news.js');
const handoffProjectStatus = read('docs/project-status/PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');

assert(logic.includes("action.type === 'IF_QUEST_STAGE'"), 'story logic must support IF_QUEST_STAGE.');
assert(logic.includes("action.type === 'QUEST_STAGE'"), 'story logic must support QUEST_STAGE.');
assert(logic.includes("action.type === 'QUEST_FAIL'"), 'story logic must support QUEST_FAIL.');
assert(logic.includes("yesLabel: action.yesLabel") && logic.includes("noLabel: action.noLabel"), 'CHOICE must forward custom labels.');
assert(logic.includes("yesButton.textContent = String(options.yesLabel || 'はい')"), 'custom yes label must preserve はい as default.');
assert(logic.includes("noButton.textContent = String(options.noLabel || 'いいえ')"), 'custom no label must preserve いいえ as default.');
assert(logic.includes("document.createElement('button')"), 'choice labels must be set through DOM textContent, not HTML interpolation.');
assert(!logic.includes('menu.innerHTML = `<button style="${btnStyle}" class="no-skip">はい</button>'), 'legacy fixed-label choice HTML must be removed.');

assert(main.includes('getQuestStage: (questId) =>'), 'main quest-stage getter is missing.');
assert(main.includes('setQuestStage: (questId, stage, options = {}) =>'), 'main quest-stage setter is missing.');
assert(main.includes('failQuest: (questId, options = {}) =>'), 'main quest failure helper is missing.');
assert(main.includes('compareConditionValue: (actual, operator, expected) =>'), 'quest-stage comparison helper is missing.');

assert(draft.includes('進む') && draft.includes('引き返す'), 'Phase8E draft must preserve explicit irreversible warning choices.');
assert(draft.includes('王への上申書') && draft.includes('アレル＝レクスノート'), 'Phase8E draft must include the appeal-document route.');
assert(draft.includes('カゲトラを斬ったのは、俺だ'), 'Phase8E draft must contain Zelied confession.');
assert(draft.includes('Status: **draft / user approval required'), 'Phase8E player-facing draft must remain approval-gated.');

assert(audit.includes('12 / 69 FAIL') && audit.includes('one dialogue-review hold'), 'Phase8C/8D audit report must record the audited regression state and dialogue hold.');
assert(queue.includes('DR-20260810-alan-altar-irreversible-branch-phase8e') && queue.includes('Status: awaiting_user_approval'), 'Alan irreversible branch must remain in approval queue.');
assert(queue.includes('DR-20260810-galvania-empire-arrival-exposition-phase8c-review'), 'Phase8C over-explanatory Empire line must be queued rather than silently changed.');
assert(handoff.includes('Phase8E safe infrastructure implemented') && handoff.includes('user approval待ち5点'), 'latest handoff must record Phase8E prep and approval gate.');
assert(handoffProjectStatus === handoff, 'root and project-status latest handoff copies must stay synchronized.');
assert(news.includes('物語イベントの選択肢表示と連続クエストの段階進行処理を拡張しました'), 'NEWS must record the delivered story/quest infrastructure update.');

if (!process.exitCode) console.log('[phase8e-infra] PASS: quest-stage actions, explicit choice labels, audit records, and approval gates are ready.');
