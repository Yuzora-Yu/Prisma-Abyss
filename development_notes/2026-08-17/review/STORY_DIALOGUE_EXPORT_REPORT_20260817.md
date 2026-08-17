# Story / Dialogue export report — 2026-08-17

- `story.js` scripts: 450
- Dialogue rows: 1777
- Event-referenced scripts: 408
- Unreferenced/direct-call-check scripts: 42
- Log/sign/settings rows: 509
- Quest master entries: 16

## Outputs

- `STORY_DIALOGUE_TIMELINE_20260817.csv`
- `MAP_LOG_SIGN_SETTINGS_20260817.csv`
- `story_dialogue_修正提案編集用_20260817.xlsx`

The dialogue CSV keeps current runtime text verbatim and adds blank `修正案` / `編集メモ` columns for the upcoming story-writing pass. Main/event dialogue, quests, town residents, map events, recollections, and Abyss/additional dialogue are ordered by story progression / region / availability and then by current source order. Scripts with no current `CONV` event reference are retained at the end as `未参照/直接呼出要確認` rather than silently discarded.

Town/resident dialogue is associated with the current map actor state conditions (`storyStep`, flags, map availability, event IDs) so that newly appended resident scripts are placed with the period in which the actor can actually say them, instead of being left at the physical end of `story.js`.

The log/settings CSV includes fixed-map and fixed-dungeon `log`, `lockedLog`, `inspectLog`, interaction messages/locked text/confirmation text, story `LOG` actions, and direct `App.log` string/template calls. Structured map rows include map/floor/coordinates/conditions when available.

The XLSX is an editing convenience based on the previously supplied `story_dialogue_修正提案編集用.xlsx`, rebuilt from current data rather than carrying forward obsolete rows. It contains `概要`, `時系列会話`, and `ログ・立札等` sheets with filters, frozen headers/keys, and blank proposal/memo columns.
