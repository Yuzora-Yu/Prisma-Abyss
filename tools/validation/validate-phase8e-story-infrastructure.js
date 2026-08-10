const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = msg => { console.error(`[phase8e-infra] FAIL: ${msg}`); process.exitCode = 1; };
const assert = (cond, msg) => { if (!cond) fail(msg); };

const logic = read('story_logic.js');
const main = read('main.js');
const approved = read('docs/scenario/42_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_APPROVED_20260810.md');
const queue = read('docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md');
const handoff = read('PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');
const news = read('news.js');
const handoffProjectStatus = read('docs/project-status/PRISMA_WORK_HANDOFF_LATEST_2026-08-10.md');
const inventory = read('docs/scenario/SYSTEM_UI_TEXT_REVIEW_INVENTORY_20260810.md');

assert(logic.includes("action.type === 'IF_QUEST_STAGE'"), 'story logic must support IF_QUEST_STAGE.');
assert(logic.includes("action.type === 'QUEST_STAGE'"), 'story logic must support QUEST_STAGE.');
assert(logic.includes("action.type === 'QUEST_FAIL'"), 'story logic must support QUEST_FAIL.');
assert(logic.includes('yesLabel: action.yesLabel') && logic.includes('noLabel: action.noLabel'), 'CHOICE must forward custom labels.');
assert(logic.includes("yesButton.textContent = String(options.yesLabel || 'はい')"), 'custom yes label must preserve はい as default.');
assert(logic.includes("noButton.textContent = String(options.noLabel || 'いいえ')"), 'custom no label must preserve いいえ as default.');
assert(logic.includes("document.createElement('button')"), 'choice labels must be set through DOM textContent, not HTML interpolation.');

assert(main.includes('getQuestStage: (questId) =>'), 'main quest-stage getter is missing.');
assert(main.includes('setQuestStage: (questId, stage, options = {}) =>'), 'main quest-stage setter is missing.');
assert(main.includes('failQuest: (questId, options = {}) =>'), 'main quest failure helper is missing.');
assert(main.includes('compareConditionValue: (actual, operator, expected) =>'), 'quest-stage comparison helper is missing.');

assert(approved.includes('Status: **approved / implemented**'), 'approved Phase8E source must be marked approved/implemented.');
assert(approved.includes('アレル＝レクスノート侯爵が、ジャスパーのプリズム統合の儀を止めるため'), 'approved source must preserve the original Arel petition meaning.');
assert(approved.includes('現代の国王が王印を追記する、新しく上申書を作る') === false, 'approved source must not reintroduce the rejected modern-king petition interpretation.');
assert(approved.includes('父さんは、あんたを一番信じてた') && approved.includes('全部見たあとで……もう一度、あんたと話したい'), 'approved source must preserve Hayate/Zelied trust and deferred judgment.');
assert(approved.includes('「共に生きろ / ここで終わらせる」'), 'approved source must keep player-controlled life/death even with the petition.');
assert(approved.includes('ガルヴァニア渓谷の門を破壊した者がアランである事実は、統合の祭壇では回収しない'), 'approved source must keep the gorge destroyer hidden.');

assert(queue.includes('DR-20260810-alan-altar-irreversible-branch-phase8e') && queue.includes('Status: approved_and_implemented'), 'Alan irreversible branch queue status must reflect user approval and implementation.');
assert(queue.includes('POLICY-20260810-system-ui-global-review'), 'global system/UI text review policy must be recorded.');
assert(queue.includes('DR-20260810-galvania-empire-arrival-exposition-phase8c-review'), 'Phase8C over-explanatory Empire line must remain queued rather than silently changed.');
assert(inventory.includes('現行') && inventory.includes('修正案') && inventory.includes('侵略のための軍都というより'), 'system/UI inventory must include current/proposed columns and the known Phase8C review item.');
assert(handoff.includes('Phase8E') && handoff.includes('未提出原本') && handoff.includes('42_ALAN_AREL_KAGETORA_APPEAL_AND_ALTAR_PHASE8E_APPROVED_20260810.md'), 'latest handoff must retain Phase8E implementation and corrected petition canon even after later phases.');
assert(handoffProjectStatus === handoff, 'root and project-status latest handoff copies must stay synchronized.');
assert(news.includes('原本『王への上申書』の発見') && news.includes('光の楔アラン戦'), 'NEWS must record the delivered Phase8E content.');

if (!process.exitCode) console.log('[phase8e-infra] PASS: quest-stage actions, explicit choice labels, approved canon, and global system/UI review policy are synchronized.');
