# Slice 38E-1 — Implementation target audit

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-1  
**Authority:** [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) · [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) · [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)  
**Out of scope:** Prompt edits · code edits · tests · fixtures · implementation

---

## 1. Purpose

Identify **exact repo files** where Sprint **38-D** workbook contracts (DLA-WB-*, GAM-WB-*) should be enacted, separate **DLA** from **GAM** edit boundaries, assess whether **`app.js`** changes are required, and note **38E-4** validation surfaces — **without** modifying any implementation artefact.

**Success for this slice:** A reviewer can start **38E-2** and **38E-3** with a file-level map, explicit read-only preserve stack, and a defensible **app.js** decision.

---

## 2. Inputs and authority

| Source | Role in audit |
|--------|----------------|
| [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) | DLA-WB-01 … 19 — specification obligations |
| [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) | GAM-WB-00 … 21 · GAM-WB-MIX-01 … 06 · AP-01 … 04 |
| [38D-3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) | `CW-REF-38D3` — target shape |
| [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V-01 … V-13 layers |
| [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | EV-01 BEFORE · §6 scorecard |
| [38B-W2B](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W2B-DLA-authority-review.md) | DLA = spec only; augmentation chain |
| [38B-W2A](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W2A-GAM-authority-review.md) | GAM = table/material author |
| `domains/learning-design/domain-learning-design-step-patterns.md` | Canonical LD **pack** (§5 DLA, §6 GAM, §13 Design Page) |
| `app.js` | Runtime prompt assembly (`applyWorkflowStepRuntimePromptAugmentations`, self-directed scaffolds) |

**Applicability gate (unchanged):** `delivery_context: self_directed` + downstream `page_profile: learner` + workbook intent ([38D-1 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md)). Inflation anchor uses this shape ([38D-5 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)).

---

## 3. Search method

### 3.1 Directories inspected

| Directory | Why |
|-----------|-----|
| `domains/learning-design/` | LD pack, artefacts, prompt-rules |
| `lib/` | Canonical `LD-*` modules (38-B) |
| `app.js` | Runtime augmentation and self-directed scaffolds |
| `tests/` | Existing prompt-surface and fidelity tests |
| `scripts/` | 38-B prompt audit probes |
| `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/` | Authority reviews (read-only) |
| `docs/development/sprints/2026-06-04-sprint-38d-workbook-authoring-contracts/` | Contract authority (read-only) |

### 3.2 Files inspected (implementation-relevant)

| File | Role |
|------|------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | §5 DLA · §6 GAM · §13 Design Page · Workflow Brief Config |
| `domains/learning-design/domain-learning-design-artefacts.md` | `required_materials` / activity schema |
| `domains/learning-design/domain-learning-design-prompt-rules.md` | Sprint 35 rhetoric rules (documentation; overlaps runtime) |
| `app.js` | ~7040–8150 (scaffold gates), ~8780–8915 (augmentation), ~8033–8125 (`LD-*` apply) |
| `lib/ld-table-fidelity.js` | Table author/spec/preserve |
| `lib/ld-materials-copy.js` | Materials author/preserve |
| `lib/ld-design-page-compose-contract.js` | Design Page compose (preserve) |
| `lib/ld-self-directed-rhetoric.js` | L5/L7 rhetoric + GAM rider |
| `lib/ld-math-render.js` | Maths delimiters |
| `lib/design-page-materials-fidelity.js` | Sprint 38 page materials helper |
| `scripts/probe-38b1-ld-workflow-prompt-audit.js` | Augmented prompt size probe |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | DLA/GAM/DP prompt assertions |
| `tests/ld-table-fidelity.test.js` · `tests/ld-materials-copy.test.js` | Module contracts |
| `tests/design-page-materials-fidelity.test.js` | Preservation helper tests |

### 3.3 Keywords searched

`step_design_learning_activities` · `step_generate_activity_materials` · `LD-MATERIALS-COPY` · `LD-TABLE-FIDELITY` · `LD-DESIGN-PAGE-COMPOSE` · `required_materials` · `self_directed` · `buildSelfDirected` · `OUTPUT CONTRACT` · `consolidation_summary` · `workbook` · `applyWorkflowStepRuntimePromptAugmentations`

### 3.4 Assumptions

1. **Pack is loaded from** `domains/learning-design/domain-learning-design-step-patterns.md` (confirmed by tests and probes extracting §5/§6 Prompt Factory JSON).  
2. **`domain-learning-design-prompt-rules.md` is not injected** into runtime prompts (`app.js` has no reference); Sprint 35 rules are already folded into `LD-SELF-DIRECTED-RHETORIC` and legacy scaffold deprecations.  
3. **Workbook contracts apply on the same gate** as existing self-directed learner-page scaffolds (`shouldApplySelfDirectedLearnerPageMaterialShapeScaffold` / `GamMaterialScaffold`).  
4. **Design Page and renderer stay read-only** for 38-E; workbook fix is upstream DLA + GAM ([38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)).  
5. **`consolidation_summary`** and other 38D GAM tokens are **organised-text `Material: (type)` labels**, not necessarily entries in the DLA pack `type` enum today — DLA may use `text` / `prompt_set` with purpose clauses; GAM must author `consolidation_summary` bodies per [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md).

---

## 4. DLA implementation targets

### 4.1 Primary — pack §5 (authoritative for 38E-2)

| Field | Detail |
|-------|--------|
| **Path** | `domains/learning-design/domain-learning-design-step-patterns.md` |
| **Section** | `## 5. Design Learning Activities` → Prompt Factory JSON |
| **Role** | Canonical **seeded** DLA prompt (`promptTemplate`, `defaultPromptNotes`, output schema, `required_materials` type list) |
| **Relevant existing content** | Executable activities task; `required_materials: [{ material_id, type, purpose, specification }]`; types: `task_cards`, `prompt_set`, `scenario`, `checklist`, `template`, `sample_output`, `text`, four `*_table` types; “GAM generates full material bodies”; `LD-TABLE-FIDELITY` / `LD-MATERIALS-COPY` spec cross-refs; facilitator_moves omitted for self_directed |
| **Why correct surface** | [38B-W2B §2](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W2B-DLA-authority-review.md): DLA owns **spec vocabulary** and activity JSON — workbook obligations are **what to require**, not material bodies |

**DLA-WB clause mapping (pack §5):**

| Clauses | Pack insertion locus |
|---------|-------------------|
| **DLA-WB-01** Intent | New workbook-applicability block + `delivery_notes` / session fields (`resource_intent: self_study_workbook`, `session_duration_target_minutes`) in Output schema |
| **DLA-WB-02** Outcomes | Existing `mapped_learning_outcomes`; strengthen capstone ≥3 rule |
| **DLA-WB-03** Duration | Explicit 50–70 min sum rule (counter EV-01 125 min) |
| **DLA-WB-04**, **17** | Solo feasibility + prohibited partner/facilitator phrasing in Instructions |
| **DLA-WB-05**, **16** | Progression + capstone anti-dump in `required_materials` / capstone spec |
| **DLA-WB-06** Diversity | **Mandatory** non-table + table mix in session; extend type list guidance |
| **DLA-WB-07** Exposition | Require `text` (or exposition purpose) session-wide |
| **DLA-WB-08**, **09** | `sample_output` / stepped `template` + modelling fields |
| **DLA-WB-10**, **19** | Strengthen `learner_task` / `expected_output` (partially present) |
| **DLA-WB-11** Retrieval | Mandate `task_cards` / `prompt_set` / `checklist` on ≥2 activities |
| **DLA-WB-12**, **13** | Consolidation + capstone synthesis in final activity specs |
| **DLA-WB-14** Transfer | `transfer_or_application_task` + capstone personal context |
| **DLA-WB-15** | Ranking/compare: empty judgement cells in `specification` |
| **DLA-WB-18** | Scenario material when case language in task |

**Risk / overlap:** Pack already long (~3.8k template + ~2.7k notes per 38B probe); workbook block should be **conditional** (“when workbook intent”) to avoid workshop brief regression. Overlaps **LD-SELF-DIRECTED-RHETORIC** (closure, worked example) — cite, do not duplicate L5 prose.

---

### 4.2 Secondary — runtime DLA scaffolds in `app.js` (38E-2 only with charter amendment)

| Path | Function / block | Role | Clauses | Why surface | Risk |
|------|------------------|------|---------|-------------|------|
| `app.js` | `buildSelfDirectedLearnerPageMaterialShapePromptBlock()` (~7309) | Auto-applied when DLA scaffolds gate | **05**, **06**, **16**, **18** (integrated template vs duplicate cards; capstone checklist scope) | Already shapes `required_materials` specs for self-directed pages | **Shared concern with GAM** only via downstream types — safe for DLA-only edits inside DLA-gated block |
| `app.js` | `buildSelfDirectedLearnerPageActivityFramingPromptBlock()` (~7423) | Activity preamble / cognition | **04**, **14** (partial) | Emits orientation fields | Overlaps **LD-SELF-DIRECTED-RHETORIC** — prefer pack-first |
| `app.js` | `buildSelfDirectedLearnerPageDlaOutputContractOverrideBlock()` (~7436) | Overrides output field list | **01**, **02**, **12**, **14** | Stronger than pack for JSON shape | Large block; OUTPUT CONTRACT not in pack |
| `app.js` | `buildSelfDirectedLearnerPageDlaOutputContractExampleBlock()` (~7462) | JSON example | **06**, **07**, **08**, **11** | Shows `text` in `required_materials` | Example is illustrative only |
| `app.js` | `augmentSelfDirectedDlaDraftOutputSection()` (~7482) | Injects output pointer | **01** | Wires pack Output → OUTPUT CONTRACT | Low risk |
| `app.js` | `buildSelfDirectedTimelineSequencingAlignmentPromptBlock()` (~7293) | Timeline spec | **05** (ordering tasks) | Appended to **DLA and GAM** | **Not DLA-only** — do not edit in 38E-2 without splitting or 38E-3 coordination |

**38E-2 default:** Edit **pack §5 only**. Touch `app.js` DLA blocks only if 38E-2 observation records pack-only insufficiency → **charter amendment**.

---

### 4.3 Read-only for DLA (38E-2)

| Path | Role |
|------|------|
| `lib/ld-table-fidelity.js` | Spec role (`dla`) — table type → GAM realisation; **no workbook genre** |
| `lib/ld-materials-copy.js` | Not applied to DLA step |
| `lib/ld-self-directed-rhetoric.js` | Auto-applied rhetoric — **reference** for closure/worked-example wording |
| `domains/learning-design/domain-learning-design-artefacts.md` | Schema authority — align types in 38E-2 **only if** pack enum extended (optional doc note in 38E-2 observation) |

---

## 5. GAM implementation targets

### 5.1 Primary — pack §6 (authoritative for 38E-3)

| Field | Detail |
|-------|--------|
| **Path** | `domains/learning-design/domain-learning-design-step-patterns.md` |
| **Section** | `## 6. Generate Activity Materials` → Prompt Factory JSON |
| **Role** | Canonical **seeded** GAM prompt (`promptTemplate`, `defaultPromptNotes`, `Material:` output organisation) |
| **Relevant existing content** | Realise all `required_materials`; material-type realisation for `task_cards`, `prompt_set`, `scenario`, `checklist`, `template`, tables, `sample_output`, `text`; anti-placeholder usability; omit `Facilitator use:` when self_directed; `LD-TABLE-FIDELITY` / `LD-MATERIALS-COPY` author refs |
| **Why correct surface** | [38B-W2A §2](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W2A-GAM-authority-review.md): GAM is **primary author** of material bodies and **genre ceiling** for Design Page |

**GAM-WB clause mapping (pack §6):**

| Clauses | Pack insertion locus |
|---------|-------------------|
| **GAM-WB-00** | Strengthen “realise every entry” + anti-outline (aligns with existing usability bullets) |
| **GAM-WB-01** | Add `text` / exposition body rules (≥120 words, ≥2 ideas) |
| **GAM-WB-02**, **03**, **12** | `sample_output` / stepped `template` / modelling bodies |
| **GAM-WB-04** | Practice support bodies tied to learner_task |
| **GAM-WB-05**, **17**, **18** | `task_cards`, `prompt_set`, `checklist` minimum bodies |
| **GAM-WB-06**, **19** | **`consolidation_summary`** genre + `reflection_prompt` (not substitute) |
| **GAM-WB-07**, **20** | Capstone synthesis scaffold; **prohibit** four-table reprint |
| **GAM-WB-08** | `transfer_prompt` material |
| **GAM-WB-09**, **14** | `rubric` / ranking — empty judgement cells |
| **GAM-WB-10** | Full `scenario` bodies |
| **GAM-WB-11**, **16** | `template` learner blanks; `*_table` companion only |
| **GAM-WB-15** | `misconception_note` optional |
| **GAM-WB-21** | Placeholder ban (align `LD-MATERIALS-COPY`) |
| **GAM-WB-MIX-01 … 06** | New **Workbook genre mix** subsection — **AP-01 table-only invalid** |
| **AP-01 … 04** | Prohibited patterns table in Instructions |

**Risk / overlap:** `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` already require full bodies and pipes — workbook section must **add genre mix**, not re-list PREC rules. `defaultPromptNotes` references rhetoric at runtime — keep cross-ref one-liners.

---

### 5.2 Secondary — runtime GAM scaffolds in `app.js` (38E-3 only with charter amendment)

| Path | Function | Role | Clauses | Why | Risk |
|------|----------|------|---------|-----|------|
| `app.js` | `applyLdTableFidelityContractToDraft` (gam author) | Table author | **16** | Canonical — **read-only** | — |
| `app.js` | `applyLdMaterialsCopyContractToDraft` (gam) | Full bodies | **00**, **21** | Canonical — **read-only** | — |
| `app.js` | `buildSelfDirectedGamReadingSufficiencyPromptBlock()` (~8128) | Reading length | **01** (partial exposition in readings) | Density for independent study | Not workbook-specific |
| `app.js` | `buildSelfDirectedGamLearnerVoicePromptBlock()` (~8139) | No facilitator headings | **04**, **09** (voice) | Fixes Facilitator/template conflict | Already strong |
| `app.js` | `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` (~8294) | PEL materials | **03**, **15** | Enrichment-gated | Conditional |
| `app.js` | `lib/ld-self-directed-rhetoric.js` GAM rider | Closure in materials | **06**, **19** | “Realise closure… when spec requests” | Overlap with new MIX-03 — **reference only** |

**Preferred 38E-3 additive surface (if pack insufficient):** New GAM-only function e.g. `buildSelfDirectedGamWorkbookGenrePromptBlock()` called only when `isGam && applyGamScaffolds` — **requires charter amendment** because it is `app.js`.

**Do not edit in 38E-3:** `buildSelfDirectedTimelineSequencingAlignmentPromptBlock` without DLA coordination (shared append).

---

### 5.3 Read-only for GAM (38E-3)

| Path | Role |
|------|------|
| `lib/ld-table-fidelity.js` | Author role — pipe tables |
| `lib/ld-materials-copy.js` | Author role — no placeholders |
| `lib/ld-math-render.js` | TeX rules |
| `lib/ld-self-directed-rhetoric.js` | GAM rider — do not reopen module text in 38-E |

---

## 6. Shared / read-only surfaces

These **must remain unchanged** in 38E-2/38E-3 unless a **38E-5 preservation regression** forces a separate programme decision.

| Module / surface | Path | Role | 38-E stance |
|------------------|------|------|-------------|
| **LD-MATERIALS-COPY** | `lib/ld-materials-copy.js` | L4 preserve (DP) + author (GAM); PREC-02 | **Read-only** — workbook adds genre obligations **around** it |
| **LD-TABLE-FIDELITY** | `lib/ld-table-fidelity.js` | Table author (GAM) + spec (DLA) + preserve (DP) | **Read-only** — B4 / V-13 monitor |
| **LD-DESIGN-PAGE-COMPOSE-CONTRACT** | `lib/ld-design-page-compose-contract.js` | L0–L3 compose + membership | **Read-only** — no composition-first |
| **LD-SELF-DIRECTED-RHETORIC** | `lib/ld-self-directed-rhetoric.js` | L5/L7 rhetoric, worked-example sequence, closure bullets | **Read-only** — overlaps DLA-WB-08/12/14; do not duplicate |
| **LD-MATH-RENDER** | `lib/ld-math-render.js` | TeX delimiters | **Read-only** |
| **Sprint 38 visual affordances** | `lib/sprint38-visual-affordances.js` + `applySprint38VisualAffordanceContractToDraft` in `app.js` | L6 figures | **Read-only** |
| **Design Page pack §13** | `domain-learning-design-step-patterns.md` §13 | Preserve merge | **Read-only** — accidental pedagogy creep risk if edited |
| **Design Page runtime** | `applyLdDesignPageComposeContractToDraft` in `app.js` | Compose contract | **Read-only** |
| **Renderer** | `app.js` render paths | Presentation | **Out of charter** |
| **38-B EV fixtures** | `docs/.../38b/.../fixtures/ev-38b4-01-*` | Frozen BEFORE | **Read-only** |

**Other discovered shared hooks (read-only):**

- `applyPedagogicCognitionContractScaffoldToDraft` / PEL enrichment blocks (`app.js`) — enrichment-gated; not workbook primary.  
- `domains/learning-design/domain-learning-design-prompt-rules.md` — documentation mirror of rhetoric; **not** runtime-loaded.

---

## 7. `app.js` assessment

| Question | Answer |
|----------|--------|
| **`app.js` required?** | **NO** (default for 38E-2 and 38E-3) |
| **Evidence** | (1) [38B-W2B/W2A](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/) established **pack + `LD-*` modules** as the consolidation surface; workbook contracts are **obligations on top**, not a new preserve architecture. (2) DLA §5 and GAM §6 already carry task shape, `required_materials` enum, material-type realisation, and canonical `LD-*` cross-refs. (3) EV-01 failure is **genre mix upstream** ([38D-5 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)), not missing `app.js` merge logic — V-13 **PASS** with 4 table types. (4) Existing runtime scaffolds (OUTPUT CONTRACT, material shape, reading sufficiency, learner voice) address **framing and fidelity**, not **DLA-WB-06 / GAM-WB-MIX-01**. |
| **Rationale** | Implement **38D-1** and **38D-2** primarily in **`domain-learning-design-step-patterns.md` §5 and §6** with brief-gated workbook sections. Reserve `app.js` for a **charter-amended** optional slice only if pack-only AFTER (38E-5) fails while DLA JSON shows correct `required_materials` diversity. |
| **Optional amendment path** | Add **`buildSelfDirectedGamWorkbookGenrePromptBlock`** (GAM-only) and/or extend **`buildSelfDirectedLearnerPageDlaOutputContractOverrideBlock`** with `resource_intent` + session consolidation keys — only if 38E-2/38E-3 observations document pack insufficiency. |
| **Explicit non-targets in `app.js`** | Design Page compose, renderer, workflow brief resolver, `applyLdTableFidelityContractToDraft` / `applyLdMaterialsCopyContractToDraft` **core module text**, Sprint 38 affordance generator. |

---

## 8. Test / validation target notes for 38E-4

**Do not add tests in 38E-1.** Possible **38E-4** surfaces (tied to [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)):

| Surface | Path / method | Rules |
|---------|---------------|-------|
| DLA prompt contains workbook gate | Extend `tests/workflow-self-directed-learner-page-formatting.test.js` | V-08, V-09 (spec layer hints) |
| GAM prompt contains MIX / AP-01 | Same test file, GAM step context | V-02, V-12 |
| Module preservation unchanged | `tests/ld-table-fidelity.test.js` · `tests/ld-materials-copy.test.js` | V-13 regression |
| Design Page preserve | `tests/design-page-materials-fidelity.test.js` · `tests/sprint-38-visual-affordances.test.js` | V-13, no compose creep |
| Prompt size regression | `scripts/probe-38b1-ld-workflow-prompt-audit.js` | Informational — not pass/fail workbook |
| GAM genre inventory | New optional `tests/workbook-gam-genre-mix.test.js` or script parsing `Material: (` tokens | V-02, V-01 on captured text |
| Manual / fixture scoring | [38D fixtures](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/) · `CW-REF-38D3` · `NEG-EV-01` | V-01 … V-13 checklist |
| Inflation AFTER | `artefacts/EV-38E5-AFTER-*` (38E-5) | [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) |

**V-13 (Preservation):** Continue using [38B-W3-4](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md) evidence pattern — `tests/design-page-materials-fidelity.test.js` + committed EV-01-P/G comparison on AFTER run.

---

## 9. Implementation plan for 38E-2 and 38E-3

### 9.1 38E-2 — DLA-only

**Files allowed to edit**

| Priority | File | Scope |
|----------|------|--------|
| **1** | `domains/learning-design/domain-learning-design-step-patterns.md` | §5 `promptTemplate`, `defaultPromptNotes`, Output/`delivery_notes` schema bullets |
| **2 (amendment only)** | `app.js` | DLA-only blocks: `buildSelfDirectedLearnerPageMaterialShapePromptBlock`, `buildSelfDirectedLearnerPageDlaOutputContractOverrideBlock`, `buildSelfDirectedLearnerPageDlaOutputContractExampleBlock`, `augmentSelfDirectedDlaDraftOutputSection` — **not** shared timeline block |

**Files prohibited in 38E-2**

- `domain-learning-design-step-patterns.md` §6 (GAM)  
- `app.js` GAM scaffold path (`isGam`)  
- All `lib/ld-*.js` modules  
- Design Page §13 · `app.js` Design Page augmentations  

**Clauses to implement (38D-1)**

| Mandatory / prohibited | IDs |
|------------------------|-----|
| Mandatory | **01–08**, **10–13**, **15** (when applicable), **18** (when applicable), **19** |
| Recommended | **09**, **14** |
| Prohibited | **16**, **17** |
| Session table | [38D-1 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) material obligations |

**Deliverable:** `observations/38E-2-dla-contract-implementation.md` + pack diff; optional `proposals/dla-pack-delta.md`.

---

### 9.2 38E-3 — GAM-only

**Files allowed to edit**

| Priority | File | Scope |
|----------|------|--------|
| **1** | `domains/learning-design/domain-learning-design-step-patterns.md` | §6 `promptTemplate`, `defaultPromptNotes`; Material-type realisation; **Workbook genre mix** + AP-01 … 04 |
| **2 (amendment only)** | `app.js` | New or extended **GAM-only** workbook genre block; `buildSelfDirectedGamReadingSufficiencyPromptBlock` / `buildSelfDirectedGamLearnerVoicePromptBlock` only if pack cannot state MIX rules |

**Files prohibited in 38E-3**

- §5 DLA pack  
- `app.js` DLA scaffold branch (`isDla && applyDlaScaffolds`)  
- `lib/ld-table-fidelity.js` · `lib/ld-materials-copy.js` (unless 38-B regression — out of scope)  
- Design Page · renderer  

**Clauses to implement (38D-2)**

| Category | IDs |
|----------|-----|
| Core | **GAM-WB-00** … **21** |
| Mix / fail-fast | **GAM-WB-MIX-01** … **06** |
| Anti-patterns | **AP-01** … **04** |
| Calibration target | Pass **MIX-01** on Inflation AFTER; compare [CW-REF-38D3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md) |

**Deliverable:** `observations/38E-3-gam-contract-implementation.md` + pack diff; optional `proposals/gam-pack-delta.md`.

**Order:** **38E-2 before 38E-3** — GAM realises DLA `required_materials`.

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| **Prompt size** | DLA ~20k / GAM ~16k augmented (38B probe); add **brief-gated** workbook sections, not global duplication; run `probe-38b1-ld-workflow-prompt-audit.js` after 38E-2/38E-3 |
| **Duplicated obligations** | Workbook rules vs `LD-SELF-DIRECTED-RHETORIC` (worked example, closure) — **one-line cross-ref** in pack; do not edit rhetoric module |
| **DLA/GAM overlap** | Timeline block shared in `app.js` — prefer pack; split runtime only if necessary |
| **Design Page responsibility creep** | No §13 edits; no “compose consolidation” instructions — consolidation is **GAM `consolidation_summary`** |
| **Preservation regression (V-13)** | Do not change `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` / compose contract; monitor B4 on AFTER |
| **Type enum drift** | Pack DLA list lacks `consolidation_summary` — DLA uses purposes + types GAM knows; GAM pack must author `Material: consolidation_summary` |
| **Workshop brief collateral** | Gate all workbook text on `resource_intent` / self_study_workbook / 60-min learner workbook signals |
| **app.js scope creep** | Default pack-only; amendment only with 38E-2/38E-3 observation evidence |

---

## 11. Completion statement

| Criterion | Met? |
|-----------|------|
| Exact DLA implementation targets identified | **Yes** — §4 (pack §5 primary; app.js secondary) |
| Exact GAM implementation targets identified | **Yes** — §5 (pack §6 primary; app.js GAM-only optional) |
| Edit boundaries clear | **Yes** — §9.1 / §9.2 file lists |
| `app.js` decision explicit | **Yes** — §7: **NO** default; optional amendment path documented |
| Shared preserve stack named | **Yes** — §6 |
| 38E-4 surfaces noted | **Yes** — §8 |
| No implementation occurred | **Yes** — audit only |
| Slice **38E-1** | **COMPLETE** |

**Next slice:** **38E-2** — DLA contract implementation in `domains/learning-design/domain-learning-design-step-patterns.md` §5 only (per §9.1).
