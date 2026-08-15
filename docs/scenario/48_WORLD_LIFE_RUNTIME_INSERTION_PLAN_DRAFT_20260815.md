# 48_WORLD_LIFE_RUNTIME_INSERTION_PLAN_DRAFT_20260815

Status: active implementation plan / Phase 18 Batch 1 partially connected
Date: 2026-08-15
Depends on:
- `45_WORLD_LIFE_REVISIT_DIALOGUE_EXPANSION_DRAFT_20260815.md`
- `46_COMPANION_WORLD_REACTION_SKITS_DRAFT_20260815.md`
- `47_NPC_KNOWLEDGE_MISBELIEF_LIE_LEDGER_DRAFT_20260815.md`

## 2026-08-15 Phase 18 Batch 1 status

`56_PHASE18_LUMINA_IGNISIA_NPC_STAGE_BATCH1_20260815.md` を実装sourceとして、リュミナ村のパン焼きの女・山羊を探す少年、イグニシアの炊事番・湯屋の老人をruntimeへ接続した。

リュミナ村は15x13と狭いため、パン焼きの女を継続住民、少年を村外縁の生活NPCとして置き、重要導線・店・長老の周囲を避けた。行商人モルドは今回接続せず、条件付き訪問者候補のまま残す。

## 0. Goal

Prepare the new prose for incremental implementation without editing or replacing current player-facing dialogue.

The first runtime patch after approval should add **new conversation keys and new actor/state hooks only**. Existing keys remain intact unless a separate review-queue decision explicitly approves a revision.

## 1. Existing map capacity snapshot

Static review of current `map.js`:

| Area | Map | Size | Existing actor situation | Initial insertion recommendation |
|---|---|---:|---|---|
| Lumina | `MAP000002` | 15x13 | 4 actors; compact | add at most 1 permanent actor; make peddler conditional/rotating |
| Ignisia | `MAP000006` | 29x21 | 4 actors | room for 1–2 new actors after walkability/Phaser view check |
| Kazaria | `MAP000009` | 29x21 | 5 actors | add 1 permanent actor first; merchant can be conditional |
| Rivaria | `MAP000015` | 39x27 | 7+ story actors and phase actors | use 2 new actors in separate districts; avoid bridge chokepoints |
| Rexnote | `MAP000071` | 17x11 interior | Alan is central; small map | do **not** crowd first pass; prefer examine events / conditional visitor |
| Thunder Fort | `MAP000019` fixed dungeon | multi-floor | actor placement requires fixed-floor audit | add post-clear safe-floor NPCs only after floor-specific path review |
| Crystal Tree | `MAP000073` | 29x21 | Minerva only | ideal for 1 assistant + 1 examine action; keep ritual space visually empty |
| Galvania | `MAP000075` | 55x41 | 7 actors, broad districts | room for 2 new civilians first pass |

## 2. Area-by-area first implementation batch

### 2.1 Lumina

Priority new content:
- communal oven keeper;
- peddler Mord as a conditional visitor, not a permanent fifth/sixth body if the compact map feels crowded.

Proposed new keys:
- `TOWN_START_OVEN_KEEPER_BEFORE_CLEAR`
- `TOWN_START_OVEN_KEEPER_AFTER_CLEAR`
- `TOWN_START_OVEN_KEEPER_LATE_REVISIT`
- `TOWN_START_PEDDLER_MORD`
- `TOWN_START_PEDDLER_MORD_EXPOSED`

State source:
- opening/main-story step for first state;
- post-first-cave progression for after-clear;
- late revisit can initially use a broad `storyStep >= 3` style condition rather than a new global flag.

Do not:
- create a new progression flag simply to remember ordinary first/second talk unless the conversation system truly needs one;
- let Mord give reliable navigation or main objective text.

### 2.2 Ignisia

Priority new content:
- communal cook;
- young repair-order clerk.

Proposed new keys:
- `TOWN_FIRE_COMMUNAL_COOK_UNSTABLE`
- `TOWN_FIRE_COMMUNAL_COOK_RESTORED`
- `TOWN_FIRE_REPAIR_CLERK_POST_CLEAR`
- `TOWN_FIRE_REPAIR_CLERK_REPEAT`

Existing useful gates:
- `firePrismRestored`
- `fireVillageCleared`

Late hold:
- `TOWN_FIRE_ASH_SWEEPER_SHANNY_REVISIT`
- companion reaction `SKIT_IGNISIA_03`

Suggested late conditions after approval:
- `darkCastleCleared`
- Shanny actually present in active party, not merely recruited.

### 2.3 Kazaria

Priority new content:
- rope-mender;
- old dance teacher or senior caretaker, whichever produces the cleaner map silhouette.

Proposed new keys:
- `TOWN_WIND_ROPE_MENDER_CRISIS`
- `TOWN_WIND_ROPE_MENDER_RECOVERY`
- `TOWN_WIND_DANCE_ELDER_CRISIS`
- `TOWN_WIND_DANCE_ELDER_AFTER_CLEAR`
- `TOWN_WIND_TRAVEL_MERCHANT_SAINT_RUMOR`

Existing useful gates:
- `windVillageCleared`
- `arisaHaineMainStoryCleared`
- `waterCityRiotSuppressed`
- `lunaSurvivalRevealed` as the end boundary of the anonymous saint-rumor phase.

The rumor merchant should disappear or change subject after identity/state knowledge advances. Do not leave the distorted anonymous rumor active forever.

### 2.4 Rivaria

Priority new content:
- laundry sisters;
- warehouse clerk.

Second pass:
- ice seller, because a two-person price argument needs either a paired actor presentation or a single conversation key containing both speakers.

Proposed keys:
- `TOWN_WATER_LAUNDRY_OCCUPATION`
- `TOWN_WATER_LAUNDRY_POST_RIOT`
- `TOWN_WATER_WAREHOUSE_CLERK_POST_RIOT`
- `TOWN_WATER_WAREHOUSE_CLERK_REXNOTE_ROUTE`
- `TOWN_WATER_ICE_SELLER_SHORTAGE`
- `TOWN_WATER_ICE_SELLER_RECOVERY`

Existing useful gates:
- occupation/main water-city phase;
- `waterCityRiotSuppressed`
- `rexnoteRouteKnown`
- `alanJoinedAtRexnote` for later Alan skits only.

Do not stack all new actors around the central bridge. Rivaria should feel busy, not mechanically obstructed.

### 2.5 Rexnote

Current map is a small 17x11 interior, so the first pass should prioritize **memory-bearing objects** over extra bodies.

First pass recommendation:
- convert former-servant concept into a conditional visitor only after the basement request or basement clear;
- use an examine action for mundane household records;
- hold gardener Orba until an exterior/grounds presentation is confirmed visually appropriate.

Proposed keys:
- `REXNOTE_FORMER_SERVANT_VISIT`
- `REXNOTE_FORMER_SERVANT_ALAN_REACTION`
- `REXNOTE_HOUSEHOLD_LEDGER_EXAMINE`
- `REXNOTE_BOAT_MECHANIC` only if a believable dock/boat context exists in the current map route.

Existing useful gates:
- `rexnoteBasementRequested`
- `rexnoteRegulusDefeated`
- `rexnoteGrimoireObtained`
- `alanJoinedAtRexnote`

Hard rule:
- no new household NPC may know the political conspiracy, Alan's secret assignment, or hidden-record answer merely because they once worked in the estate.

### 2.6 Thunder Fort

Because this is a fixed dungeon, do not insert ordinary NPCs until the floor definitions and post-clear traversal have been checked for safe, non-blocking placement.

First pass content preference:
- infirmary helper;
- supply-soldier letter as an examine event.

Hold mechanic Vasco until a believable maintenance corner is identified.

Proposed keys:
- `THUNDER_FORT_INFIRMARY_AIDE_CRISIS`
- `THUNDER_FORT_INFIRMARY_AIDE_AFTER`
- `THUNDER_FORT_SUPPLY_LETTER_AFTER`
- `THUNDER_FORT_VASCO_MAINTENANCE`
- `THUNDER_FORT_VASCO_EXPOSED`

Existing useful gate:
- `thunderFortCleared`

Potential one-time skits should use local skit flags only if repeat playback is undesirable; ordinary NPC conversation itself can remain repeatable.

### 2.7 Crystal Tree

This map currently has Minerva as the only actor. Preserve the ritual clearing as visually special.

First pass:
- one assistant near the lower/side camp area;
- one environmental examine object representing water/medicine preparation.

Proposed keys:
- `CRYSTAL_TREE_ASSISTANT_NINA`
- `CRYSTAL_TREE_ASSISTANT_NINA_MINERVA`
- `CRYSTAL_TREE_REST_SUPPLIES_AFTER_DEFENSE`
- `CRYSTAL_TREE_REST_SUPPLIES_AFTER_RITUAL`

Existing useful gates:
- `crystalTreeMinervaMet`
- `crystalTreeDefenseCleared`
- `crystalTreeSixElementRitualSeen`

Hard boundary:
- none of these new keys should mention the final mechanism/name of the Cycle Crystal while `44_CYCLE_CRYSTAL_RITUAL_REALIGNMENT_PROPOSAL_20260815.md` remains unapproved.

### 2.8 Galvania

Large map; first pass can safely focus on civilians rather than more military exposition.

Priority:
- ration baker and hidden child;
- shoe-repair old woman.

Second pass:
- resident who refuses conversation after the castle event.

Proposed keys:
- `GALVANIA_RATION_BAKER_FIRST`
- `GALVANIA_RATION_BAKER_EXPOSED`
- `GALVANIA_SHOE_REPAIRER_FIRST`
- `GALVANIA_SHOE_REPAIRER_LEILA`
- `GALVANIA_SHOE_REPAIRER_POST_CASTLE`
- `GALVANIA_RESIDENT_REFUSES_POST_CASTLE`
- `GALVANIA_RESIDENT_REFUSES_REPEAT`

Useful gates:
- `crystalTreeCleared` for entry phase;
- `darkCastleCleared` for post-castle state;
- party-presence check for Leila/Luna/Shanny-specific lines.

Do not convert distrust into a hidden affinity mechanic. Some people should simply remain distant.

## 3. Companion skit storage recommendation

Do not hard-code long party-condition branches inside map definitions.

Preferred structure after approval:

- conversation text remains in `story.js`;
- map actors/actions invoke a small story event key;
- event logic checks relevant party character presence;
- a local `...SkitSeen` flag is added only for skits that would become annoying if repeated;
- ordinary environmental/banter lines may remain repeatable.

Potential one-time flags should use explicit names such as:

- `skitIgnisiaRepairOrderSeen`
- `skitKazariaArisaMelodySeen`
- `skitRexnoteYoungMasterSeen`
- `skitGalvaniaUnknownTrustSeen`

Do **not** create one generic counter whose numeric meaning changes by area.

## 4. Validation for each runtime batch

After approval and implementation, run at minimum:

1. `node --check story.js`
2. `node --check map.js`
3. story event/conversation reference validation used by the repository
4. map safety/walkability validation for any actor placement change
5. a flag audit proving every party-specific skit can only fire after that character is recruitable
6. save-load check from a save before the new actor's progression phase
7. Phaser production renderer check for crowding and interaction readability
8. legacy Canvas fallback sanity check if actor visuals or map layers were changed

## 5. Suggested implementation order

### Batch A — lowest canon risk
- Lumina oven keeper
- Ignisia communal cook + repair clerk
- Kazaria rope-mender

### Batch B — mid-story city life
- Rivaria laundry sisters + warehouse clerk
- Kazaria rumor merchant

### Batch C — memory / institution
- Rexnote non-secret household memory
- Thunder infirmary + letter

### Batch D — late-world social texture
- Crystal Tree assistant/environment
- Galvania baker + shoe repairer

### Separate approval batch
- Shanny's reception in Ignisia
- Alan family-memory skits with strong emotional implications
- any Luna/Galvania line that changes how her responsibility is framed

This order keeps the first patch focused on undeniably additive lived-in material while leaving relationship-sensitive scenes reviewable on their own.
