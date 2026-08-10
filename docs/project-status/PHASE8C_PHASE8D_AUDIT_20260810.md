# Phase8C / Phase8D Audit — 2026-08-10

Status: audited / accepted as Phase8E base with one dialogue-review hold
Date: 2026-08-10
Base checked: Phase8D work tree

## 1. Purpose

Phase8C / Phase8D artifacts were created before the final Phase8B package timestamp, so this audit verifies that they did not lose the final Phase8B changes and that their own runtime changes are internally coherent.

## 2. Lineage / regression result

Dedicated validators all pass on the Phase8D tree:

- `validate-crystal-tree-six-element-phase7d.js`
- `validate-galvania-geography-phase8a.js`
- `validate-dark-castle-phase8b.js`
- `validate-dark-castle-phase8c.js`
- `validate-nadir-cave-phase8d.js`
- `validate-system-input-update-20260810.js`
- `validate-news-data.js`
- `validate-map-actors.js`

`run-all.js` result at audit time: **12 / 69 FAIL**.

The 12 failures are the same known set as prior handoffs:

- 10 validators requiring the intentionally omitted `assets/` tree.
- stale validator expecting old `PROLOGUE_HILL` data.
- stale validator expecting the removed story-monster-variant API.

No new Phase8C / Phase8D regression was found.

## 3. Phase8C accepted runtime content

Phase8C is suitable to keep as the Phase8E base.

Accepted points:

- Galvania Empire / Dark Castle environmental evidence precedes Zenon's explanation.
- all three Dark Castle officers retain the Phase8B male-character rewrite and motives.
- intact Dark Prism is visible immediately after the Zenon battle.
- Luna's Dark Prism memory reconnection is voluntary, physically painful, and does not reduce her to exposition.
- Alus does not force memory recovery and supports Luna's decision.
- Eclipse / dark-attribute research history and four-researcher synthesis are present without making Zenon omniscient.
- second integration begins after the truth conversation.
- Shanny joins by her own choice.
- reward / story progression commits are ordered before `darkCastleCleared` / Step9 finalization.
- old saves can revisit the truth scene without duplicating Luna's reward or regressing state.

## 4. Phase8C dialogue hold

One already-implemented system line is too interpretive for the current player-information-boundary policy:

> 包帯を巻いた兵が壁にもたれ、そのすぐ横を親子が避難区画へ急いでいく。\n侵略のための軍都というより、長く何かに耐えてきた街に見えた。

The first sentence is strong environmental evidence. The second sentence tells the player how to interpret it.

This line is **not silently changed** in this audit. It is sent to `docs/scenario/07_DIALOGUE_REVIEW_QUEUE.md` for user decision.

Recommendation: keep the first sentence and remove or substantially soften the interpretive second sentence.

## 5. Phase8D accepted runtime content

Phase8D is suitable to keep as the Phase8E base.

Accepted points:

- old six-floor Galvania cave layout is reused as `奈落への洞窟`.
- post-Dark-Castle route reads as a longstanding anti-Abyss defense line rather than an invasion route.
- evidence is environmental: inward-facing defenses, repeated repair, old seals, supply marks, breached final barrier.
- Integration Altar keeps its existing layout.
- fresh multiple tracks / overlay ritual are shown without identifying Alan, Veld or Jasper and without explicit light-attribute labeling.

## 6. Intentional Phase8D temporary state

The central Integration Altar crack still calls the old `abyss_unsealed` route.

This is intentional only until Phase8E because:

- the Light Wedge Alan battle is canonically mandatory before descending;
- Alan death is irreversible when the Royal Appeal Document is absent;
- the rescue-condition long quest is not yet in runtime;
- implementing only the boss would create an unfair forced-death route.

Phase8E must replace this temporary route atomically with:

1. Arel / Kagetora / Zelied / Hayate long quest,
2. key item `王への上申書`,
3. explicit irreversible warning when the item is absent,
4. Light Wedge Alan battle,
5. death / survival outcome handling,
6. only then the descent to the Abyss.

## 7. Phase8E base decision

Use the audited Phase8D tree as the Phase8E preparation base.

Do not implement new Phase8E player-facing dialogue until the dedicated Phase8E draft is user-approved.

Safe infrastructure that does not choose scenario wording may be added beforehand, including:

- quest-stage story actions / conditions,
- explicit custom labels for binary choices (`進む` / `引き返す`),
- validators for irreversible-branch infrastructure.
