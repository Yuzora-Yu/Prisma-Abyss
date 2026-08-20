# CSS / menu UI cleanup Phase 9 — item target, Sky Prism, save dialogs

Date: 2026-08-19  
Baseline: Phase 8 applied environment  
Scope: menu/UI presentation only; battle, conversation, field logic and presentation were not redesigned.

## Purpose

Phase 8 established a brown menu surface and integrated the item category tabs with the item-list page. Phase 9 removes the remaining isolated blue/gray presentation from three player-facing flows that were still visually disconnected from that foundation:

1. Item-use target selection
2. Sky Prism destination selection
3. Save / Load / Data Export / Data Import dialogs

The implementation continues the cleanup rule used in the previous phases: semantic components own their visual state directly, rather than adding another `!important` override on top of the legacy global `.btn` skin.

## Changes

### 1. Item-use target selection

- Added `item-target-summary` and `item-target-row` ownership classes in `menus_items.js`.
- Removed the legacy `menu-surface-card` class from the use-item summary so the target-picker component is no longer forced through the broad menu-card `!important` rule.
- The target list and rows now sit on the menu page brown (`#130905`).
- Character portrait thumbnails in this flow now use a dark brown plate (`#21130a`) and bronze border instead of the old global gray `char-thumb` plate.
- The compact continuous target-list layout is preserved; this is a palette/ownership correction, not a layout redesign.

### 2. Sky Prism destination dialog

- Replaced inline/background-option state styling with semantic button classes:
  - `sky-prism-button--destination`
  - `sky-prism-button--nav`
  - `sky-prism-button--secondary`
  - `sky-prism-button--confirm`
  - disabled / unavailable state via class and `disabled`
- Removed the old inline `#333` unavailable destination background and `#444` cancel background from this flow.
- Changed the dialog shell, title/body region, footer, destination buttons, navigation buttons, confirmation panel and disabled state to the shared brown/bronze menu direction.
- Map rendering colors and destination marker behavior were not changed.

### 3. Save / Load / Data Export / Data Import dialogs

- Added semantic `save-ui-button` and `save-ui-card` classes in the save UI generators.
- Reworked `modern-polish-config-save.css` around a local save-dialog brown palette so the same visual ownership works both in-game and from the title screen.
- Converted the following from gray/blue-gray to brown/bronze:
  - dialog shell
  - dialog header
  - top/bottom back buttons
  - save slot cards
  - auto-save card emphasis
  - empty slot state
  - party portrait frames
  - data export/import action cards
  - data status and prompt surfaces
- Auto-save remains distinguishable, but now by a stronger bronze border/brown surface rather than a blue border.
- Corrupt-save presentation retains a red-brown danger treatment.
- Disabled Google Drive actions remain visibly disabled using a muted brown state.
- The old save-dialog palette literals (`#4d7084`, `#18303a`, `#111d22`, `#555`, `#444`, `#333`, etc.) are no longer present in `modern-polish-config-save.css`.

## Cascade / specificity cleanup

The old global blue-gray `.btn` rules in `modern-polish-base.css` now exclude these semantic components:

- `.menu-action-button`
- `.save-ui-button`
- `.sky-prism-button`

The exclusion uses `:not(:where(...))`, so the exclusion itself does not artificially increase selector specificity. This allows the new component CSS to own normal/active/disabled presentation without adding another `!important` layer.

The specialized data export/import cards use a semantic selector strong enough to remain visually distinct from the generic save dialog button while still using no `!important`.

## `!important` status

Split modern-polish files after Phase 9:

- `modern-polish-base.css`: 807
- `modern-polish-menu.css`: 251
- `modern-polish-field.css`: 93
- `modern-polish-items.css`: 0
- `modern-polish-battle-late.css`: 15
- `modern-polish-config-save.css`: 1 textual occurrence (comment only; no declaration)
- `modern-polish-final.css`: 3
- Total textual occurrences: **1170**

Phase 8 total was 1170. Phase 9 therefore adds **zero** new `!important` occurrences, and `modern-polish-items.css` remains `!important`-free.

## Cache

- App-shell cache version: `prisma-abyss-v81.20260819`

## Validation

Passed:

- Top-level JavaScript syntax: **63 / 63** files
- Runtime CSS parse: **10 / 10** stylesheets
- Phase 8 menu structure regression
- Menu cascade state regression: **18 state pairs** remain visually distinct
- Phase 9 computed-style validation:
  - item target portrait is brown, not gray
  - item target row/summary are brown
  - Sky Prism shell and all button variants are brown/bronze
  - disabled Sky Prism state remains distinguishable
  - in-game Save/Load shell/header/buttons/cards are brown/bronze
  - auto-save no longer uses blue emphasis
  - Data Export/Import action cards are brown/bronze
  - disabled data action remains visibly disabled
  - title-screen Load dialog/button/card also remain brown despite title-page CSS
- Menu semantic-state ownership validation
- Achievement notification regression
- `NEWS_DATA` validation: latest record remains the single `2026/08/19` entry

## Protected areas

No battle JS, story/conversation JS, field JS, or corresponding dedicated battle/field CSS files were modified in this phase. `modern-polish-base.css` only changes the legacy button selector exclusions for the new semantic menu/save/Sky Prism button classes.
