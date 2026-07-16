# Sprint 65 Material Role and Beat Presentation

## Task

**S65-BL-006 — Material Role and Beat Presentation**

Define deterministic learner-facing presentation for materials and beats using only current signals (material type, validated beat mapping, title, body shape, existing validated fields).

```text
Implementation status: Not started
```

Does **not** authorise production hardening. Does **not** change BL-004 activity slots or BL-005 page IA.

## Scope and Constraints

**In scope:** Role taxonomy; type↔role and beat↔role maps; title/label policy; residual/orphan/unknown presentation; grouping; tables/examples/checklists/transfer; static demos.

**Out of scope:** Production `app.js`/`lib`/CSS/tests; schema; GAM; registry schema changes (may note gaps); Sprint 64 prototypes; prose-based role inference; S65-BL-007 coding.

**Settled:** Role > archetype (MR-015); valid beat order preserved (MR-017/020); residuals never suppressed (MR-021); unknowns visible (MR-023); raw beat enums not primary learner headings (MR-018); Produce ≠ Check (D18).

## Evidence Base

| Item | Path |
| ---- | ---- |
| Baseline audit | [`baseline-learner-experience-audit.md`](baseline-learner-experience-audit.md) |
| Signal inventory | [`renderer-signal-inventory.md`](renderer-signal-inventory.md) · frequency JSON |
| Manifestation rules | [`archetype-sensitive-manifestation-rules.md`](archetype-sensitive-manifestation-rules.md) |
| Page IA | [`page-information-architecture.md`](page-information-architecture.md) |
| Beat registry | [`lib/beat-material-registry.js`](../../../../lib/beat-material-registry.js) (read-only) |
| Demos | [`experiments/material-role-and-beat-presentation/`](experiments/material-role-and-beat-presentation/) |

## Samples and Material Corpus

**Primary set (BL-002):** 8 pages · 26 activities · **87 materials** — unchanged.

| Sample | Role in this task |
| ------ | ----------------- |
| RNA assembled | Type labels, residual A3 planning_table, orphan A4 text, transfer A6 |
| RNA assessment | Assessment items (page-level; not material-role interior) |
| Kitchen-sink | Broad type surface + unknown key |
| Marx beat-render | Dense beat assignment |
| Inflation workshop | Tables / prompts / assessment materials |
| Climate misconception | Prompt sets / scenarios |
| Self-directed framing | Sparse materials + cognition |
| Shape production metadata | Meta (not learner materials) |

**Denominators:** unchanged at 8 / 26 / 87. No extra pages required for coverage; `planning_table` (1) and `experimental_unknown_key` (1) already in set.

**Encountered beat functions (assigned):** explanation (10), worked_thinking (8), guided_practice (10), verification (11), worked_judgement (1), transfer (3).

## Current Material Presentation

Observed (RNA baseline + inventory):

- Materials render under beat sections whose learner headings often map to “Understand / See it modelled / Your turn / Check…” — but **“Understand” appears on non-understand activities** when explanation materials exist (F03).
- Headings frequently use **pretty type names**: Text, Template, Transfer Prompt, Worked Example (F04b).
- Fixture titles (`S62 RNA …`) leak as h4/h5.
- Assigned materials follow beat order when registry maps them; **unregistered `planning_table` residuals after verification** (F11); **unmatched episodeFunctions orphans** after check (F12).
- Cards/sections per material; tables can be wide; checklists are lists (good) but duplicate Success/Produce composition (addressed at contract level by BL-003/004).

## Learner Role Taxonomy

**Final taxonomy (7 roles)** — refined from BL-004; no one-role-per-type:

| Role ID | Canonical learner label | Optional label variants (type-conditioned) |
| ------- | ----------------------- | ------------------------------------------ |
| `idea` | Understand the idea | — |
| `example` | See an example | Worked example · Sample product · Model |
| `evidence` | Examine the evidence | Scenario (when type is scenario*) |
| `try_it` | Try it | Record your response (templates/worksheets) |
| `check` | Check your work | — |
| `extend` | Extend your thinking | Apply elsewhere (transfer material) |
| `also` | Also available | — |

**Rejected as separate roles:** Workspace (alias of Try it); Reference (Idea or Also available); Compare (Try it / Evidence by type); Model (Example variant). Evidence did not require extra semantic identities.

## Role Definitions

| Role | Learner question | Typical types | Placement | Default interaction | Must not imply |
| ---- | ---------------- | ------------- | --------- | ------------------- | -------------- |
| Idea | What do I need to understand before acting? | text, reading_text, support_text, consolidation_summary, reference_table | Support, before Try it | Read | Complete coverage; hidden relationships |
| Example | What does a good response / process look like? | worked_example, sample_output, modelling_note | Support, before Try it | Inspect | That this is *their* answer to submit; assessment key |
| Evidence | What situation or data should I use? | scenario, scenarios, study_scenarios | Support, near Try it | Inspect / use | That all analysis criteria exist |
| Try it | Where do I perform or record the task? | classification/analysis/planning/decision tables, template, worksheet, prompt_set, task_cards | Support → before Check | Complete / record | Verification criteria; expected product wording |
| Check | How do I verify and improve? | checklist, evaluation_checklist, rubric | Check and improve | Verify | Redefinition of Produce |
| Extend | How does this transfer? | transfer_prompt, transfer scenarios | Reflect or extend (after Check) | Attempt further | New required stages |
| Also available | What else is here that didn’t classify cleanly? | unknown, unmatched residual | Also available | Read as needed | Hidden importance; suppression |

## Material-Type Inventory

| Material type | Count (87) | Registry beat | Current visible label tendency | Default role | Alt roles | Learner action | vs Task/Check | Type name learner-safe? |
| ------------- | ---------- | ------------- | ------------------------------ | ------------ | --------- | -------------- | ------------- | ----------------------- |
| text | 9 | READ | “Text” | Idea | Also (unmatched) | Read | Before Try it | **No** as sole heading |
| reading_text / support_text | 1+1 | READ | Type/pretty | Idea | Also | Read | Before | Weak |
| worked_example | 8 | EXAMPLE | Worked Example | Example | — | Inspect process | Before Try it | Acceptable if not stacked |
| sample_output | 2 | EXAMPLE | Sample Output | Example | Check support | Inspect product | Near Example; not Produce | Weak |
| modelling_note | 1 | EXAMPLE | Modelling Note | Example | Idea | Inspect model | Before Try it | Weak |
| checklist / evaluation_checklist / checklist_array | 14+1+1 | CHECK | Checklist | Check | — | Verify | Check region | OK |
| classification_table | 1 | PRACTICE | Classification Table | Try it | — | Complete | Before Check | Weak |
| analysis_table | 8 | PRACTICE | Analysis Table | Try it | — | Complete/compare | Before Check | Weak |
| planning_table | 1 | **Unregistered** | Planning Table | Try it | Also if unknown path | Complete | **Must before Check** | Weak |
| decision_table | 3 | PRACTICE | Decision Table | Try it | — | Record judgement | Before Check | Weak |
| comparison_table / cause_effect / impact / table / worksheet | 1 each | PRACTICE/var | Type pretty | Try it | Idea if reference_table | Complete/inspect | Before Check | Weak |
| reference_table | 2 | READ | Reference Table | Idea | Evidence | Inspect | Before Try it | Weak |
| scenario / scenarios | 5+2 | READ | Scenario / fixture title | Evidence | Extend if transfer beat | Use case | Near Try it | “Scenario” OK; fixture titles not |
| transfer_prompt | 3 | PRACTICE | Transfer Prompt | Extend | — | Transfer | After Check | **No** |
| template / escalation_template / analysis_template | 4+1+1 | CREATE/— | Template | Try it | — | Complete | Before Check | **No** |
| prompt_set / prompts / discussion_prompts / comparison_prompts | 2+1+1+2 | DISCUSS/— | Prompt Set | Try it | Evidence | Respond | Before Check | Weak |
| task_cards | 3 | PRACTICE | Task Cards | Try it | — | Perform | Before Check | Weak |
| consolidation_summary | 1 | REFLECT | Summary | Idea | Extend | Read | Support / after | OK-ish |
| strategy_options | 1 | REFLECT | Strategy | Evidence | Try it | Compare options | Near Try it | Weak |
| experimental_unknown_key | 1 | none | Unknown/key | Also | Try it if table-shaped | Read | Also available | N/A |
| scenario_section_title | 1 | — | Title chrome | Also / suppress as chrome | — | — | — | Not a body material |

Assessment-related materials on assessment pages are **page-level** (BL-005), not Support roles.

## Type-to-Role Mapping

| Material type | Default role | Conditional role | Conditions (structural only) | Learner-facing label | Fallback |
| ------------- | ------------ | ---------------- | ---------------------------- | -------------------- | -------- |
| text / exposition / reading* / support_text | Idea | Also available | Unmatched / residual with no beat | Role label (not “Text”) | Also available |
| worked_example | Example | — | — | See an example / Worked example | Example |
| sample_output | Example | Check support | Only if adjacent to verification beat **and** not the Produce field | Sample product | Example |
| modelling_note | Example | — | — | Model | Example |
| scenario* | Evidence | Extend | Valid transfer beat assignment | Scenario | Evidence |
| checklist* / evaluation_checklist / rubric | Check | — | — | Check your work | Check |
| classification_table / analysis_table / planning_table / decision_table / worksheet / template* / task_cards / prompt_set / prompts* | Try it | Also | Unknown registration path without table structure | Try it / Record your response | Try it if table/list workspace shape; else Also |
| reference_table | Idea | — | — | Reference | Idea |
| transfer_prompt | Extend | — | Prefer material over duplicate prompt (MR-004) | Extend your thinking | Extend |
| consolidation_summary / summary | Idea | — | — | Summary / Idea | Idea |
| strategy_options | Evidence | Try it | If clearly completable grid | Options to consider | Evidence |
| unknown / unregistered | Also available | Try it | Structural: HTML table / explicit worksheet shape only | Also available | Always visible |

**S65-MBP-001** (MBP-MUST): Map type → role using this table only; **no prose semantic analysis**.  
**S65-MBP-002** (MBP-MUST): Role semantic identity does not change by archetype (emphasis/order only).

## Beat Function Inventory

| Beat function (raw) | Current renderer use | Learner-use interpretation | Safe learner role | Visible label | Order priority | Raw enum exposed? |
| ------------------- | -------------------- | -------------------------- | ----------------- | ------------- | -------------- | ----------------- |
| explanation | Understand / Explanation section | Read ideas | Idea | Understand the idea | Early support | **No** |
| observation | Similar to explanation | Observe / note | Idea | Understand the idea | Early | No |
| criteria_exposition | Explanation-like | Criteria prose | Idea | Understand the idea | Early | No |
| worked_thinking | See it modelled | Process model | Example | See an example | After Idea | No |
| worked_judgement | Modelled judgement | Modelled decision | Example | See an example | After Idea | No |
| example / non_example | Example beat | Example | Example | See an example | After Idea | No |
| guided_practice / guided_inquiry / guided_reasoning | Your turn / Practice | Do the work | Try it | Try it | After Example/Evidence | No |
| independent_performance | Practice | Perform | Try it | Try it | Same | No |
| verification | Check your work | Verify | Check | Check your work | After Try it | No |
| transfer | Apply elsewhere | Transfer | Extend | Extend your thinking | After Check | No |
| reflection | Reflect | Reflect | Extend / Reflect slot | Reflect | After Check | No |
| evaluative_judgement | Varies | Judge | Try it (workspace) or Check (rubric) | By material type | — | No |

Empty beats: **omit headings** (no empty “Understand” shells).

## Beat-to-Role Mapping

```text
Valid beat mapping
→ map beat function → learner role (table above)
→ preserve beat order for assigned materials
→ preserve source/_render_sequence order within beat
→ render learner-facing role heading (not raw enum)
```

| Rule | Detail |
| ---- | ------ |
| Same role, consecutive beats | **Merge** under one role heading; keep materials in beat+source order |
| One beat, mixed types | Keep under beat’s role heading; **material type may force child label** if conflict table says so (e.g. checklist under verification → Check) |
| Beat identity for diagnostics | Retain in S4/developer only |
| Beat with no materials | Omit |
| Materials reference missing beat | Treat as unmatched → residual policy |

**S65-MBP-003** (MBP-MUST): Preserve valid beat order for assigned materials.  
**S65-MBP-004** (MBP-MUST-NOT): Expose raw beat enums as primary learner headings.

## Beat and Type Conflict Rules

**Principle:** Validated learner-use role (from material type + structural conditions) **wins** over overly broad beat labelling; preserve sequence via adjacency.

| Beat signal | Material type | Preferred role | Rationale | Diagnostic note |
| ----------- | ------------- | -------------- | --------- | ---------------- |
| explanation | checklist | Check | Checklist is verification | Beat mis-tag possible |
| guided_practice | worked_example | Example | Example remains example; place before Try it adjacency | OK |
| verification | planning_table / template | Try it | Workspace ≠ check | Residual if unregistered |
| transfer | checklist | Check | Type wins | Unusual |
| reflection | analysis_table | Try it | Completing a table ≠ reflection | Don’t label Reflect |
| explanation | scenario | Evidence | Scenario is evidence/context | Prefer Evidence label |
| guided_practice | transfer_prompt | Extend | Transfer after Check per MR-021 | May residual to Extend |

**S65-MBP-005** (MBP-MUST): On conflict, prefer type-derived learner-use role; keep materials visible in nearest safe order slot.

## Archetype Interaction

| Role | Understand | Apply | Analyse | Evaluate | Semantic identity changes? |
| ---- | ---------- | ----- | ------- | -------- | -------------------------- |
| Idea | Lead support | Background | Secondary | Background | **No** |
| Example | Lead | Before Try it | Model | Worked judgement | **No** |
| Evidence | Supporting | Scenario near Try | **Lead** | Decision context | **No** |
| Try it | After idea/example | **Lead** | After evidence | Decision workspace | **No** |
| Check | Distinctions | Completion | Evidence link | Criteria | **No** |
| Extend | Last | After Check | Last | After Check | **No** |
| Also | Always available | Always | Always | Always | **No** |

## Material Title Rules

**Precedence:**

1. Meaningful source title (authored, non-implementation, non-fixture-test)  
2. Learner-facing role label (or type-conditioned variant) when title missing / implementation-facing  
3. Safe generic fallback: role label only  

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-MBP-006 | MBP-MUST | Prefer meaningful source title over type pretty-name |
| S65-MBP-007 | MBP-MUST | If title equals normalised material type (case/underscore/space insensitive), treat as implementation-facing → use role label |
| S65-MBP-008 | MBP-MUST | If title matches `isFixtureTestMaterialTitle` patterns, do not prefer as learner heading |
| S65-MBP-009 | MBP-SHOULD | Avoid stacked Role + identical material title (“See an example” + “Worked Example”) — use one heading |
| S65-MBP-010 | MBP-MUST | Preserve original titles for diagnostics / data; suppression is presentation-only |

## Implementation-Facing Label Treatment

**Structural tests (no prose AI):**

- Exact/normalised equality with material type enum (`text` → “Text”, `transfer_prompt` → “Transfer Prompt”)  
- Generated solely from `prettyMaterialHeading(type)` with no distinct authored title  
- Duplicate of parent role heading  
- Fixture-test marker patterns already identified in production helpers  

**Bounded non-dominant labels:** Text, Body (if ever), Template, Transfer Prompt, Planning Table, Analysis Table, Classification Table, Decision Table, Sample Output, Modelling Note, Prompt Set, and underscore→Title Case enum echoes.

**Actions:**

| Case | Action |
| ---- | ------ |
| Implementation-facing title | Replace visible heading with role/variant; keep original in diagnostic |
| Meaningful authored title | Keep as material h4 under role group |
| Fixture-test title | Prefer role label + body; original diagnostic-only |

**S65-MBP-011** (MBP-MUST-NOT): Suppress or delete source-authored meaningful titles.  
**S65-MBP-012** (MBP-MUST-NOT): Suppress a title merely because it is short.

## Assigned Material Ordering

Compatible with BL-004 contract:

1. Activity framing (Why / Approach) — not materials  
2. Task · Produce  
3. Support — **assigned materials in valid beat order**, role headings  
4. Learner-work residuals (Try it)  
5. Check materials  
6. Reflect / Extend  
7. Also available residuals  

Within group: beat order → source/`_render_sequence` order. **No global reorder by type alone.**

**S65-MBP-013** (MBP-MUST): Assigned-material order follows validated beat plan when present.

## Residual Material Policy

Expansion of MR-021:

| Residual class | Examples | Preferred group | Placement |
| -------------- | -------- | --------------- | --------- |
| Learner work | planning_table, template, prompt_set, analysis_table if unassigned | Try it | Before Check |
| Verification | checklist unassigned | Check | Check region |
| Transfer | transfer_prompt, transfer scenario | Extend | After Check |
| Unclear | plain text unmatched | Also available | Before Check (unless clearly Extend) |

- Preserve source order within class  
- Never suppress  
- Do not invent beat membership  
- RNA **A3**: planning_table → Try it before Check (fixes post-verification placement)  
- RNA **A4**: unmatched text → Also available (or Idea if type text and pre-check), still visible  

**S65-MBP-014** (MBP-MUST): Residual learner-work before Check; never after Check solely due to registry gaps.

## Orphan and Unmatched Material Policy

| Failure mode | Definition | Learner presentation | Ordering | Diagnostic | Must not happen |
| ------------ | ---------- | -------------------- | -------- | ---------- | --------------- |
| Residual | Not placed by main beat loop | Role-classified per policy | MR-021 | Optional S4 note | Suppression |
| Orphan / unmatched episodeFunction | References beat/function that cannot resolve | Role by type; Also available if unclear | With residuals | Log mapping defect | Invented beat membership |
| Unknown type | No registry / unknown key | Also available (Try it if table-shaped) | Also / Try it | Log type | Silent drop |
| Unassigned | No beat association (flat materials) | Role by type; source order | Support by role groups | — | Empty beat shells |

**S65-MBP-015** (MBP-MUST): Orphans remain visible and coherent without fake beat labels.

## Unknown Material Policy

**S65-MBP-016** (MBP-MUST): Unknown/unregistered → title+body visible; default Also available; Try it only when structure is clearly a table/workspace; never infer detailed role from prose.

## Group Merging and Splitting

| Situation | Merge? |
| --------- | ------ |
| Consecutive same role (incl. adjacent beats mapping to same role) | **Yes** — one heading |
| Example then Example | Yes |
| Multiple checklists | Yes under Check; separate list blocks |
| Evidence + Scenario types | Yes under Evidence; Scenario as child label if useful |
| Idea then Try it | **No** — different actions |
| Try it then Check | **No** |
| Mixed actions in one group | Split by role |

Mobile/print: same merge rules; headings must not orphan from first material (keep heading with content).

**S65-MBP-017** (MBP-SHOULD): Merge consecutive same-role groups; never merge different learner actions.

## Material Body Presentation

| Shape | Rules |
| ----- | ----- |
| Prose | Semantic paragraphs; no flatten |
| Lists | Preserve `ul`/`ol` |
| Tables | See table rules |
| Prompts | List or numbered prompts |
| Sample outputs | Distinct block; optional disclosure |
| Scenarios | Block with Scenario label |
| Checklists | Lists under Check |
| Long reference | MAY collapse Idea/Also; not Try it |

**S65-MBP-018** (MBP-MUST): Do not flatten structured materials into undifferentiated paragraphs.

## Table Presentation

| Concern | Rule |
| ------- | ---- |
| Intent | Completing tables → Try it; reference_table → Idea (inspect) |
| Caption | Meaningful title or role; not raw type alone |
| Headers | Require column headers when present in source; row headers when source provides |
| Mobile | Horizontal scroll container; **do not hide columns** without evidence |
| Print | Allow overflow/scale; keep headers |
| Empty cells | Preserve; no invented filler |
| Interactivity | Static HTML unless product already provides inputs — do not fake inputs |
| vs Produce | Table is workspace; Produce describes product |
| vs Checklist | Distinct |

**S65-MBP-019** (MBP-MUST): Wide tables use overflow scroll; no silent column dropping.  
**S65-MBP-020** (MBP-MUST): `planning_table` treated as Try it even when unregistered.

## Worked Examples and Sample Outputs

| Kind | Label | Placement | Default disclosure | Notes |
| ---- | ----- | --------- | ------------------ | ----- |
| Worked example | See an example / Worked example | Before Try it | Open (process needed) | Not the learner’s answer |
| Sample output | Sample product | With Example; optional near Check as model | **MAY** collapse if long / answer-like | ≠ assessment answer |
| Assessment explanation | (page assessment) | BL-005 | Collapsed | Not material Support |
| Model response | Example | Before Try it | Open unless answer-key risk | |

**S65-MBP-021** (MBP-MUST-NOT): Treat every sample_output as an assessment answer key.  
**S65-MBP-022** (MBP-SHOULD): Collapse sample products when they risk premature completion reveal; keep worked process visible when task depends on it.

## Checklist Presentation

- Place under **Check and improve**  
- Semantic lists; do not rewrite criteria; no inferred scores  
- Multiple checklists → one Check region, sequential lists  
- Empty checklist → omit  
- Material title: omit if implementation-facing; keep if meaningful  
- Distinct from Produce  

**S65-MBP-023** (MBP-MUST): Checklist ≠ Produce; list semantics required.

## Transfer Presentation

```text
Transfer material > duplicate transfer prompt
```

- Default group: **Extend** after Check  
- Changed-case scenario with transfer beat → Extend (Evidence→Extend conditional)  
- Omit duplicate prompt when material already states same transfer  
- Collapse: MAY for long transfer after core task  
- Sparse: omit if absent  
- Do not invent transfer from archetype  

**S65-MBP-024** (MBP-MUST): Apply transfer-material precedence; place Extend after Check.

## Progressive Disclosure

| Role / content | Default |
| -------------- | ------- |
| Try it / essential Evidence / Checklist (when verification expected) | **Visible** |
| Task / Produce | **Visible** (page+activity rules) |
| Long Idea / Also available / long Sample product / answer explanations | **MAY collapse** |
| Worked example needed for task | Visible |

**S65-MBP-025** (MBP-MUST): Never default-collapse required learner-work workspace.  
**S65-MBP-026** (MBP-MUST): Disclosure controls accessible (keyboard, focus, labels); print expands learner-relevant collapsed content.

## Mobile Rules

- Stack role groups vertically  
- Avoid heading-only density; keep role + first material together  
- Tables: scroll containers  
- Long titles wrap; accessible name retains full text  
- No horizontal carousels for materials  
- Also available at end of Support/activity materials  

**S65-MBP-027** (MBP-SHOULD): Single-column role stacking on narrow viewports.

## Print Rules

Order mirrors learner-use sequence (assigned → residuals Try it → Check → Extend → Also). Expand collapsed Idea/Example/Extend/Also when learner-relevant. Exclude diagnostics. Avoid orphaned headings. Tables keep headers.

**S65-MBP-028** (MBP-MUST): Print order independent of ephemeral disclosure state where feasible.

## Accessibility Rules

- Role groups as labelled sections/headings  
- Material titles distinct when kept  
- Lists for checklists/prompts; tables with headers  
- No colour-only role signalling; icons need text  
- Reading/focus order = visual order  
- Avoid duplicate accessible names (stacked headings)  
- Unknown fallback still headed  

No WCAG claim.

**S65-MBP-029** (MBP-MUST): No colour-only material-role meaning.  
**S65-MBP-030** (MBP-SHOULD): Icons decorative or text-equivalent.

## Option A — Type-Led

Type drives labels/grouping (near current).  
**Benefit:** Familiar; high type fidelity.  
**Risk:** Text/Template/Transfer Prompt leakage; weak use clarity; residuals still broken without extra policy.

## Option B — Role-Led

Learner-use role drives all grouping; titles secondary; beat order secondary.  
**Benefit:** Clear “what do I do?”  
**Risk:** May scramble validated beat sequence; over-merge distinct examples/evidence.

## Option C — Beat-and-Role Hybrid

Valid beat order controls sequence; learner-use role controls labels and local merge; residual policy handles unmatched/unknown.  
**Benefit:** Sequencing fidelity + legible use + safe failure.  
**Risk:** Slightly higher branching (prototypeable).

## Evaluation Scores

Scale 1–5. Evidence: RNA A1/A3/A4/A6, F04b/F09/F11/F12, demos.

| Dimension | A Type-led | B Role-led | C Hybrid | Evidence |
| --------- | ---------- | ---------- | -------- | -------- |
| Action clarity | 3 | 4 | **5** | Task+Try it adjacency |
| Material role | 2 | **5** | **5** | F04b |
| Progression | 3 | 3 | **5** | Beat order |
| Verification | 3 | 4 | **5** | Checklist placement |
| Transfer | 2 | 4 | **5** | A6 Extend |
| Density | 2 | 4 | **4** | Merge same-role |
| Duplication | 2 | 4 | **4** | Title stacking rules |
| Accessibility | 3 | 4 | **4** | Role headings |
| Resilience | 2 | 4 | **5** | Residual/unknown |
| Source fidelity | **5** | 4 | **5** | Titles kept |
| Sequencing fidelity | 4 | 2 | **5** | MR-017 |
| Unknown-type safety | 2 | 4 | **5** | MBP-016 |
| Residual safety | 1 | 4 | **5** | A3/A4 |
| Complexity | **5** | 3 | 3 | — |
| Generality | 3 | 4 | **5** | Corpus |
| Mobile | 3 | 4 | **4** | Stack |
| Print | 3 | 4 | **4** | Expand |

**Verdict:** **Option C** strongest on role + sequence + residual safety without sacrificing source fidelity.

## Recommended Presentation Model

**Recommend Option C — Beat-and-Role Hybrid**, with:

- 7-role taxonomy  
- Type→role map + beat→role map + conflict table  
- Title/implementation-label policy  
- Expanded residual/orphan/unknown policies  
- Group merge for same role only  

Compatible with BL-004 Support/Check/Extend and BL-005 (materials stay inside activities).

## Material Presentation Rule Register

| Rule ID | Level | Rule | Applies to | Evidence | Prototype? |
| ------- | ----- | ---- | ---------- | -------- | ---------- |
| S65-MBP-001 | MBP-MUST | Type→role map; no prose inference | Mapping | BL-002 | Yes |
| S65-MBP-002 | MBP-MUST | Role identity ≠ archetype | Archetype | MR-015 | Yes |
| S65-MBP-003 | MBP-MUST | Preserve valid beat order | Beats | MR-017 | Yes |
| S65-MBP-004 | MBP-MUST-NOT | Raw beat enums as primary headings | Beats | F03 | Yes |
| S65-MBP-005 | MBP-MUST | Type use-role wins conflicts | Conflicts | F11/F12 | Yes |
| S65-MBP-006 | MBP-MUST | Prefer meaningful titles | Titles | F04b | Yes |
| S65-MBP-007 | MBP-MUST | Type-equal titles → role label | Titles | Text/Template | Yes |
| S65-MBP-008 | MBP-MUST | Fixture-test titles not preferred | Titles | isFixture… | Yes |
| S65-MBP-009 | MBP-SHOULD | Avoid stacked duplicate headings | Titles | Density | Yes |
| S65-MBP-010 | MBP-MUST | Original titles preserved diagnostically | Titles | Source | No |
| S65-MBP-011 | MBP-MUST-NOT | Delete meaningful authored titles | Titles | — | No |
| S65-MBP-012 | MBP-MUST-NOT | Suppress for shortness alone | Titles | — | No |
| S65-MBP-013 | MBP-MUST | Assigned order = beat plan | Order | RNA A1 | Yes |
| S65-MBP-014 | MBP-MUST | Residual Try it before Check | Residual | A3 | Yes |
| S65-MBP-015 | MBP-MUST | Orphans visible, no fake beats | Orphan | A4 | Yes |
| S65-MBP-016 | MBP-MUST | Unknown visible; Also/Try it structural | Unknown | kitchen-sink | Yes |
| S65-MBP-017 | MBP-SHOULD | Merge same-role only | Groups | — | Yes |
| S65-MBP-018 | MBP-MUST | Preserve structured bodies | Body | — | Yes |
| S65-MBP-019 | MBP-MUST | Table overflow; no column drop | Tables | Mobile | Yes |
| S65-MBP-020 | MBP-MUST | planning_table = Try it | Tables | F11 | Yes |
| S65-MBP-021 | MBP-MUST-NOT | sample_output ≠ answer key auto | Examples | — | Yes |
| S65-MBP-022 | MBP-SHOULD | Collapse risky sample products | Examples | — | Yes |
| S65-MBP-023 | MBP-MUST | Checklist list; ≠ Produce | Checklist | D18 | Yes |
| S65-MBP-024 | MBP-MUST | Transfer precedence + after Check | Transfer | A6 | Yes |
| S65-MBP-025 | MBP-MUST | Never collapse required Try it | Disclosure | — | Yes |
| S65-MBP-026 | MBP-MUST | Accessible disclosure + print expand | Disclosure | A11y | Yes |
| S65-MBP-027 | MBP-SHOULD | Mobile single-column roles | Mobile | — | Yes |
| S65-MBP-028 | MBP-MUST | Print ≠ interactive state | Print | — | Yes |
| S65-MBP-029 | MBP-MUST | No colour-only roles | A11y | MR-011 | No |
| S65-MBP-030 | MBP-SHOULD | Icon text equivalents | A11y | — | Yes |
| S65-MBP-031 | MBP-MUST | Empty beats omit headings | Beats | D20 | Yes |
| S65-MBP-032 | MBP-MUST | Never suppress residual/orphan/unknown | Safety | MR-008 | Yes |
| S65-MBP-033 | MBP-MUST | S1–S3 only for structure; no S6 | Signals | D01 | No |
| S65-MBP-034 | MBP-MUST-NOT | Invent instructional roles from archetype | Safety | MR-010 | No |
| S65-MBP-035 | MBP-SHOULD | Scenario label variant under Evidence | Labels | RNA A3 | Yes |
| S65-MBP-036 | MBP-MUST | Materials remain inside activity Support/Check/Extend — not page IA | Scope | PIA-040 | No |

**Count:** 36 rules (S65-MBP-001 … S65-MBP-036).

## Rules Requiring Prototype Validation

MBP-001–009, 013–017, 019–028, 030–031, 035 — especially title replacement, A3 residual reorder, A4 orphan, unknown key, wide tables, sample-output disclosure, heading merge.

## Rejected Alternatives

| Alternative | Why |
| ----------- | --- |
| Keep type-led headings as primary | F04b confirmed harm |
| Pure role-led ignoring beat order | Breaks sequencing fidelity |
| One role per material type | Taxonomy explosion; not learner-facing |
| Prose NLP role inference | Forbidden; unstable |
| Suppress residuals to “clean” mode | MR-010 / MBP-032 |
| Expose explanation/guided_practice enums | F03 |
| Colour-coded material roles | MBP-029 |
| Hide sample_output always | May be needed as Example |
| Fake interactive table inputs | Static renderer truth |
| Registry change required in this task | Out of scope; residual policy compensates |

**BL-004 assumptions:** Unchanged. MBP elaborates MR-015–023; does not weaken role>archetype or residual visibility.

## Constraints for S65-BL-007

Prototype Option C on RNA A1/A3/A4/A6 first; add kitchen-sink unknown; wide planning/analysis table; verify no S4/S6 in learner chrome; reversible; no schema/GAM; page IA from BL-005 wraps activities unchanged.

## Unknowns

- Whether production should eventually register `planning_table` (data-path; not required for presentation rules)  
- Live-authored title quality vs fixture titles  
- Product intent for sample_output as always-open vs collapsed  

## Conclusion

**Option C (beat-and-role hybrid)** with a **7-role taxonomy**, deterministic type/beat maps, conflict precedence, title hygiene, and expanded residual/orphan/unknown policies makes material use legible while preserving validated sequence and failing safely.

**Next:** S65-BL-007 — Bounded renderer prototype.
