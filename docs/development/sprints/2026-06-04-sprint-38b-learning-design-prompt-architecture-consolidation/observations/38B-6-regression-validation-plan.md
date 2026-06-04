# Slice 38B-6 — Regression validation plan

**Date:** 2026-06-04  
**Status:** **COMPLETE** (implementation-ready framework — no code changes in this slice)  
**Checklist:** [probe-38B-6-regression-validation-checklist.md](../fixtures/probe-38B-6-regression-validation-checklist.md)  
**Inputs:** [38B-1](38B-1-prompt-audit.md), [38B-2](38B-2-instruction-taxonomy.md), [38B-3](38B-3-design-page-consolidation-plan.md), [38B-4](38B-4-materials-and-table-fidelity.md), [38B-5](38B-5-workflow-wide-review.md)

---

## Success criterion

Any LD prompt consolidation (shared modules, GAM, DLA, Design Page) must be validated against a **layer-aligned assertion set**, **minimum anchor coverage**, **precedence adversarial checks**, and **wave-specific pass/fail gates** before implementation PR merge. This document defines the framework only; test and runtime changes belong to the implementation phase.

---

## Scope and non-goals

| In scope | Out of scope (38B-6) |
|----------|----------------------|
| Assertion design, automation classification, anchors, matrix, sign-off | Writing or modifying `app.js`, pack prompts, or `tests/*.test.js` |
| Referencing existing tests/fixtures as validation sources | Live LLM reruns (required at implementation sign-off, not in planning slice) |
| Future automated checks (named, not implemented) | Renderer, VEU, Sprint 38 schema, image pipeline |

---

## Validation framework overview

```text
Baseline (38B-1 probe) → Change under test → Layer assertions (L0–L8)
  → Precedence adversarial (PREC) → Anchor matrix (Inflation + others)
  → Phase gate (Wave 1–4) → Checklist sign-off → Merge approval
```

**Normative precedence** (from [38B-2](38B-2-instruction-taxonomy.md)) must hold in outputs even when prompts compress rhetoric or overview prose.

---

## 1. Layer → validation assertions (L0–L8)

Each assertion has an ID, layer, description, and execution mode.

**Modes:** `AUTO` = runnable today without new code; `AUTO*` = planned automation (spec only); `MANUAL` = human review or live LLM rerun; `PROBE` = `scripts/probe-38b1-ld-workflow-prompt-audit.js` or Design Page size probe.

### L0 — Core task

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L0-01 | Step output type matches step contract (page JSON vs activity_materials vs assessment_items vs sequence) | AUTO | Step-specific workflow tests |
| L0-02 | Design Page performs read-only composition (no fabricated upstream entities) | MANUAL | JSON diff vs upstream artefacts; `source_artefacts` booleans |
| L0-03 | GAM/DLA do not emit final `learning_activities[]` page shape | AUTO | Workflow step pattern tests |

### L1 — Hard output schema

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L1-01 | Page root includes required keys when affordances used: `visual_affordance_schema_version`, reviews, `visual_affordances[]` | AUTO | `tests/sprint-38-visual-affordances.test.js` |
| L1-02 | `sections[]` structure valid; `learning_activities` section present on Design Page output | AUTO | Page render / export pipeline tests |
| L1-03 | Assessment section preserves item array shape when upstream provided | AUTO* / MANUAL | Assessment workflow + anchor Marx/Inflation |
| L1-04 | Enum / internal field sanitisation does not drop required learner fields | MANUAL | Spot-check composed JSON |

### L2 — Source / content fidelity

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L2-01 | No invented activities, scenarios, or assessment items vs upstream IDs | MANUAL | Upstream JSON ↔ page diff |
| L2-02 | Numeric and named entities in scenarios preserved (names, £/$/% where upstream had them) | MANUAL | Inflation A1–A5 textual diff |
| L2-03 | **Precedence PREC-03:** enrichment blocks did not cause fabricated source claims | MANUAL | Epistemic grounding / source_artefacts review |
| L2-04 | Pack + runtime still cite upstream-only grounding after consolidation | PROBE | Prompt contains single L2 authority (no contradicting “invent” examples) |

### L3 — Activity composition (membership, sequence)

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L3-01 | Every upstream `activity_id` appears in page unless listed in `activities_omitted[]` / `generation_notes` | AUTO | `tests/utility-ld-inflation-page-render.test.js` (full fixture activity coverage) |
| L3-02 | Strict export does not silently drop activities (e.g. missing A2) | AUTO | Inflation missing-A2 fixture tests |
| L3-03 | `learning_sequence` order respected; no reorder without note | MANUAL | Sequence vs page section order |
| L3-04 | **Precedence PREC-03:** membership not reduced to shorten page | MANUAL | Activity count vs upstream |

### L4 — Structured materials + table fidelity

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L4-01 | Per-activity `materials` object non-empty when upstream `activity_materials` present | AUTO | `tests/design-page-materials-fidelity.test.js` |
| L4-02 | `pageActivityMaterialsHaveRichContent` true; `pageActivityMaterialsLookPlaceholderOnly` false | AUTO | `lib/design-page-materials-fidelity.js` |
| L4-03 | Named table keys (`analysis_table`, `comparison_table`, `impact_table`, …) contain body text, not label-only | AUTO | Placeholder regex in fidelity lib |
| L4-04 | **No comma-row anti-pattern** (`Scenario 1,,,`, trailing `,,,` rows) in table fields | AUTO* | [38B-4](38B-4-materials-and-table-fidelity.md) B4-01, B4-02 — detector TBD |
| L4-05 | **Pipe table fidelity:** `\| col \|` header + separator + ≥1 data row in expected fields | AUTO* / MANUAL | Inflation full fixture; `utility-ld-inflation-page-render.test.js` |
| L4-06 | **No `Headers` / `Rows` pseudo-structure** as substitute for named pipe field | AUTO* / MANUAL | B4-02 |
| L4-07 | GAM `activity_materials` preserves pipes before Design Page merge | MANUAL | Upstream GAM artefact capture on Inflation rerun |
| L4-08 | **Precedence PREC-01:** table rows not shortened for brevity (column count ≥ upstream) | MANUAL | Column header diff |
| L4-09 | **Precedence PREC-02:** `activity.materials` length/detail ≥ overview fields when conflict | MANUAL | Char/token compare materials vs `learning_purpose` / overview |

### L5 — Pedagogical preservation

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L5-01 | `reasoning_orientation`, bridges, cognition fields preserved when upstream/brief require | MANUAL | Marx, Inflation learner-visibility fixture |
| L5-02 | Worked example / faded template content present, not answer-only | MANUAL | Inflation A1 patterns; learner-visibility fixture |
| L5-03 | PEL orientation fields not emptied by consolidation | MANUAL | DLA → page field trace |
| L5-04 | Rhetoric consolidation does not remove L4 table rules from effective prompt | PROBE | Augmented prompt includes `LD-TABLE-FIDELITY` ref |

### L6 — Visual affordance metadata (page root only)

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L6-01 | `visual_affordance_schema_version` = `38.4` when affordances present | AUTO | Sprint 38 tests |
| L6-02 | Valid affordance rows survive compose (type, ids, pedagogical_added_value) | AUTO | `tests/sprint-38-pedagogical-added-value.test.js` |
| L6-03 | **Precedence PREC-04:** `activity.materials` unchanged when affordances added/updated | AUTO | `design-page-materials-fidelity.test.js` (rich materials + affordances) |
| L6-04 | `representation_avoid` / duplicate rules not applied to page tables | MANUAL | Prompt + output: no table keys in avoid lists |
| L6-05 | Climate mechanism/evidence affordances render with hooks | AUTO | `tests/utility-visual-affordance-hooks.test.js` (climate fixture) |

### L7 — Rendering compatibility

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L7-01 | Math delimiters valid; no broken TeX in exported HTML | MANUAL | HTML export spot-check |
| L7-02 | Pipe tables not wrapped in code fences inside `materials` values | MANUAL | JSON string inspect |
| L7-03 | Markdown tables not embedded inside bullet-list strings | MANUAL | Inflation render tests (list vs table) |
| L7-04 | Learner voice: no facilitator-only headings in learner profile | MANUAL | Marx + self-directed brief tests |
| L7-05 | **Precedence:** math rules coexist with pipe syntax (tables still parse) | AUTO | Inflation full render tests for A2/A3 tables |

### L8 — Validation / QA checklist

| ID | Assertion | Mode | Primary source |
|----|-----------|------|----------------|
| L8-01 | Full test suite green | AUTO | `node --test tests/*.test.js` |
| L8-02 | Augmented prompt size documented vs 38B-1 baseline | PROBE | `probe-38b1-ld-workflow-prompt-audit.js` |
| L8-03 | Distinct runtime append markers ≤ phase target | PROBE | Block marker count in probe output |
| L8-04 | Signed [checklist](../fixtures/probe-38B-6-regression-validation-checklist.md) attached to PR | MANUAL | Process |

---

## 2. Automation vs manual summary

| Mode | Count (approx) | When to use |
|------|----------------|-------------|
| **AUTO** | 14 | Every PR; must pass before review |
| **AUTO*** | 5 | Implementation phase adds detectors; until then use MANUAL equivalent |
| **PROBE** | 4 | Prompt consolidation PRs; compare to 38B-1 baselines |
| **MANUAL** | 18 | Live rerun anchors + HTML spot-check + precedence adversarial |

**Rule:** A phase gate cannot be **PASS** if any **P0** assertion fails on the **mandatory** anchor (Inflation). **AUTO*** failures on L4-04–L4-06 must be executed via MANUAL until detectors land.

### Planned automation backlog (implementation phase only — do not implement in 38B-6)

| ID | Detector intent | Suggested home |
|----|-----------------|----------------|
| L4-04 | Comma-row / `,,,` cluster regex on `materials` leaves | `lib/design-page-materials-fidelity.js` + new test file |
| L4-05 | Minimum pipe table row/column counts per key | Shared with GAM table author tests |
| L4-06 | Reject standalone `Headers\n` + `Rows\n` blocks in materials strings | Same lib |
| L1-03 | Assessment item count/hash vs upstream | Assessment workflow test |

---

## 3. Minimum anchor coverage

| Anchor | Fixture(s) | Tier | Required layers | Minimum assertions |
|--------|------------|------|-----------------|-------------------|
| **Inflation** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`, `ld-inflation-workshop-learner-visibility-page.json`, upstream `ld-inflation-workshop-upstream-learning-activities.json` | **MANDATORY** | L0–L8 (full) | All L4 table/materials assertions; L3-01/02; L6-03; PREC-01–04; B4-01–B4-03 |
| **Climate** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | **Required** | L4–L6 | L4-01–03; L6-01–02, L6-05; mechanism affordance ids |
| **CI** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | **Required** | L4, L7 | L4-05 multi-table; L7-05 render; B4-04 |
| **Marx** | `tests/fixtures/page-render/marx-self-study-page.json`, `marx-self-study-design-quality-page.json`, `tests/fixtures/workflow-brief/marx-dla-procedural-output.json` | **Required** | L2, L5, L7 | L5-01, L7-04; self-study voice; no facilitator leak |
| Learner visibility (Inflation) | `ld-inflation-workshop-learner-visibility-page.json` | Recommended | L5, L7 | Worked example + template tables |

**Coverage rule**

- **Implementation PR (any wave):** Inflation **MANUAL live rerun** or recorded golden JSON diff **required**.
- **Design Page / GAM table changes:** Inflation + CI **required**.
- **Sprint 38 / affordance prompt changes:** Inflation + Climate **required**.
- **Rhetoric / voice consolidation:** Inflation + Marx **required**.
- **Shared module Wave 1:** Inflation fixture-based AUTO suite + PROBE on all four heavy steps.

---

## 4. Precedence rule validation (adversarial)

These checks prove [38B-2](38B-2-instruction-taxonomy.md) normative rules survive consolidation, not just happy-path fixtures.

| ID | Rule | Adversarial check | Pass | Fail |
|----|------|-------------------|------|------|
| **PREC-01** | Table fidelity > brevity | Compare upstream pipe table column headers vs output for Inflation A2/A3/A4; inspect for comma-row substitution | All table keys match pipe shape or documented structured rows; no `,,,` rows | Comma rows, header/row prose split, or &lt;50% column retention |
| **PREC-02** | Materials fidelity > overview prose | When `learning_purpose` / session overview shortened, `materials` fields retain scenario numbers and table bodies | Materials char count ≥ baseline golden per activity OR merged fixture parity | Rich overview + empty/thin `materials` |
| **PREC-03** | Source fidelity > enrichment | Activity count and assessment items match upstream; no new IDs | Counts match; `activities_omitted` explains gaps | Silent drop or invented activities/items |
| **PREC-04** | Visual affordances additive only | Diff page with/without affordance generation: `materials` deep-equal | Materials unchanged except documented merge from upstream | Materials replaced by affordance summary or figure caption text |

**Execution:** PREC-01–04 are **MANUAL** on live rerun for Design Page gate; **PREC-04** partial coverage via **AUTO** coexistence test today.

---

## 5. Phase pass/fail criteria (consolidation waves)

Aligned with [38B-5](38B-5-workflow-wide-review.md) waves. A phase **FAIL** blocks the next wave.

### Wave 1 — Shared module extraction

| Criterion | Pass | Fail |
|-----------|------|------|
| Module IDs deployed | `LD-TABLE-FIDELITY`, `LD-MATERIALS-COPY`, `LD-MATH-RENDER`, `LD-SELF-DIRECTED-RHETORIC` each have **one** authoritative text; steps reference modules | Duplicate contradictory table/materials rules remain in 2+ append blocks |
| Precedence text | Global ladder + four PREC rules present in `LD-TABLE-FIDELITY` / materials module | “Synthesise session” or “shorten” without L4 override sentence |
| Regression | L8-01 AUTO green; Inflation L4-01–L4-03 AUTO unchanged | Any existing fidelity test fails |
| Prompt probe | L8-02: total augmented chars for DLA+GAM+Design Page+Assessment ↓ ≥15% vs 38B-1 **or** documented deferral | Size increases without justification |
| Anchors | Inflation AUTO suite; PROBE on 4 heavy steps | — |

### Wave 2a — GAM consolidation

| Criterion | Pass | Fail |
|-----------|------|------|
| Append units | ≤3 runtime markers on GAM (probe) | Still ≥9 rhetoric markers + separate table block |
| Table author | L4-07 PASS on Inflation GAM artefact rerun: pipes in `activity_materials` | B4-01/B4-02 shapes at GAM output |
| Row adequacy | Single `LD-TABLE-FIDELITY` includes row adequacy (no orphan GAM-only block) | Table rules only on Design Page |
| Anchors | Inflation upstream materials path; CI if multi-table GAM touched | — |

### Wave 2b — DLA consolidation

| Criterion | Pass | Fail |
|-----------|------|------|
| Spec-only | DLA output still specifications-only (L0-03); `required_materials` types preserved | Pipe tables appear in DLA JSON output |
| Vocabulary | `required_materials` entries reference pipe table realisation per `LD-TABLE-FIDELITY` | Weak “table description” only specs |
| Size | Augmented ≤28k chars or ≤3 append units | ≥39k with duplicate rhetoric |
| Anchors | Marx DLA procedural fixture; Climate brief grounding test | Facilitator leak regression |

### Wave 3 — Design Page consolidation

| Criterion | Pass | Fail |
|-----------|------|------|
| Contract shape | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` covers L0–L4 + L8 per [38B-3](38B-3-design-page-consolidation-plan.md) | Materials/table rules only in notes, not L4 |
| Size | Augmented prompt ≤22,000 chars (self-directed probe) | &gt;30k without waiver |
| Markers | ≤3 append units (compose + Sprint 38 rider + brief rhetoric ref) | ≥10 distinct blocks |
| Inflation gate | PREC-01–04 PASS; B4-01–B4-03 PASS; L4-04–L4-06 PASS (MANUAL until AUTO*) | Any P0 matrix row (below) |
| Sprint 38 | L6-01–L6-03 AUTO; Climate L6-05 if affordance block touched | Affordance drops or schema drift |
| Render | Inflation full + CI multitable render tests green | Table HTML regression |

### Wave 4 — Assessment + Sequence + foundation

| Criterion | Pass | Fail |
|-----------|------|------|
| Assessment | L1-03; L9 cluster preserved; rhetoric via shared module only | Item count shrink |
| Sequence | L3-03 pack trim; learner overview wording aligned with L12 scope | Facilitator headings in learner exports |
| Anchors | Marx assessment path; optional Climate assessment count test | — |

---

## 6. Regression matrix

**Severity:** **P0** = ship blocker; **P1** = must fix before wave close; **P2** = acceptable with documented waiver (overview-only thinning).

| Layer | Failure mode | Anchor | Test source | Sev |
|-------|--------------|--------|-------------|-----|
| L0 | Wrong artefact type emitted | — | Workflow step tests | P0 |
| L1 | Invalid/missing Sprint 38 schema version | Climate, Inflation | `sprint-38-visual-affordances.test.js` | P0 |
| L1 | Assessment items dropped or retyped | Inflation, Marx | MANUAL diff / workflow assessment tests | P0 |
| L2 | Invented scenario content | Inflation | MANUAL upstream diff | P0 |
| L2 | Source claims without upstream | Climate | `workflow-ld-epistemic-grounding.test.js` | P1 |
| L3 | Missing activity in page | Inflation | `utility-ld-inflation-page-render.test.js` | P0 |
| L3 | A2 recovery from wrong section | Inflation | missing-A2 fixture tests | P0 |
| L4 | Placeholder-only materials | Inflation | `design-page-materials-fidelity.test.js` | P0 |
| L4 | Comma-row tables (`Scenario 1,,,`) | Inflation | [38B-4](38B-4-materials-and-table-fidelity.md) B4-01; AUTO* TBD | P0 |
| L4 | Headers/Rows prose table | Inflation | B4-02; MANUAL | P0 |
| L4 | Pipe table → CSV worksheet shape | Inflation | `ld-inflation-workshop-csv-worksheet-page.json` render tests | P1 |
| L4 | Multi-table field loss | CI | `confidence-interval-a2-multitable-page.json` + render tests | P0 |
| L4 | GAM upstream pipes lost before merge | Inflation | MANUAL GAM artefact | P0 |
| L5 | Worked example collapsed to answer | Inflation | learner-visibility fixture; MANUAL | P1 |
| L5 | Reasoning orientation stripped | Marx | `marx-self-study-page.json`; MANUAL | P1 |
| L6 | Affordances drop on compose | Climate | Sprint 38 + hooks tests | P1 |
| L6 | Materials replaced by affordance text | Inflation | materials + affordances coexist test | P0 |
| L6 | Table listed in `representation_avoid` | Climate | MANUAL prompt inspect | P1 |
| L7 | Facilitator heading in learner page | Marx | `workflow-self-directed-activity-framing-adoption.test.js` | P1 |
| L7 | Math breaks pipe table parse | CI, Inflation | render tests L7-05 | P0 |
| L7 | Tables inside bullet strings | Inflation | `utility-ld-inflation-page-render.test.js` | P1 |
| L8 | Test suite regression | — | `node --test tests/*.test.js` | P0 |
| L8 | Prompt size regression | All heavy steps | `probe-38b1-ld-workflow-prompt-audit.js` | P1 |
| PREC | Overview shortened, materials thinned | Inflation | PREC-02 MANUAL | P0 |
| PREC | Rhetoric wins over table rules | Inflation | PREC-01 MANUAL | P0 |
| PREC | Enrichment drops activities | Inflation | PREC-03 MANUAL | P0 |

---

## 7. Implementation-phase sign-off process

### 7.1 Roles

| Role | Responsibility |
|------|----------------|
| **Author** | Runs checklist, attaches probe output, records anchor diffs |
| **Reviewer** | Independent MANUAL anchor review (minimum Inflation HTML + JSON) |
| **Sprint owner** | Wave gate approval; waivers for P2 only |

### 7.2 Baseline capture (once per implementation programme)

1. Record 38B-1 augmented char counts per step (self-directed brief).  
2. Export probe marker list (block names).  
3. Tag current `ld-inflation-workshop-page-full.json` materials excerpt as **golden reference** for B4-01–03 (or attach live rerun JSON when available).  
4. Record test count baseline (e.g. 706 pass).

### 7.3 Per-PR workflow

```text
1. Identify wave (1–4) + touched steps
2. Run AUTO + PROBE from checklist
3. Run mandatory anchors for change type (§3)
4. Execute PREC adversarial set if Design Page or L4 module touched
5. Fill checklist sign-off table
6. Reviewer sign-off
7. Sprint owner wave gate (§5)
```

### 7.4 Gate decisions

| Decision | Condition |
|----------|-----------|
| **MERGE APPROVED** | Wave pass criteria met; checklist signed; no open P0 on Inflation |
| **MERGE WITH WAIVER** | P2 only; waiver documents field + anchor + expiry (next PR must clear) |
| **HOLD** | Any P0 on mandatory anchor or L8-01 failure |
| **ROLLBACK** | Post-merge Inflation live rerun fails PREC-01 or L4-04 |

### 7.5 Programme completion (38B implementation exit)

- [ ] Waves 1–3 complete per [38B-5](38B-5-workflow-wide-review.md)  
- [ ] All four required anchors pass PREC + L4 on live or golden JSON  
- [ ] 38B-4 case matrix B4-01–B4-04 closed or waived with owner sign-off  
- [ ] Probe: Design Page augmented ≤22k; ≤3 markers  
- [ ] 38B-7 governance doc updated with module ownership  
- [ ] Sprint 39 ungate authorised by sprint owner  

---

## 8. Validation procedure (implementation execution order)

1. **Baseline** — 38B-1 probe + test count.  
2. **Change** — branch with consolidated prompt/module.  
3. **AUTO** — full suite + dimension-specific tests (§2).  
4. **PROBE** — prompt size and marker count vs phase target.  
5. **Upstream rerun** (when GAM/DLA touched) — capture `activity_materials` / specs JSON for Inflation.  
6. **Design Page rerun** — full page JSON for mandatory anchors.  
7. **JSON diff** — `sections[].learning_activities…[].materials` vs golden; `visual_affordances[]` id set.  
8. **PREC** — adversarial §4.  
9. **Render** — HTML export; tables visible; Climate hooks; CI multitable.  
10. **Sign-off** — checklist §7.  

---

## 9. Outputs (this slice)

- [x] L0–L8 assertion map with automation classification  
- [x] Minimum anchor coverage (Inflation mandatory + Climate, CI, Marx)  
- [x] Precedence adversarial validation (PREC-01–04)  
- [x] Wave 1–4 pass/fail gates (shared modules, GAM, DLA, Design Page)  
- [x] Regression matrix (layer → failure → anchor → source → severity)  
- [x] Implementation sign-off process  
- [x] Implementation-ready [checklist](../fixtures/probe-38B-6-regression-validation-checklist.md)  

---

## Handoff

- **38B-7:** Module ownership, waiver policy, probe script ownership.  
- **Implementation:** Add AUTO* detectors per §2 backlog; do not merge table prompt changes without Inflation PREC-01 PASS.  
- **Sprint 39:** Remains gated until §7.5 programme completion.
