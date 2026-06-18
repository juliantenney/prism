# Sprint 49 — Closure Report

**Sprint folder:** `docs/development/sprints/2026-06-19-sprint-49-sp-01-text-pattern/`  
**Predecessor:** Sprint 48 — Runtime Pattern Implementation  
**Recommended status:** **Complete with follow-on work**  
**Closure date:** 2026-06-19  
**Validation corpus:** Marx self-directed learner-page workflow (`marx-run-artefacts-run2/`)

---

## 1. Sprint 49 Summary

### Original objectives

Sprint 49 opened as an investigation into weak learner-page outputs: thin instructional manifestation, apparent loss of PEL/meta-cognition signals, and contradictory prompt contracts blocking SP-01 (`text` connective exposition).

**Chartered primary thread (D-49-00):**

- Resolve SP-01 / TEXT-SP-01 vs GAM cognition-cue contract conflict.
- Implement SP-01 runtime pattern block after reconciliation.
- Gate secondary two-column / Journey Compass presentation work on SP-01 stability.

**Expanded during sprint (human-mediated validation loop):**

- Trace PEL survival through DLA → GAM → Design Page → renderer.
- Close prompt-boundary debt (C1/C2/C3a/C3b/C3/C4).
- Enforce mandatory learner-page DLA framing at workflow progression (DLA Framing Gate v1).
- Improve DLA cognition-field generation compliance without prompt bloat.

### Major discoveries

| Discovery | Implication |
| --------- | ----------- |
| **Generation bottleneck precedes renderer** | Marx corpus failures were primarily DLA/GAM generation and compose omission — not renderer inability to surface cognition when data exists. |
| **Schema authority competes with runtime contracts** | Models follow domain `Output:` / `activities[]` schema lines more strongly than appended OUTPUT CONTRACT blocks. Optional cognition wording in schema undermined mandatory runtime gates. |
| **Preamble compliance improved before cognition** | Dedicated authoring module (`LD-ACTIVITY-PREAMBLE-EXPOSITION`) + schema alignment moved `activity_preamble`; cognition required parallel treatment (`LD-COGNITION-ORIENTATION`). |
| **GAM text vs cognition boundary was contradictory** | Pack cognition contract instructed cognition cues in all material blocks; SP-01 requires exposition-only `text` bodies (FM-07). |
| **Gate without generation fix is necessary but insufficient** | DLA Framing Gate v1 stops bad artefacts propagating; salience fixes were still required for human-run external prompts. |
| **Manifestation ≠ presence** | Final Marx run shows fields and materials can exist while learner experience (density, salience, layout, page JSON fidelity) remains uneven. |

### Major decisions

| ID | Decision | Status |
| -- | -------- | ------ |
| **D-49-01** | GAM cognition contract scoped: `Material: ... (text)` exposition-only; cognition cues on non-text materials only. Evaluation aligned (C3). | **Accepted** |
| **DLA Framing Gate v1** | Option D architecture, Option A blocking scope: `meetsMandatoryFraming` hard-blocks workflow Next; no auto-retry/repair. | **Accepted** |
| **DLA cognition compliance** | Option B: focused `LD-COGNITION-ORIENTATION` module + domain schema alignment — not OUTPUT CONTRACT expansion. | **Accepted** |
| **C3b rhetoric scope** | `LD-SELF-DIRECTED-RHETORIC` wrapper-only on Design Page; DLA authoring retains full rhetoric. | **Accepted** |
| **Tier 2 orientation warnings** | Deferred — gate v1 is blocking mandatory framing only. | **Deferred** |
| **D-49-02** | FM-08 as blocking MUST in SP-01 | **Open** (optional GOOD only in implementation) |

### Significant architecture outcomes

1. **Layered prompt assembly stabilised** — Cognition pack → EQF → instructional patterns → learner-page scaffolds → table/materials contracts → preamble exposition → cognition orientation → strict JSON / episode plan blocks.
2. **Material-type-aware cognition** — Prompt contract and `listPedagogicCognitionFieldsFromGamText` scrubbing agree on D-49-01.
3. **Workflow capture gates** — GAM tier-1 gate (Sprint 48) + DLA mandatory framing gate (Sprint 49) share philosophy: fail mandatory structure → stop propagation.
4. **Authoring modules pattern** — Small, DLA-scoped libs (`LD-ACTIVITY-PREAMBLE-EXPOSITION`, `LD-COGNITION-ORIENTATION`) replace OUTPUT CONTRACT sprawl for generation compliance.
5. **Schema reinforcement hook** — `reinforceLearnerPageDlaActivitiesOutputSchema` patches stale `activities[]` lines in exported prompts.
6. **Journey Compass** — Per-activity aligned blocks refined (Sprint 43 direction carried into runtime).

---

## 2. Completed Work

### Prompt architecture

- **C1/C2** — Prompt boundary cleanup (rhetoric / compose scope alignment).
- **C3a/C3b** — Self-directed rhetoric: Design Page wrapper-only preservation boundary; DLA retains authoring semantics.
- **C3/C4** — GAM cognition evaluation aligned with D-49-01; SP-01 wording cleanup (removed brief/concise exposition language competing with substantive connective exposition).
- **Schema salience fix** — Domain `activities[]` Output line + runtime reinforcement; cognition no longer listed as optional/additional after `support_note`.
- **Stale test hygiene** — `workflow-learner-page-mandatory-framing` assertion aligned to current preamble wording.

### Cognition contracts

- **D-49-01 implementation** — GAM prompt: non-text materials receive cognition cues; `text` bodies exposition-only (FM-07).
- **C3 evaluation fix** — Cognition labels inside `text` material bodies do not satisfy GAM cognition coverage checks.
- **DLA mandatory framing evaluator** — `evaluateLearnerPageDlaActivityFramingCoverage` unchanged; gate consumes `meetsMandatoryFraming`.

### DLA generation

- **DLA Framing Gate v1** — `workflowRunLearnerPageFramingValidation` blocks Next; clears step completed on failure; empty capture clears gate state.
- **LD-COGNITION-ORIENTATION** — Activity-row cognition authoring module with pre-emit checklist; wired after preamble exposition.
- **Domain schema alignment** — `activity_preamble` + ≥1 cognition-orientation field required (learner-page) in `activities[]` Output schema.
- **Design (Option B)** — Documented in sprint; implemented as module + schema, not retry/repair.

### GAM generation

- **SP-01 / TEXT-SP-01** — Connective exposition prose pattern injected for self-directed learner-page GAM.
- **SP-02–SP-06** — Maintained; maintain-test suites pass.
- **GAM capture gate** — Preserved from Sprint 48; regression suites pass.

### Preservation

- **GAM material preservation fixes** — Compose path preserves substantive material bodies (Sprint 49 material-collapse remediation).
- **Design Page compose** — Activity-row + `activity.materials.*` preservation contracts reinforced; merge helpers for framing fields when upstream DLA carries them.
- **Page JSON repair paths** — Preamble merge on compose where upstream fields exist.

### Rendering

- **Journey Compass** — Implementation and per-activity refinement (signpost blocks aligned to activity column).
- **Renderer cognition blocks** — `util-cognition*` and `util-activity-preamble` surface when page data carries fields (validated in Marx run2 HTML).
- **No full two-column layout implementation** — Investigation direction retained; renderer layout sprint deferred.

### Key implementation artefacts

| Area | Primary files |
| ---- | ------------- |
| DLA gate | `app.js` (Next handler, `applyLearnerPageDlaFramingValidationToCapture`) |
| Cognition orientation | `lib/ld-cognition-orientation.js` |
| SP-01 | `lib/instructional-pattern-prompt.js` |
| GAM cognition eval | `app.js` (`scrubTextMaterialContentFromGamPackText`) |
| Domain DLA schema | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Tests | `workflow-dla-framing-capture-validation-gate.test.js`, `ld-cognition-orientation.test.js`, `workflow-ld-cognition-contracts.test.js`, `workflow-instructional-pattern-prompt.test.js` |

---

## 3. Validation Findings

**Corpus:** `marx-run-artefacts-run2/` (manual Marx self-directed learner-page workflow, post–Sprint 49 fixes).

### DLA (`learning_activities.json`)

| Check | Result |
| ----- | ------ |
| `activity_preamble` on all activities | **Pass** (5/5) |
| ≥1 cognition-orientation field per activity | **Pass** (5/5 — `reasoning_orientation` on all; `self_explanation_prompt` on A1) |
| Procedural-only rows (pre-gate baseline) | **Would fail** gate — confirmed by `marx-dla-procedural-output.json` fixture |
| Workbook obligation rows | Present (text, worked_example, checklist, tables, consolidation) |

### GAM (`activity_materials.md`)

| Check | Result |
| ----- | ------ |
| `text` materials: substantive connective exposition | **Pass** — multi-paragraph teaching prose, relational links, optional **Example** paragraph |
| FM-07: cognition cues inside `text` Content | **Pass** — no appended `Cognition cues:` blocks in text bodies |
| Non-text materials: depth and structure | **Pass** — worked examples with bridges, checklists with revise guidance |

### Design Page & renderer

| Check | Result |
| ----- | ------ |
| Material bodies preserved in page JSON | **Pass** — `materials.text`, `worked_example`, etc. populated with GAM bodies |
| Activity-row PEL in page JSON | **Partial** — run2 `page.json` activity rows carry `support_note`, tasks, materials; preamble/cognition fields not always echoed on page JSON rows |
| Rendered HTML | **Pass** — `util-activity-preamble`, `util-cognition`, `journey-compass` present in `page.html` |
| Learner experience quality | **Improved but not settled** — content present; density, progression signalling, and layout salience remain subjective |

### Workflow gates

| Gate | Result |
| ---- | ------ |
| DLA Framing Gate v1 | **Pass** — automated tests; procedural Marx fixture blocked |
| GAM capture gate | **Pass** — regression suite |
| Facilitator workflows | **Unaffected** — scope gates exclude facilitator-only briefs |

### Summary validation statement

Sprint 49 moved the Marx workflow from **“fields absent / materials collapsed”** to **“mandatory framing and exposition generated, preserved through render.”** Remaining gaps are primarily **how saliently** cognition and orientation manifest to the learner — not whether the pipeline can carry them.

---

## 4. Remaining Known Debt

### Deferred intentionally

| Item | Notes |
| ---- | ----- |
| Tier 2 orientation/reasoning warnings at DLA capture | Framing gate v1 is blocking mandatory only |
| D-49-02 FM-08 as blocking MUST | SP-01 uses optional GOOD illustration only |
| Full two-column presentation layout | Sprint 43 direction; investigation only in Sprint 49 |
| Auto-retry / auto-repair on DLA framing failure | Explicitly rejected — manual regenerate aligns with GAM gate philosophy |
| Instructional-shape capture validators for `text` | Out of original charter |
| PEL redesign | Preservation and generation modules only |

### Unresolved issues

| Item | Severity | Notes |
| ---- | -------- | ----- |
| Page JSON vs DLA PEL field echo | Medium | Run2 HTML renders preamble/cognition; page JSON rows may not always list all upstream PEL keys — compose fidelity audit still warranted |
| Selective cognition coverage | Low–Medium | OUTPUT CONTRACT page-level rules (e.g. ≥2 `self_explanation_prompt`) not gate-enforced |
| LLM non-determinism | Ongoing | Gates + salience improve compliance; cannot guarantee every external run |
| IFP/DLA-WB prompt dominance | Low | Obligation-population blocks still compete for model attention |
| `workflow-learner-page-mandatory-framing` pre-existing domain drift | Low | Occasional stale domain doc sync outside sprint folder |

### Future opportunities (Sprint 50+)

- Pedagogic manifestation audit rubric (salience, progression, cognitive load).
- Journey Compass + activity column visual hierarchy refinement.
- Design Page compose fidelity: guaranteed echo of all PEL keys on page activity rows.
- Tier 2 advisory warnings (orientation/reasoning quality, not just presence).
- Formal observation log template for manual validation runs.
- Benchmark corpus refresh (Sprint 44 Marx) under new gates.

---

## 5. Sprint 50 Recommendation

### Proposed sprint goal

**Pedagogic Manifestation and Learner Experience**

Shift from prompt architecture and contract enforcement to **how generated pedagogy reads and functions for the learner** — without reopening SP-01–SP-06 blocks, D-49-01, or gate semantics.

### Suggested scope boundaries

**In scope:**

- Manifestation audit (Marx + one workshop fixture) against learner-experience rubric.
- Renderer / layout salience: preamble → cognition → task → materials reading order.
- Journey Compass integration polish (per-activity signposting vs resource column).
- Design Page compose fidelity for PEL field echo where HTML already renders but JSON omits.
- Optional Tier 2 **advisory** capture warnings (quality/salience — non-blocking).

**Out of scope:**

- New workflow steps or cognition ontology.
- OUTPUT CONTRACT / prompt layer expansion.
- GAM/DLA gate redesign.
- Full two-column CSS architecture unless explicitly chartered as manifestation slice.

### Success criteria sketch

1. Marx rendered page passes agreed manifestation rubric on ≥4/5 activities.
2. Page JSON activity rows reliably echo DLA PEL fields when upstream carries them.
3. Documented learner reading path: orientation → reasoning cue → task → materials.
4. No regression on Sprint 49 gate and pattern test suites.

---

## 6. Closure Assessment

### What is now stable

| Capability | Confidence |
| ---------- | ---------- |
| D-49-01 GAM text vs cognition contract | **High** — prompt + evaluation aligned |
| SP-01–SP-06 runtime injection (scoped) | **High** — maintain-test suites |
| GAM capture gate (tier 1) | **High** — Sprint 48 + regression |
| DLA Framing Gate v1 (mandatory framing) | **High** — implemented + tested |
| GAM material preservation path | **High** — regression fixed |
| Authoring module pattern (preamble + cognition orientation) | **High** — libs + wiring |
| Domain `activities[]` schema authority (learner-page) | **Medium–High** — aligned; reinforcement hook for stale prompts |
| Facilitator / non-learner-page exclusion | **High** — scope gates |

### What is now proven

- Marx workflow **can** emit `activity_preamble` and cognition-orientation fields on every DLA activity (run2).
- GAM **can** produce FM-07-compliant connective exposition in `text` materials.
- Bad DLA artefacts **cannot** progress past framing gate without manual fix.
- Cognition evaluation **does not** treat text-body labels as coverage.
- Renderer **can** surface preamble and cognition semantic blocks when page pipeline carries data.

### What remains experimental

- Consistency of cognition-field **quality** and archetype matching across models/runs.
- Page JSON as authoritative PEL carrier vs render-time merge/repair.
- Journey Compass learner utility (signposting without noise).
- Two-column presentation as a finished layout pattern.
- Tier 2 warning tier for orientation/reasoning (design only in Sprint 49).

---

## Closure recommendation

| Status | Recommendation |
| ------ | -------------- |
| **Complete with follow-on work** | **Yes** |

**Rationale:** Sprint 49 achieved its expanded objectives: contract reconciliation, SP-01 implementation, gate enforcement, generation compliance modules, preservation fixes, and a successful Marx validation demonstrating end-to-end capability. Prompt-architecture threads are in a maintainable state. Deliberate follow-on belongs in Sprint 50 under **manifestation and learner experience**, not further contract sprawl.

---

## Archive references

| Artefact | Path |
| -------- | ---- |
| Decision log | [`SPRINT-49-DECISION-LOG.md`](SPRINT-49-DECISION-LOG.md) |
| Handover (inbound) | [`SPRINT-49-HANDOVER.md`](SPRINT-49-HANDOVER.md) |
| Marx validation run 2 | [`marx-run-artefacts-run2/`](marx-run-artefacts-run2/) |
| Sprint 48 closure | [`../2026-06-18-sprint-48-runtime-pattern-implementation/SPRINT-48-CLOSURE-RECORD.md`](../2026-06-18-sprint-48-runtime-pattern-implementation/SPRINT-48-CLOSURE-RECORD.md) |
| SP-01 pattern authority | [`../2026-06-15-sprint-44/patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md`](../2026-06-15-sprint-44/patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md) |
| Journey Compass direction | [`../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md`](../2026-06-12-sprint-43-educational-salience/43-05-seamless-chat-handover-pack.md) |

---

*End of Sprint 49 closure report.*
