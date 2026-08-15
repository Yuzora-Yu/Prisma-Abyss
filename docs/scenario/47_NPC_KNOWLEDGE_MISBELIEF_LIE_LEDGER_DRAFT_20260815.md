# 47_NPC_KNOWLEDGE_MISBELIEF_LIE_LEDGER_DRAFT_20260815

Status: draft governance ledger for new dialogue
Date: 2026-08-15
Purpose: keep unreliable NPC writing intentional instead of using “people can be wrong” as an excuse for inconsistency.

## 1. Rule

Before writing an unreliable statement, classify it.

### A. Mistake / wrong belief
The speaker believes it.

Must define:
- what they observed;
- what information they lack;
- what emotion/culture makes their conclusion attractive;
- whether the story ever needs to correct it.

### B. Rumor mutation
The speaker repeats something received from others.

Must define:
- original kernel of truth;
- at least one mutation step;
- why the speaker repeats it (fear, entertainment, status, warning, trade).

### C. Half-truth
The speaker knows the omitted part matters.

Must define:
- what is true;
- what is omitted;
- what they gain by framing it that way.

### D. Deliberate lie
The speaker knows the statement is false.

Must define:
- concrete motive;
- intended audience;
- risk if exposed;
- what they do when exposed.

**Critical rule:** no lie may carry a main-story objective unless the game gives the player another reliable route. A liar may complicate interpretation; they should not create an accidental progression trap.

---

## 2. New batch ledger

| ID | Area / speaker | Type | False or unstable claim | Why it exists | What is actually known | Correction policy |
|---|---|---|---|---|---|---|
| UL-001 | Lumina goat boy | wrong-belief | cave hates bells | missing goat's bell strap was found first; child fear | goat disappeared during collapse and returns later | never needs hard correction |
| UL-002 | Lumina peddler Mord | deliberate-lie | he drove off three monsters | profit + embarrassment about retreating | he saw tracks and fled | can be exposed immediately; comic |
| UL-003 | Ignisia bath elder | wrong-belief | mountain punished abandoned ritual | old custom really reduced pipe stress; grief/tradition merged cause and effect | ritual's supernatural effect unknown | leave partially unresolved |
| UL-004 | Kazaria old dance teacher | wrong-belief | sloppy festival steps caused disappearance | guilt + deceased partner's teaching | adults vanished during wind anomaly | do not humiliate her with narrator correction |
| UL-005 | Kazaria traveling merchant | rumor mutation | saint cleansed a canal by touch | combines separate stories to make a memorable tale | saint rumor, clean water, healing sightings are separate | other NPC mocks inconsistency; identity remains hidden |
| UL-006 | Rivaria ice seller | half-truth | price increase is purely transport cost | genuinely dangerous delivery + future-shortage markup | route cost rose, but margin also rose | argument with fish seller exposes framing |
| UL-007 | Rexnote Orba | deliberate-lie | wine cellar collapsed / nothing there | protects shelter and bedding used by former servants | cellar is mostly intact but irrelevant to political secrets | exposure produces boundary request, not lore reward |
| UL-008 | Rexnote boat mechanic | wrong-belief | magic boat has a bad temper | mana instability looks person-like to a partial technician | operator input affects startup | Alan can disagree, no absolute narrator verdict |
| UL-009 | Thunder Vasco | deliberate-lie | maintenance schedule had no gaps | shame; shields injured apprentice | one oiling cycle was skipped | ledger can expose; explicitly not the main crisis cause |
| UL-010 | Crystal assistant | deliberate-lie | crystal turns liars' tongues green | prevent children stealing sharp offcuts | invented superstition | admits to adults; asks them not to spoil deterrent |
| UL-011 | Crystal porter | wrong-belief | crystals smell fear | animals react when nervous near resonant roots | exact animal stimulus unknown to him | leave as field superstition |
| UL-012 | Galvania baker | deliberate-lie | ration bread contains bone powder | protects scarce child rations; distrusts humans | bread is edible root-mix | exposed by child eating same bread; no instant reconciliation |
| UL-013 | Galvania elder sister | deliberate-lie / protective deflection | mother is only “late” | younger brother cannot sleep during repeated evacuations | mother's status is unknown | wording changes when status becomes known |

---

## 3. Knowledge-tier matrix for recurring NPCs

Use this when adding future lines.

| Speaker type | Usually knows | Usually does not know | Common failure mode |
|---|---|---|---|
| village resident | local work, family, visible damage, nearby rumor | palace politics, prism theory, Abyss structure | turns fear into a culprit |
| child | concrete sights, overheard fragments | causal chains, institutional roles | literal interpretation, fused stories |
| merchant | roads, prices, customers, rumors from travel | hidden motives, ritual theory | exaggeration for sales/status |
| craft worker | materials, tools, practical failure patterns | cosmological cause | mistakes useful tradition for universal truth |
| adventurer | monsters, routes, dangerous behavior | court politics and research details | overgeneralizes from field experience |
| soldier | orders, unit rumors, local tactical facts | command's secret objective | assumes official explanation is complete |
| priest/acolyte | public doctrine, rites, local church practice | leadership conspiracy / divine full truth | moralizes unexplained pain |
| researcher assistant | procedure, specimen observations | theory outside specialty / human motives | treats measurement as explanation |
| old servant | household routines, wages, habits | lord's secret policy unless directly involved | nostalgia or resentment distorts judgment |
| refugee | evacuation patterns, what was lost, whom they fear | why the war exists in full | rumor becomes survival heuristic |

---

## 4. Lie design checklist

Before a deliberate lie is approved for runtime, answer all seven:

1. What exact sentence is false?
2. What exact fact does the speaker know instead?
3. What do they protect or gain?
4. Why choose a lie instead of silence?
5. Why tell **this player/party** the lie?
6. What observable clue can make the player doubt it, if doubt matters?
7. How does the speaker react when caught?

If 3 or 4 cannot be answered concretely, remove the lie and use ignorance, refusal, or rumor instead.

## 5. Anti-AI checks for unreliable dialogue

Reject the line if:

- the liar gives a perfect thematic speech explaining why people lie;
- every wrong NPC is neatly corrected within the same conversation;
- wrong beliefs conveniently point to the true villain anyway;
- every child is mysteriously closer to cosmic truth than adults;
- every merchant is greedy, every soldier obedient, every priest deluded;
- the lie exists only so a later twist can say “gotcha”;
- all NPCs speak in complete, balanced arguments;
- the speaker's job, family, fear, or history could be swapped with another NPC without changing the line.

## 6. Runtime discipline

- Use unreliable NPC text primarily for optional/revisit interactions.
- Main objectives should come from reliable event structure or multiple converging sources.
- When a false rumor touches a major canon reveal, register it in the main foreshadowing ledger before implementation.
- A wrong belief can remain wrong forever. The world does not owe every NPC a correction scene.
- A deliberate liar can still be kind, useful, brave, or later correct about something else.
