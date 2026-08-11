# Prologue combat / post-battle visual / recovery hotfix — 2026-08-11

## Scope

This patch deliberately implements only the first priority group from the 2026-08-11 directives:

1. Opening event battles must continue until normal victory/loss instead of ending after one turn; the first frenzy monster keeps HP 10 and grants EXP 100 plus exactly one guaranteed Rank10-equivalent random +3 equipment reward.
2. A post-battle boss sprite must not be synthesized when that boss was not actually rendered on the map before battle. A boss that really was rendered may remain for post-battle dialogue; an explicit `postBattleBossSprite` authoring override remains available for intentional staging.
3. Every prologue convergence route that transfers to Rees's mountain hut must fully restore HP/MP first.

Items ④ onward are intentionally not implemented in this patch, in accordance with the instruction not to batch all directives together.

## Root causes

### Event battle ends after one turn

`getEventBattleRules()` already normalized omitted optional numeric rules to `null`, but downstream checks converted those normalized values again with `Number(...)`. In JavaScript, `Number(null) === 0`; the turn threshold then clamped that to at least 1, so an event battle with no authored `endAfterTurns` behaved as a one-turn battle.

The fix is at the shared event-battle rule consumer: normalized `number | null` values are tested directly with `Number.isFinite(...)` and are never reconverted.

### Boss sprite appears after a battle that had no map boss sprite

The post-battle visual capture treated `isBossBattle` as sufficient provenance and could fall back to the player's current `Field.x/y`. Therefore a story-only BOSS action could create a new boss sprite after victory even when no boss sprite existed before the battle.

The runtime now records whether the battle originated from a rendered fixed-map boss. Automatic post-battle retention requires that provenance. Explicit `postBattleBossSprite` authoring is still allowed to create an intentional visual. Legacy saves without the new provenance marker are accepted only when the stored position is an actual boss position on the current fixed map.

### HP/MP remain at zero after the five-year transition

The four prologue convergence branches transferred directly to `REES_MOUNTAIN_HUT` without a guaranteed recovery step. Each branch now performs a shared `HEAL` action immediately before transfer. `HEAL` now supports `silent:true` so this transition recovery does not emit an inappropriate sound/log message.

## Reward implementation

The opening frenzy monster (`802000`) remains HP 10 and now has EXP 100.

Its story BOSS actions keep `noDrops:true` to suppress ordinary random drops and additionally author a guaranteed equipment reward:

- generation rank: 10
- enhancement: +3
- count: 1
- base/equipment type: normal shared random equipment generation (`App.createEquipByFloor('drop', 10, 3, { balancedDropBase:true })`)

A shared event-battle reward helper grants this authored reward independently from normal random drops. This avoids turning the monster into a boss-reward case and avoids unrelated guaranteed boss drops.

## Save / compatibility notes

- No save schema reset or destructive migration is introduced.
- New battle provenance fields are additive.
- Older pending boss-visual saves without provenance use a conservative fixed-map boss-position fallback.
- Existing explicit `postBattleBossSprite` staging remains supported.
- Existing non-silent `HEAL` behavior is unchanged.

## Validation

Patch-specific and nearby maintained validators pass:

- `validate-event-battle-rules.js`
  - omitted numeric event rules stay disabled even at 999 completed turns
  - ordinary event battles resolve only after death when no threshold is authored
  - Rank10/+3 guaranteed event equipment uses the shared generator
- `validate-prologue-quality-audit-20260810.js`
  - opening/retry/entrance story battles have no turn/HP shortcut
  - `802000` remains HP10, EXP100
  - initial and retry battles author exactly one Rank10/+3 reward
  - all four Rees-hut convergence routes silently heal before transfer
- `validate-post-battle-boss-visual-source-20260811.js`
  - non-rendered story bosses do not create post-battle sprites
  - explicit staging still works
  - genuinely rendered fixed-map bosses remain eligible
  - conservative legacy-save restoration works only at a real fixed boss position
- `validate-playable-prologue-phase2b.js`: PASS
- `validate-playable-prologue-phase2c.js`: PASS
- `validate-news-data.js`: PASS

Full `run-all` result is 19 FAIL / 73 validators. The uploaded working ZIP intentionally omits `assets`, accounting for 10 failures. The remaining 9 failing validators were rerun against the local baseline snapshot (`bc83ee1`) and all 9 already failed before this patch. Therefore this patch introduces zero new validator failures.

See:

- `development_notes/2026-08-11/validation/TARGETED_VALIDATION_20260811.log`
- `development_notes/2026-08-11/validation/RUN_ALL_20260811.log`
- `development_notes/2026-08-11/validation/VALIDATOR_FAILURE_CLASSIFICATION_20260811.log`
- `development_notes/2026-08-11/validation/BASELINE_FAILURE_COMPARISON_20260811.log`

## Deferred confirmed directives

Not implemented here; retained for the next priority patches:

- temporary healing spring in the north village until the Lycion shrine assets are ready
- rare encounter base rate 3%
- rare encounter AUTO-off
- Luna permanent LB carry-over from prologue self-earned LB
- dual-wield skill double activation even without a second weapon equipped
- north-village and random-dungeon Hunter systems, followed by full north-village environmental completion when assets are ready
