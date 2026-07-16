# Sprint 65 Archetype-Sensitive Manifestation Rules

## Task

**S65-BL-004 — Archetype-Sensitive Manifestation Rules**

Define a precise, prototype-ready ruleset for how `understand` / `apply` / `analyse` / `evaluate` may influence learner-facing activity presentation under the settled Composition C contract (S65-D17).

```text
Implementation status: Not started
```

Does **not** authorise production hardening.

## Scope and Constraints

**In scope:** Manifestation rules; label/order/emphasis policy; residual/unknown material policy; static demos under `experiments/`.

**Out of scope:** Production renderer/`app.js`/`lib`/CSS/tests; schema; GAM; Sprint 64 prototypes; inventing plan fields; S65-BL-005 page IA.

**Signals allowed for structure:** S1–S3 only. Content: S5. Never S4/S6 in learner chrome.

**Archetype may:** mode label · short verb · relative emphasis · bounded section order · support group labels · verification emphasis · reflect/extend placement · restrained icons with text.

**Archetype must not:** invent stages/criteria/relationships · rewrite bodies · suppress materials · create separate architectures · infer archetype from task wording · use unavailable plan fields.

## Evidence Base

| Item | Path |
| ---- | ---- |
| Contract recommendation | [`learner-activity-contract-comparison.md`](learner-activity-contract-comparison.md) |
| BL-003 mockups | [`experiments/learner-activity-contract-comparison/`](experiments/learner-activity-contract-comparison/) |
| Signal inventory | [`renderer-signal-inventory.md`](renderer-signal-inventory.md) |
| Baseline audit | [`baseline-learner-experience-audit.md`](baseline-learner-experience-audit.md) |
| Rule demos | [`experiments/archetype-sensitive-manifestation-rules/`](experiments/archetype-sensitive-manifestation-rules/) |

## Settled Contract

Shared core slots (omit empty):

1. Activity identity + optional mode cue  
2. Why  
3. Your task  
4. Produce  
5. How to approach it  
6. Support  
7. Check and improve  
8. Reflect or extend  

Fallback (missing/unsupported/malformed/unknown archetype):

```text
Consolidated core contract with no archetype-specific variation.
```

(= Composition B)

## Rule Model

| Level | Meaning |
| ----- | ------- |
| **R-MUST** | Required for contract coherence |
| **R-SHOULD** | Preferred; safe fallback exists |
| **R-MAY** | Optional for prototype testing |
| **R-MUST-NOT** | Prohibited |

Emphasis scale: **Primary** · **Secondary** · **Supporting** · **Optional**.

## Shared Core Contract Rules

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-MR-001 | R-MUST | Use the eight-slot Composition C/B contract; omit empty slots (S65-D20). |
| S65-MR-002 | R-MUST | `learner_task` is the primary action for all archetypes (S65-SIG-T01). |
| S65-MR-003 | R-MUST | Produce = `expected_output` only; Check = checklist only; do not merge (S65-D18). |
| S65-MR-004 | R-MUST | Why = preamble ± distinct bridge; Approach = reasoning; Reflect = self-explanation; Extend = transfer material preferred over duplicate prompt. |
| S65-MR-005 | R-MUST | Extra PEL cues (lens, evidence, structure, contrast, prior knowledge) use progressive disclosure — not equal open callouts. |
| S65-MR-006 | R-MUST | S4 diagnostics and S6 plan fields never appear in the learner contract. |
| S65-MR-007 | R-MUST | Do not invent archetype from task wording. |
| S65-MR-008 | R-MUST | Residual, unmatched, and unknown materials remain visible (S65-D19). |
| S65-MR-009 | R-MUST-NOT | Do not invent checklist criteria, stages, relationships, or output from other fields. |
| S65-MR-010 | R-MUST-NOT | Do not suppress materials because they fit poorly with archetype. |
| S65-MR-011 | R-MUST-NOT | Do not use colour-only mode differentiation. |
| S65-MR-012 | R-SHOULD | Prefer stable generic slot headings; vary support-group labels by archetype, not core slot names. |

## Understand Rules

**Mode:** Label `Understand` · Verb `Build distinctions from models, then practise.` · Icon: book/lightbulb with text · Header cue yes.

**Primary question (presentation framing only — not auto-inserted into body):**  
`What does this mean, and how do the ideas connect?`

| Dimension | Rule | Signals | Missing fallback | Prohibited inference |
| --------- | ---- | ------- | ---------------- | -------------------- |
| Mode cue | Show Understand + verb | A03 | No cue (fallback B) | Infer from title |
| Emphasis | Support (model) Primary; Task Secondary; Check Secondary; Reflect Supporting | M*, T01, V01, C05 | omit empty | — |
| Order | Header → Why? → Approach? → Task → Produce? → Support (model→explain→try) → Check → Reflect? | C*, T*, M* | skip missing | Reorder raw bodies destructively |
| Support groups | See an example → Understand the idea → Try it → Also available | worked_example, sample_output, text, tables | skip empty groups | Force missing example |
| Task | Heading `Your task`; dominant | T01 | required | — |
| Produce | Label `Produce`; product only | T02 | omit | Invent from checklist |
| Verification | Check for distinctions / coverage using source checklist | V01 | omit | Invent criteria |
| Reflect | After Check when self-explanation present | C05 | omit | — |
| Transfer | Extend last if present | C08 / transfer mat | omit | — |
| Residuals | Try it if workspace-like; else Also available before Check | S03 | — | Drop |
| A11y | Mode as text; headings h3 slots | — | — | Colour-only cue |

## Apply Rules

**Mode:** `Apply` · Verb `Use the procedure in a concrete case.`

**Primary question:** `How do I use this in a task or changed case?`

| Dimension | Rule | Signals | Missing fallback | Prohibited inference |
| --------- | ---- | ------- | ---------------- | -------------------- |
| Mode cue | Apply + verb | A03 | B | Infer apply from “plan” |
| Emphasis | Task Primary; Produce Primary; Try it Primary; Check Secondary; Extend Supporting | T01, T02, M* | omit empty | — |
| Order | Header → Why? → **Task** → **Produce?** → Approach? → Support (try emphasised; example before try when present) → Check → Extend? | — | skip | Put residuals after Check |
| Support groups | See an example → Scenario → Try it → Background → Also available | worked_example, scenario, planning/analysis tables, text | skip | Suppress planning_table |
| Task | Dominant; lists as steps if source is list | T01 | — | Merge transformation as task |
| Produce | Early, after task | T02 | omit | — |
| Verification | Completion / revise vs example using checklist | V01 | omit | Invent procedure checks |
| Transfer | After Check | transfer | omit | — |
| Residuals | Workspace-like (e.g. planning_table) **before** Check in Try it | S03 | Also available | Drop residual |

## Analyse Rules

**Mode:** `Analyse` · Verb `Interpret evidence against a model.`

**Primary question:** `What patterns, relationships or explanations can I identify?`

| Dimension | Rule | Signals | Missing fallback | Prohibited inference |
| --------- | ---- | ------- | ---------------- | -------------------- |
| Mode cue | Analyse + verb | A03 | B | — |
| Emphasis | Scenario/evidence Primary; Approach Secondary; Try it Primary; Check Secondary | scenario, C04, tables | omit | Invent dimensions |
| Order | Header → Why? → Approach? → Task → Produce? → Support (evidence → model → try) → Check → Reflect? | — | skip | Suppress orphan text |
| Support groups | Examine the evidence → See a model → Try it → Also available | scenario, modelling_note, analysis_table, text | skip | Invent evidence |
| Task | Dominant | T01 | — | — |
| Produce | Product of analysis | T02 | omit | — |
| Verification | Evidence coverage / interpretation using checklist | V01 | omit | Invent rubrics |
| Reflect | After Check if present | C05 | omit | — |
| Residuals | Unmatched explanation → Also available **before** Check | F12 | — | Drop orphan |

## Evaluate Rules

**Mode:** `Evaluate` · Verb `Judge options against explicit criteria.`

**Primary question:** `What judgement is best supported, and why?`

| Dimension | Rule | Signals | Missing fallback | Prohibited inference |
| --------- | ---- | ------- | ---------------- | -------------------- |
| Mode cue | Evaluate + verb | A03 | B | — |
| Emphasis | Task Primary; Produce Primary; Check Primary; Extend Supporting | T*, V01, transfer | omit | Invent criteria |
| Order | Header → Why? → **Task** → **Produce?** → Approach? → Support (context → decision workspace → worked judgement) → Check → **Extend?** | — | skip | Invent limitations text |
| Support groups | Decision context → Try it → See a worked judgement → Also available | scenario, decision_table, template, worked_example | skip | — |
| Task | Framed as decision/judgement action | T01 | — | Rewrite task |
| Produce | Decision product early | T02 | omit | — |
| Verification | Criteria coverage / trade-offs via source checklist | V01 | omit | Invent criteria items |
| Extend | After Check | transfer mat / C08 | omit | — |

## Fallback Rules

| Condition | Behaviour |
| --------- | --------- |
| Missing archetype | Composition B; no mode cue |
| Unsupported / malformed / unknown value | Same as missing |
| Valid enum only | `understand` \| `apply` \| `analyse` \| `evaluate` (case-normalise) |
| Never | Infer archetype from learner_task or materials |

Rules: **S65-MR-013** (R-MUST), **S65-MR-014** (R-MUST-NOT infer).

## Cross-Archetype Comparison

| Dimension | Understand | Apply | Analyse | Evaluate | Fallback |
| --------- | ---------- | ----- | ------- | -------- | -------- |
| Mode label | Understand | Apply | Analyse | Evaluate | none |
| Verb | Build distinctions… | Use the procedure… | Interpret evidence… | Judge options… | none |
| Leading emphasis | Model/example | Task + Try it | Evidence/scenario | Task + Produce | Task |
| Task placement | After Why/Approach | Early after header | After Approach | Early | Early |
| Output placement | After task | Early after task | After task | Early after task | After task if present |
| Support order | Example → Idea → Try | Try first · Example · Scenario | Evidence → Model → Try | Context → Try → Worked judgement | Source/beat/role |
| Verification | Distinctions | Completion | Evidence link | Criteria | Checklist as-is |
| Reflect | After Check | Rare | After Check | Rare | After Check if present |
| Transfer | Last | After Check | Last | After Check | After Check if present |
| Allowed variation | Emphasis + order + labels | Same | Same | Same | None |

## Material Role Mapping

Learner roles (not implementation types): **Understand the idea** · **See an example** · **Examine the evidence** · **Try it** · **Record your response** · **Check your work** · **Extend your thinking** · **Also available**.

| Material type | Default role | Understand | Apply | Analyse | Evaluate | Fallback |
| ------------- | ------------ | ---------- | ----- | ------- | -------- | -------- |
| text / reading_text / support_text | Understand the idea | Idea | Background | Also available if unmatched | Background | Idea / Also available |
| worked_example | See an example | **Lead** | Before Try it | See a model | See a worked judgement | See an example |
| sample_output | See an example | With example | With example | Supporting | Supporting | See an example |
| modelling_note | See a model | Supporting | Supporting | **Lead with evidence** | Supporting | See a model |
| scenario | Examine the evidence | Supporting | Scenario before/near Try | **Lead** | Decision context | Evidence |
| classification_table / analysis_table / planning_table / decision_table / worksheet / template | Try it / Record | Try it | **Try it (planning emphasised)** | Try it | Try it (decision) | Try it |
| checklist / evaluation_checklist | Check your work | Check | Check | Check | Check | Check |
| transfer_prompt | Extend | Extend | Extend | Extend | **Extend after Check** | Extend |
| consolidation_summary / summary | Understand the idea | Idea | Background | Supporting | Supporting | Idea |
| unknown / unregistered | Also available (keep title+body) | Also available | Try it if table-like else Also available | Also available | Also available | Always visible |

**S65-MR-015** (R-MUST): Material role (from type/beat) wins for semantic placement; archetype may only change emphasis/order within Support.  
**S65-MR-016** (R-MUST): Do not use raw type names (`text`, `transfer_prompt`) as learner headings when a role label or material title exists. Prefer material title when non-fixture; else role label.

## Beat and Ordering Rules

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-MR-017 | R-MUST | When `resolveBeatMaterialPlan` assigns materials, preserve beat order for assigned groups. |
| S65-MR-018 | R-SHOULD | Manifest beat functions via learner role labels (See an example / Try it / Check…), not raw `explanation`/`guided_practice` strings. |
| S65-MR-019 | R-MUST | Within a group, preserve relative source/`_render_sequence` order. |
| S65-MR-020 | R-MUST | Valid beat mapping wins for assigned materials over naive source flat order. |

Do not require registry schema changes in this task; demos assume residual policy compensates for gaps (e.g. `planning_table`).

## Residual and Unknown Material Rules

**Deterministic residual policy (S65-MR-021 R-MUST):**

1. Collect materials not assigned to a valid beat group (or all materials if no beat plan), preserving source/`_render_sequence` order.  
2. Classify each by material-role mapping when type known.  
3. Place **Try it / Record** residuals **before** Check and improve.  
4. Place **Extend** residuals **after** Check.  
5. Place otherwise unclassified under **Also available** (still before Check unless clearly Extend).  
6. **Never suppress.**

**Unmatched episodeFunctions (S65-MR-022 R-MUST):** Retain; apply role mapping; do not invent beat membership; developer diagnostic may log separately (S4), not in learner chrome.

**Unknown / unregistered types (S65-MR-023 R-MUST):** Preserve title + body; role = Also available (or Try it if clearly a table/workspace by structure); never silent loss.

## Heading and Label Rules

| Slot | Canonical label | Archetype may change? |
| ---- | --------------- | --------------------- |
| Why | Why this activity | No |
| Task | Your task | No |
| Produce | Produce | No (`Expected decision` MAY only as subtitle under Evaluate — R-MAY S65-MR-024) |
| Approach | How to approach it | No |
| Support | Support | No |
| Check | Check and improve | No |
| Reflect | Reflect | No |
| Extend | Extend your thinking | No |

Support **sub**-labels vary by archetype (tables above).  
**S65-MR-025** (R-SHOULD): If material has a clear non-fixture title, use it as h4 under the role group; avoid stacked role + type + title.  
**S65-MR-026** (R-MUST-NOT): Fixture-test titles matching `isFixtureTestMaterialTitle` should not be preferred learner headings (prefer role label + body).

## Visual and Structural Rules

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-MR-027 | R-MUST | Task (+ Produce when present) visually dominant over Support. |
| S65-MR-028 | R-MUST | Mode cue = text (± icon with accessible name); not colour alone. |
| S65-MR-029 | R-SHOULD | One card/region per activity; avoid nested cards for every material. |
| S65-MR-030 | R-SHOULD | Progressive disclosure via native `<details>`/accessible disclosure. |
| S65-MR-031 | R-MUST | Mobile: single column; mode cue wraps with title; tables in scroll container. |
| S65-MR-032 | R-MUST | Print: retain slot order; expand or inline learner-relevant collapsed guidance; hide S4 meta. |
| S65-MR-033 | R-MUST-NOT | Unique colour theme per archetype as primary differentiation. |
| S65-MR-034 | R-MAY | Restrained semantic icons matching role (example/check/try) with text. |

Exact CSS tokens deferred to prototype (BL-007).

## Accessibility Rules

| Rule ID | Level | Rule |
| ------- | ----- | ---- |
| S65-MR-035 | R-MUST | One coherent heading hierarchy (activity h3; slots h4 or labelled regions). |
| S65-MR-036 | R-MUST | Mode cue programmatically available as text. |
| S65-MR-037 | R-MUST | Checklists as lists; tables with headers. |
| S65-MR-038 | R-MUST | Focus order follows visual/reading order. |
| S65-MR-039 | R-SHOULD | Support groups as labelled sections/headings. |
| S65-MR-040 | R-MAY | `aria-label` on mode badge repeating visible text. |

Prototype must validate keyboard disclosure + print expansion (**S65-MR-041** R-SHOULD validate in BL-007). No WCAG claim.

## Sparse-Input Rules

| Case | Manifestation |
| ---- | ------------- |
| Title + task only | Header (± mode) + Your task (+ materials if any) |
| No archetype | B contract |
| No expected_output | Omit Produce |
| No cognition | Omit Why / Approach / Reflect unless other valid signal |
| No checklist | Omit Check unless other verification material |
| No beat plan | Role-group / source order + residual policy |
| Unknown type | Title+body under Also available / Try it |

**S65-MR-042** (R-MUST).

## Rich-Input Rules

When all optionals present:

1. Single Why region (preamble + bridge sublines).  
2. Approach = reasoning; other PEL in disclosure.  
3. One Task, one Produce, one Check region.  
4. Transformation only if non-redundant with task → under Approach/Support.  
5. Transfer material wins over duplicate transfer prompt.  
6. Sample output stays in Support (model), not merged into Produce or Check.

**S65-MR-043** (R-MUST) · **S65-MR-044** (R-SHOULD progressive PEL).

## Conflict Resolution

| Conflict | Winner |
| -------- | ------ |
| Archetype vs material role | **Material role** for placement; archetype for emphasis only (MR-015) |
| Valid beat order vs source order | **Beat order** for assigned; source within group (MR-017/019) |
| Expected output vs workspace | Output = product meaning; workspace = Try it |
| Transfer prompt vs transfer material | **Material** primary |
| Checklist vs sample output | Both; different regions |
| Preamble vs bridge | One Why; distinct substructure; no blind concatenate |
| Fixture title vs role label | Role label preferred (MR-026) |

## Example Applications

### RNA A1 — understand

| Section | Signals | Rule | Manifestation | Residual |
| ------- | ------- | ---- | ------------- | -------- |
| Header | title, duration, grouping, archetype | Understand cue | Mode + title + badges | — |
| Task | learner_task | MR-002 | Your task dominant | — |
| Produce | expected_output | MR-003 | Completed classification table (strip checklist restatement) | — |
| Support | text, worked_example, sample_output, classification_table | Understand order | Example → Idea → Try it | none |
| Check | checklist | MR-003 | criteria only | — |

### RNA A3 — apply + residual planning_table

| Section | Signals | Rule | Manifestation | Residual |
| ------- | ------- | ---- | ------------- | -------- |
| Header | apply | Apply cue | Mode + verb | — |
| Task / Produce | T01/T02 | Apply early | Task then Produce | — |
| Support | text, scenario, planning_table | MR-021 | Scenario + **Try it = planning table before Check** | planning_table not after Check |
| Check | checklist | — | criteria | — |

### RNA A4 — analyse + orphan text

| Section | Signals | Rule | Manifestation | Residual |
| ------- | ------- | ---- | ------------- | -------- |
| Support | modelling_note, scenario, analysis_table, text | Analyse order + MR-022 | Evidence → Model → Try it; text in Also available | orphan text visible |
| Check | checklist | — | criteria | — |

### RNA A6 — evaluate + transfer

| Section | Signals | Rule | Manifestation | Residual |
| ------- | ------- | ---- | ------------- | -------- |
| Task/Produce | T01/T02 | Evaluate early | Decision task + product | — |
| Support | scenario, decision_table, template, worked_example | Evaluate groups | Context → Try it → Worked judgement | — |
| Check | checklist | — | criteria | — |
| Extend | transfer_prompt | After Check | Extend your thinking | — |

### Marx A3 — rich framing, no archetype

| Section | Signals | Rule | Manifestation |
| ------- | ------- | ---- | ------------- |
| Header | title, duration | Fallback B | No mode |
| Why | preamble + bridge | MR-004 | One Why region |
| Approach | reasoning + PEL | MR-005/044 | Reasoning open; PEL in details |
| Task | learner_task | — | Dominant |
| Produce | — | omit | — |
| Reflect | self_explanation | After support/check | Reflect |

### KS-A4 — minimal

| Section | Signals | Rule | Manifestation |
| ------- | ------- | ---- | ------------- |
| Header | title | B | Title only |
| Task | learner_task | — | Your task only |
| All else | — | MR-042 | Omitted |

## Master Rules Register

| Rule ID | Level | Rule (short) | Applies to | Evidence | Prototype validation? |
| ------- | ----- | ------------ | ---------- | -------- | --------------------- |
| S65-MR-001 | R-MUST | Eight-slot contract; omit empty | All | D17/D20 | No |
| S65-MR-002 | R-MUST | Task primary | All | BL-003 | No |
| S65-MR-003 | R-MUST | Produce≠Check | All | D18/F16 | Yes (dedupe edge cases) |
| S65-MR-004 | R-MUST | Why/Approach/Reflect/Extend placement | All | D18 | No |
| S65-MR-005 | R-MUST | PEL progressive | Rich | F01/F17 | Yes |
| S65-MR-006 | R-MUST | No S4/S6 in contract | All | D16 | No |
| S65-MR-007 | R-MUST | No archetype inference | Fallback | F10 | No |
| S65-MR-008 | R-MUST | Residuals visible | All | D19 | Yes |
| S65-MR-009 | R-MUST-NOT | No invent criteria/output | All | Ceiling | No |
| S65-MR-010 | R-MUST-NOT | No suppress materials | Archetype | F18 | No |
| S65-MR-011 | R-MUST-NOT | No colour-only mode | Visual | A11y | Yes |
| S65-MR-012 | R-SHOULD | Stable core headings | Labels | BL-003 | No |
| S65-MR-013 | R-MUST | Invalid archetype → B | Fallback | D17 | No |
| S65-MR-014 | R-MUST-NOT | Infer archetype from wording | Fallback | F10 | No |
| S65-MR-015 | R-MUST | Role > archetype for placement | Materials | BL-002 | Yes |
| S65-MR-016 | R-MUST | No raw type learner headings | Materials | F04b | Yes |
| S65-MR-017 | R-MUST | Preserve valid beat order | Beats | F09 | Yes |
| S65-MR-018 | R-SHOULD | Beat → role labels | Beats | F03 | Yes |
| S65-MR-019 | R-MUST | Source order within groups | Beats | BL-002 | No |
| S65-MR-020 | R-MUST | Beat wins for assigned | Beats | BL-002 | Yes |
| S65-MR-021 | R-MUST | Residual policy 1–6 | Residuals | F11/F20 | Yes |
| S65-MR-022 | R-MUST | Unmatched episodeFunctions keep | Residuals | F12 | Yes |
| S65-MR-023 | R-MUST | Unknown types visible | Unknown | BL-002 tests | Yes |
| S65-MR-024 | R-MAY | Evaluate Produce subtitle | Evaluate | BL-003 | Yes |
| S65-MR-025 | R-SHOULD | Prefer material title | Labels | F04b | Yes |
| S65-MR-026 | R-MUST-NOT | Prefer fixture titles | Labels | isFixtureTest… | Yes |
| S65-MR-027 | R-MUST | Task/Produce dominant | Visual | BL-003 | Yes |
| S65-MR-028 | R-MUST | Mode as text | A11y | MR-011 | Yes |
| S65-MR-029 | R-SHOULD | Limit card nesting | Visual | Density | Yes |
| S65-MR-030 | R-SHOULD | Accessible disclosure | Rich | F14 | Yes |
| S65-MR-031 | R-MUST | Mobile single column | Responsive | BL-001 | Yes |
| S65-MR-032 | R-MUST | Print order / expand guidance | Print | BL-001 | Yes |
| S65-MR-033 | R-MUST-NOT | Colour theme as primary cue | Visual | A11y | No |
| S65-MR-034 | R-MAY | Icons with text | Visual | BL-003 | Yes |
| S65-MR-035 | R-MUST | Heading hierarchy | A11y | BL-001 | Yes |
| S65-MR-036 | R-MUST | Mode text exposed | A11y | — | Yes |
| S65-MR-037 | R-MUST | Lists/tables semantic | A11y | — | No |
| S65-MR-038 | R-MUST | Focus = reading order | A11y | — | Yes |
| S65-MR-039 | R-SHOULD | Support as sections | A11y | — | Yes |
| S65-MR-040 | R-MAY | aria-label on mode | A11y | — | Yes |
| S65-MR-041 | R-SHOULD | Validate disclosure+print | Prototype | — | Yes |
| S65-MR-042 | R-MUST | Sparse omit empty | Sparse | D20/F14 | Yes |
| S65-MR-043 | R-MUST | Rich: one Task/Produce/Check | Rich | F17 | Yes |
| S65-MR-044 | R-SHOULD | Rich PEL in details | Rich | F01 | Yes |

**Count:** 44 rules (S65-MR-001 … S65-MR-044).

## Rules Requiring Prototype Validation

MR-003, 005, 008, 011, 015–018, 020–023, 024–027, 028–032, 034–036, 038–044 — especially residual placement, type-label suppression, progressive PEL, print/keyboard.

## Rejected Rules

| Rejected idea | Why |
| ------------- | --- |
| Separate component tree per archetype | Violates bounded variation; complexity |
| Auto-insert primary question into body | Invents content unless authored |
| Infer archetype from task verbs | MR-014 / F10 |
| Hide unmatched materials to “fit” mode | MR-010 / F18 |
| Colour-coded archetype themes as primary cue | MR-011/033 |
| Merge checklist into Produce | Breaks D18 |
| Use instructional_function / plan_beat_index | S65-D15 unsafe |
| Expose raw beat function enums as learner headings | F03 confusion |
| Unique Success-first order for understand only | Undoes task primacy |

## Constraints for S65-BL-005 and S65-BL-007

**BL-005 (page IA):** Must not re-print overview into activity Why; journey nav remains page-level; mode cues are activity-local.

**BL-007 (prototype):** Implement MR register against Composition C; test RNA A1/A3/A4/A6, Marx A3, KS-A4; validate residual + unknown; no schema/GAM; reversible; diagnostics stay gated.

## Conclusion

The shared consolidated contract remains one architecture. Archetypes add **bounded** cues and Support emphasis only. Fallback is Composition B. Residuals and unknowns stay visible under a deterministic policy. Rules S65-MR-001–044 are ready for S65-BL-007 prototyping without further design invention of hidden structure.

**Next:** S65-BL-005 — Page-level information architecture.
