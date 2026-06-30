# Sprint 53 — Closure Report

**Sprint folder:** `docs/development/sprints/2026-06-29-sprint-53-learner-page-output-fixes/`  
**Predecessor:** Sprint 51 (learner experience baseline, closed) · Sprint 52 (education quality — paused for output-defect track)  
**Successor:** Sprint 54 — Pedagogic Fidelity Audit  
**Baseline commit (charter):** `04c9e81`  
**Closure date:** 2026-06-29  
**Recommended status:** **Closed — investigation and audit-design complete; implementation partially advanced; fidelity measurement deferred to Sprint 54**

---

## Executive summary

Sprint 53 was chartered to remove **learner-facing output defects** (workflow correctness, material preservation, renderer reliability) separately from Sprint 52 education-quality work.

The sprint **established investigation discipline**, **reaffirmed PRISM architecture boundaries**, **audited Design Page material-fidelity gaps**, **implemented Phase 1/2 material-closure validation** (in working tree), **traced acceptance-path defects** in workflow gating, **catalogued canonical pedagogic support elements**, and **produced a fidelity audit matrix** for Sprint 54.

Sprint 53 does **not** answer where pedagogic fidelity **first** degrades in a full artefact chain. That question is the **primary handover** to Sprint 54.

---

## Sprint objective

Produce a **properly functioning learner-facing page** by:

1. Workflow correctness  
2. Learner-facing output correctness (materials, activities, PEL/scaffolding survival)  
3. Renderer reliability  

**Explicitly not in scope:** education-quality optimisation (Sprint 52 track).

---

## What was investigated

| Area | Activity | Primary artefacts |
| ---- | -------- | ------------------- |
| Baseline capability audit | Committed code/tests at `04c9e81` | `SPRINT-53-CONTEXT-PACK.md` §5 |
| Design Page material fidelity | Prompt contracts, compose path, merge, validators | `lib/ld-design-page-compose-contract.js`, `lib/ld-materials-copy.js`, `lib/page-gam-materials-preserve.js` |
| Design Page acceptance path | Why defective pages are marked complete | `app.js` capture → `applyPageCompositionValidationForCapturedPage` → Next handler |
| Material closure implementation | Phase 1 + Phase 2 `validatePageMaterialsClosure` | `tests/page-materials-closure.test.js` |
| Canonical pedagogic elements | Registry/prompt/renderer inventory | Prior audit; `SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md` |
| Failed investigation quarantine | Untracked speculative work removed from baseline | `_archive/failed-investigation-2026-06-29/` |
| Copilot vs PRISM boundary | Repeated architecture validation | Context pack §2; closure § Architectural corrections |

---

## Evidence collected

### Committed / reproducible

| Evidence | Location | Role |
| -------- | -------- | ---- |
| Activity closure wiring | `app.js` `validatePageActivityClosure`, `tests/utility-page-composition-closure.test.js` | Baseline compose validation |
| Failing activity-omission test | `tests/utility-page-composition-closure.test.js:156` | ED at bootstrap |
| Placeholder heuristics (unwired to live gates at bootstrap) | `lib/design-page-materials-fidelity.js`, `tests/design-page-materials-fidelity.test.js` | Lib present; capture gating absent at `04c9e81` |
| Compose contracts | `lib/ld-design-page-compose-contract.js`, `lib/ld-materials-copy.js` | Prompt + limitation escape language |
| Page role registry | `lib/page-role-registry.js` | Canonical material/row roles |
| Instructional manifestation grammar | `lib/ld-instructional-manifestation-render.js` | Renderer buckets |
| Marx / inflation fixtures | `tests/fixtures/page-render/`, Sprint 50 verification runs | Regression corpus |

### Investigation-session evidence (artefact audits, not all committed as fixtures)

| Evidence | Notes |
| -------- | ----- |
| Representative workflow runs (inflation workshop, RNA/HCV) | User-reported: Step 7 GAM complete → Step 9 Design Page first material loss → HTML faithful to DP JSON |
| Code-path audit | `validatePageMaterialsClosure` invoked on paste/sync; workflow **Next** does not block on material-closure fail; export blocks on fail when upstream in state |
| Simulated defective page vs validator | Confirmed `fail` on condensed bodies + limitation excuse when upstream GAM supplied; `skip` when upstream absent |

### Sprint 53 deliverables (docs)

| Document | Path |
| -------- | ---- |
| Context pack | `SPRINT-53-CONTEXT-PACK.md` |
| Pedagogic fidelity audit matrix | `SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md` |
| This closure report | `SPRINT-53-CLOSURE-REPORT.md` |

---

## Established findings (ED)

*Supported by committed code, committed tests, reproducible behaviour, or code-path audit with file references. Not hypotheses.*

| ID | Finding |
| -- | ------- |
| **ED-53-01** | **PRISM does not observe Copilot execution.** PRISM generates prompts; the operator runs Copilot externally. PRISM does not see generated artefacts until explicitly supplied. (`SPRINT-53-CONTEXT-PACK.md` §2) |
| **ED-53-02** | **PRISM cannot validate artefacts it never receives.** Material-closure and compose validators operate only on artefacts in PRISM state (pasted capture, Utilities JSON, test fixtures). (`app.js` `resolveUpstreamActivityMaterialsFromWorkflowCaptures`; validation carve-out) |
| **ED-53-03** | **`validatePageMaterialsClosure` returns `skip` when upstream GAM is absent from PRISM workflow capture state** — export and workflow status may proceed without material-body checking. (`lib/page-gam-materials-preserve.js` ~1507–1515; `app.js` `applyPageCompositionMaterialsClosureCaptureState`) |
| **ED-53-04** | **Workflow step completion (`workflowNextStepBtn`) does not consult `workflowRunPageMaterialsClosureValidation`.** Material-closure failure is recorded in status but Next still sets `workflowRunStepCompleted[sid] = true`. (`app.js` ~39505–39597 vs `workflowRunCaptureGatesBlockWorkflowAdvance` ~11314–11325) |
| **ED-53-05** | **Utilities HTML export is gated on material-closure `fail`** (when composition validation runs with upstream). (`app.js` `runUtilityPageExportPipeline`, `pageMaterialsClosureBlocksExport`) |
| **ED-53-06** | **Prompt contracts contain both strict preservation language and `generation_notes.limitations` escape hatches** for constraints that cannot be met. (`lib/ld-design-page-compose-contract.js`, `lib/ld-materials-copy.js`, domain §18 page artefact) |
| **ED-53-07** | **At baseline `04c9e81`, activity omission on utilities compose path can pass when test expects fail.** `tests/utility-page-composition-closure.test.js:156` — silent omission / `generation_notes` mutation without hard fail. |
| **ED-53-08** | **In representative artefact audits, Design Page JSON is the first artefact in the chain showing substantive material-body loss; rendered HTML matches Design Page JSON** (renderer not inventing loss). User corpus + Sprint 50 Marx traces; not a single committed E2E fixture in Sprint 53 folder. |
| **ED-53-09** | **GAM merge runs before material-closure validation** on capture/utilities compose path (`applyPedagogicCognitionSemanticsToComposedPage` → `applyComposedPageGamMaterialsPreserve` then `validatePageMaterialsClosure`). Validator judges post-merge artefact. |
| **ED-53-10** | **Canonical pedagogic support elements are explicitly named in committed registries** (`FIELD_PRESERVATION_FIELD_IDS`, `page-role-registry.js`, `episode-plan-population-contract.js` `FUNCTION_SPECS`, domain artefact schemas). Catalogued in `SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md` (83 rows). |

---

## Working hypotheses (WH)

*Plausible; require artefact-chain measurement in Sprint 54. Do not treat as findings.*

| ID | Hypothesis |
| -- | ---------- |
| **WH-53-01** | **Primary fidelity loss occurs at Copilot Design Page generation** (prompt disobedience, output limits), before PRISM validation — because defective pages are produced externally with condensation, synopsis substitution, and limitation excuses. |
| **WH-53-02** | **Fidelity loss sometimes occurs at GAM generation** (thin bodies, catalogue synopsis) while DLA obligations are satisfied — Step 7 complete but bodies not closure-grade. |
| **WH-53-03** | **Type-key collapse during GAM→page merge** (`pageFieldKeyForMaterial`, longest-per-key merge) drops per-`material_id` bodies even when merge runs. |
| **WH-53-04** | **`pelGamStripRedundantParagraphsFromText` removes connective GAM exposition** that overlaps PEL row fields — display-oriented dedup mutates perceived fidelity. |
| **WH-53-05** | **Activity-row PEL fields are preserved more reliably than GAM material bodies** on Design Page compose (Sprint 50 persistence-path pattern may still apply selectively). |

---

## Archived / rejected hypotheses (AH)

*Investigated and disproven or architecturally rejected during Sprint 53.*

| ID | Hypothesis | Disposition |
| -- | ---------- | ----------- |
| **AH-53-01** | Renderer is the **primary** location of material-body loss | **Rejected** — HTML faithful to DP JSON in audited runs |
| **AH-53-02** | PRISM **truncates or strips** upstream GAM before Design Page prompt assembly | **Rejected** — no committed pre-prompt truncation path found; prompts embed upstream when in workflow state |
| **AH-53-03** | **Missing-ingredients** hypothesis (pedagogy absent upstream) | **Rejected** (reaffirmed from Sprints 42–50) — structures exist; realisation/preservation is the gap |
| **AH-53-04** | **Run-capture retrieval / Copy run output / PRISM-side Copilot output injection** as fix | **Architecturally rejected** — outside PRISM scope per §2 constraints |
| **AH-53-05** | **Placeholder-only detection at baseline blocks live capture** | **Rejected for `04c9e81`** — lib exists; not wired to live gates at bootstrap (ED-53 context) |
| **AH-53-06** | Sprint 53 should **reopen Sprint 52 education-quality** implementation | **Rejected** — sprint separation maintained |

---

## Architectural corrections discovered during sprint

1. **Execution boundary (reaffirmed, now closure-grade):** PRISM = prompts + contracts + validation of **supplied** artefacts + renderer. Copilot = generation. No observability bridge without architectural change.

2. **Validation carve-out (clarified):** In-scope validation is **post-supply** (paste, Utilities, tests). Out-of-scope: runtime recovery, automatic upstream retrieval from Copilot.

3. **Acceptance vs validation gap:** “Accepted” in workflow UI ≠ validator pass. Step completion and `workflowRunCaptureGatesBlockWorkflowAdvance` omit material closure.

4. **Evidence standard (institutionalised):** Defects require committed test, code, fixture, or reproducible baseline — not chat conclusions. Quarantined `_archive/failed-investigation-2026-06-29/` excluded from baseline.

5. **Investigation-primary framing:** Developer artefact-chain audit (EP→DLA→GAM→DP→HTML) is a **manual discipline**; PRISM does not perform it automatically.

---

## Outstanding questions

**Primary unresolved question at sprint close:**

> **Where does pedagogic fidelity first degrade between upstream artefacts and learner output?**

Sub-questions for Sprint 54:

1. At which stage (EP, DLA, GAM, LS, Copilot DP compose, PRISM merge, renderer) does each **canonical element** first fail the A/B/C audit checklist?
2. Is fidelity loss **uniform** across element families (PEL row fields vs GAM materials vs wrapper sections)?
3. Does fidelity loss correlate with **Copilot-only execution** (no GAM in PRISM state) vs **full paste workflow**?
4. Which `generation_notes.limitations` patterns precede material-body loss in real artefacts?

---

## Deferred work

| Item | Reason deferred |
| ---- | ---------------- |
| Full artefact-chain audit with **fresh committed fixture set** | Sprint 54 charter |
| Workflow **Next** gate on material closure | Implementation; needs Sprint 54 measurement first |
| `workflowRunCaptureGatesBlockWorkflowAdvance` inclusion of material closure | Same |
| Weak types: `misconception_note`, `rubric`, `quality_criteria` registry coverage | Unevaluated in committed `lib/` |
| Prompt tightening beyond contracts already edited in working tree | Depends on audit locating first loss stage |
| Sprint 52 education-quality track | Remains paused |
| `_archive/failed-investigation-2026-06-29/` recovery | Quarantined; not baseline evidence |

**Note:** Phase 1/2 material-closure code (`validatePageMaterialsClosure`, tests) may exist in working tree beyond `04c9e81`. Sprint 53 closure treats that as **advanced implementation**, not closure criterion. Verify with `git log` / `git status` at Sprint 54 entry.

---

## Decision to close sprint

**Sprint 53 is closed** because:

1. Investigation discipline and architecture boundaries are **documented and adopted** (context pack, evidence standard, quarantine).  
2. **Established defects** and **rejected hypotheses** are recorded with ED/WH/AH separation.  
3. **Canonical pedagogic fidelity model** and **audit matrix** exist for repeatable measurement.  
4. Remaining work is **measurement and stage-localisation** — chartered as **Sprint 54 Pedagogic Fidelity Audit**, not open-ended Sprint 53 implementation.

**Sprint 53 did not meet** the original charter’s “output defect removed” end state. It **met** the investigation and audit-design objectives required before safe fixes.

---

## Handover to Sprint 54

| Read first | Path |
| ---------- | ---- |
| Sprint 54 context pack | `../2026-06-29-sprint-54-pedagogic-fidelity-audit/SPRINT-54-CONTEXT-PACK.md` |
| Audit matrix | `SPRINT-53-PEDAGOGIC-FIDELITY-AUDIT-MATRIX.md` |
| This closure | `SPRINT-53-CLOSURE-REPORT.md` |

**Do not re-investigate:** renderer-as-primary-loss, PRISM pre-prompt truncation, missing-ingredients, Copilot injection plumbing (AH table above).

**Start Sprint 54 with:** one representative workflow; full artefact chain; matrix rows A1–C7.

---

*End of Sprint 53 closure report.*
