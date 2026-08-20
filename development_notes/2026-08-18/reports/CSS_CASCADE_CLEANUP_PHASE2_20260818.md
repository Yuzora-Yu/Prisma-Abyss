# CSS Cascade Cleanup Phase 2 — 2026-08-18

## Purpose

Phase 2 advances the cleanup without redesigning battle/conversation UI. The focus is to remove hidden CSS ownership from JavaScript, stop CSS from inferring UI state from inline color strings, and make menu state/surface styling explicit enough that later visual unification can be done without adding more `!important` overrides.

Baseline: `PRISMA_ABYSS_css_cleanup_phase1_20260818.zip`.

## Main results

### 1. Runtime-injected stylesheets: 5 → 0

The following JavaScript-owned `<style>` blocks were moved into a new static sheet, `runtime-components.css`:

- `equip_acquisition_card.js` — +3 equipment acquisition card and animation CSS
- `menus_inventory.js` — inventory equipment-card CSS
- `facilities.js` — shop UI CSS
- `tutorial.js` — tutorial modal CSS
- `story_logic.js` — end-credit keyframes only

The original compatibility methods (`injectStyle`, `ensureShopStyles`, `ensureStyles`, etc.) remain callable where useful, but no longer append `<style>` nodes.

`runtime-components.css` is loaded after `modern-polish.css` and `opening.css`, preserving the former late-cascade behavior of dynamically appended styles. It is also included in the Service Worker app-shell precache; the shell cache was bumped to `prisma-abyss-v72.20260818`.

Static boundary audit:

- runtime-injected stylesheets: **0**
- exact selector/property overlap between `modern-polish.css` and `runtime-components.css`: **0**
- `runtime-components.css` declarations: **955**
- `runtime-components.css` `!important`: **6** (component-local behavior preserved)

### 2. Fragile `[style*=...]` CSS state/surface detection: 11 rules → 0

Phase 1 still had CSS such as:

```css
[style*="background:#333"] { ... }
```

This made an inline color string behave like an undocumented state API. Phase 2 removes all of those selectors.

Legacy menu surfaces that previously depended on those selectors now use explicit semantic classes:

- `.menu-surface-card`
- `.menu-surface-deep`

Static and JS-created menu elements were annotated where the old selectors actually supplied the brown/deep menu surface. Conditional buttons now apply the surface class only in the state that needs it, so action/danger states are not accidentally overridden.

Current audit result: `styleAttributeSelectorRules = 0`.

### 3. Tab/filter state is class/ARIA driven instead of color driven

Several menu implementations used inline `background:#ffd700` / dark background values as both appearance and state. Phase 2 moves these screens toward explicit state classes and accessibility state:

- status/menu tabs
- exchange/news/tutorial tabs
- ally-detail tabs
- ally archive/book detail tabs
- achievement filters
- inventory filters
- blacksmith filters

Typical ownership is now:

- JavaScript: `is-active`, `active`, `aria-selected`, `aria-pressed`
- CSS: selected/inactive colors, borders, shadows

This reduces the number of places where changing a color can accidentally change behavior.

### 4. Safe dead override cleanup

A constrained cleanup removed **25 earlier differing declarations** that were provably superseded later for a small safe selector set (title/menu-card/navigation styling). It deliberately did not sweep battle, dialogue, field, gacha, or broad shared selectors.

The exact-duplicate cleanup was rerun after Phase 2 and found **0** additional exact duplicates, confirming Phase 1 already removed that safe class of duplicate.

### 5. `!important` policy

`modern-polish.css` remains at **1,247 `!important` tokens** in this phase.

This is intentional. Phase 2 removes the structural reasons that make `!important` hard to reason about first (dynamic stylesheet insertion and style-string state detection), rather than deleting `!important` speculatively just to lower the count.

The next reduction pass can now test menu-scoped `!important` declarations against a much more stable cascade.

## Protected areas / scope control

- `battle.js` was not modified.
- Battle DOM/CSS was not intentionally redesigned.
- Field controls and field scene logic were not modified.
- Conversation/event branching was not modified.
- `story_logic.js` changed only by removing the six-line dynamic end-credit keyframe `<style>` injection; the same keyframe now exists in `runtime-components.css`.
- Four `style.setProperty(..., 'important')` calls remain in `gacha.js` for premium-card frame removal and were intentionally left untouched.

## Validation performed

- `node --check`: all **63** root JavaScript files passed.
- PostCSS parse: `modern-polish.css`, `runtime-components.css`, and `opening.css` passed.
- Runtime style-source audit:
  - runtime injected stylesheets: **0**
  - fragile `[style*=...]` selectors: **0**
  - inline-style `!important`: **0**
  - `style.setProperty(..., 'important')`: **4**, all in the intentionally untouched gacha frame cleanup.
- Static stylesheet boundary audit:
  - exact `modern-polish.css` / `runtime-components.css` selector+property overlap: **0**
  - load order verified: runtime components after modern/opening
  - Service Worker precache entry verified
- Exact duplicate cleanup rerun: **0** additional removals.

## Recommended validation-environment checks

Because this pass deliberately changes *where* styles are sourced, test the following before the next `!important` reduction pass:

1. +3 equipment acquisition card, including option/trait/synergy reveal animations.
2. Inventory equipment cards and filters.
3. Shop purchase/sell screens.
4. Tutorial modal.
5. End credits.
6. Menu tabs/filters: status, exchange, allies, book, achievements, inventory, blacksmith.
7. Regression spot-check: one normal battle and one conversation event should look unchanged.

## Next phase

After validation, Phase 3 can aggressively reduce menu-scoped `!important` and split the remaining legacy `modern-polish.css` into clear ownership layers. Battle/conversation can remain frozen while that work proceeds.
