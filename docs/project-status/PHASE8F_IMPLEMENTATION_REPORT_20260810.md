# Phase8F Implementation Report — Jasper / Alan Support

**Date:** 2026-08-10

## Summary

災禍の根ジャゴレアのジャスパー戦を再構成し、統合の祭壇でのアラン生死を戦闘難度・会話・援護・再加入へ接続した。

## Runtime

- `story.js`: Jasper trap/confession, Alan saved branch, post-battle join/wait branch.
- `story_logic.js`: generic BOSS payload forwarding for `externalTurnSupports` and `openingPartyStatDebuff`.
- `battle.js`: generic external NPC turn support and opening party debuff engine.
- `map.js`: Alan waiting actor in LEGACION.
- `news.js`: same-day changelog update.

## Battle differences

### Alan dead
- ambush
- chaos bind applies 0.5 multiplier to ATK/DEF/MDEF/SPD/MAG/HIT/EVA/CRI for the battle.

### Alan saved
- chaos bind broken before battle
- Alan is outside party and acts once each turn
- source stats: protagonist `charId:301` final calculated stats
- cycle: Asteria -> Reimyaku-dachi -> Senjin no Ritsudou -> Luxion Nona

## Rejoin

After Jasper victory, saved Alan asks again to fight with the party.

- accept: join immediately +1,000,000 Story EXP once-only
- decline: waits in LEGACION; can be recruited later for the same once-only reward

## Save / reward safety

- reward key `alan_jagorea_join_1000k` prevents duplicate +1,000,000 EXP.
- waiting actor disappears once `alanRejoinedAfterJasper` is set.
- death route remains irreversible because it never has `alanSavedAtIntegrationAltar`.

## Deferred: Light Magic Swordsman

The existing canon concept of Alan changing from 魔法剣士 to 光魔剣士 after rescue is not discarded. Phase8F does not invent the new job definition because its growth modifiers and learned-skill table are not yet finalized. Runtime therefore rejoins the existing Alan character as-is; job conversion remains a later explicit design task.

## Validation

`tools/validation/validate-phase8f-jasper-alan-support.js` added and targeted suite PASS. Final run-all: **12 / 72 FAIL**. The failures are the known 10 asset-excluded validators plus 2 stale legacy validators (`PROLOGUE_HILL`, removed `getStoryMonsterVariant`). Phase8F adds no new failure.
