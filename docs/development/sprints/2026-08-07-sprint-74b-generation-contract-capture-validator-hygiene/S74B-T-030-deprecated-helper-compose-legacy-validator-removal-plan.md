# S74B-T-030 — Deprecated Helper, Compose-Path and Legacy-Validator Removal Plan

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Task:** S74B-T-030  
**Status:** **Done** (2026-08-07) — **planning only**; no runtime execution  
**Mode:** Evidence + removal design — **no production code, test, or fixture changes**  
**Authority:** [S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture) (**Accepted**) · [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation) (**Accepted**) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) (**Accepted**) · [S74B-T-010](S74B-T-010-generation-pipeline-architectural-discovery.md) · [S74B-T-020](S74B-T-020-compose-vs-partial-contract-role-documentation.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Source revision:** `9a28e7b26e5c2ec45023703199ea3ae2f716af81`  
**Evidence time (UTC):** 2026-08-07T08:15:58Z  
**Policy reconciliation:** 2026-08-07 — `S74-D09` / `S74B-D03` (pre-release Compatibility not default)

---

## 1. Executive summary

Under **S74B-D02**, **S74B-D03**, and programme **S74-D09**, T-030 defines the **exact, bounded** removal/consolidation plan for:

1. Obsolete full-compose page-construction surfaces  
2. Deprecated PR-W\* helper aliases / wrappers  
3. Four live always-pass `{ ok: true, legacy: true }` capture-validator shims  
4. Duplicate injection ownership (compose vs partial) already classified in T-020  

**Governing page-construction architecture (do not alter in T-040 beyond removing obsolete alternatives):**

```text
workflow step prompt
  → partial contract
  → external model
  → capture
  → validate / normalize
  → deterministic assemble
  → post-assembly composition validation
  → renderer hand-off
```

**Governing Compatibility rule (`S74-D09` / `S74B-D03`):**

> Preserve current intended functionality, not historical pre-release data shapes or superseded implementation behaviour.

> Compatibility is opt-in by explicit product requirement, not opt-out by historical existence.

**T-040 must not begin until this plan is accepted as the execution checklist.** This document does not delete code. Removals remain ownership-evidenced; every intermediate commit must stay verifiable (green).

---

## 2. Binding decisions

| ID | Status | Implication |
| -- | ------ | ----------- |
| **S74B-D02** | **Accepted** (2026-08-07) | Partial + assemble = sole definitive architecture; compose = obsolete |
| **S74-D09** | **Accepted** (2026-08-07) | Pre-release historical Compatibility is not a default requirement |
| **S74B-D03** | **Accepted** (2026-08-07) | Old local workflow/runstate Compatibility does not block Domain B rationalisation |

---

## 3. Scope / non-scope

### In scope for planned removal (T-040)

| Cluster | Surfaces |
| ------- | -------- |
| **A — Compose path** | `lib/ld-design-page-compose-contract.js`; `index.html` script tag; `app.js` resolve/bootstrap/build/apply compose; PR-W3-2 aliases; compose-only test API exports; compose-exclusive tests/docs comments claiming “canonical compose” |
| **B — PR-W\* thin aliases** | `@deprecated` wrappers that only delegate to current `lib/` owners (math, rhetoric, table fidelity, compose) |
| **C — Legacy capture shims** | Four always-pass branches in `validate*OrPageCapture` |
| **D — Docs/residue** | Active comments/headers implying compose is supported or “canonical” lifecycle |

### Explicitly out of scope (do not remove / rewrite)

| Item | Reason |
| ---- | ------ |
| `lib/ld-design-page-partial-contract.js` | Supported Design Page contract (D02) |
| `lib/page-vnext-assemble.js` / `assembleVNextPageFromPartials` | Definitive page merge owner |
| P11a composition validation | Supported gate |
| Create Workflow / brief / elicitation | Formation — not Domain B hygiene rewrite |
| Learner renderer / export pipeline | Sprint 74A |
| Live non-deprecated self-directed builders (e.g. GAM PEL, material shape, DLA framing) | Still-called current scaffolds — **not** PR-W thin aliases |
| `lib/ld-materials-copy.js`, `ld-table-fidelity.js`, `ld-self-directed-rhetoric.js`, `ld-math-render.js` | Definitive owners of delegated responsibilities |
| Sprint 74C fixture/repo hygiene | Separate sprint |
| Pedagogy / pack content redesign | Non-scope |

---

## 4. Inventory matrices

### 4.1 Cluster A — Full compose surfaces

| Symbol / asset | File | Callers (current evidence) | Classification | Planned action |
| -------------- | ---- | -------------------------- | -------------- | -------------- |
| `PRISM_LD_DESIGN_PAGE_COMPOSE` / module | `lib/ld-design-page-compose-contract.js` | Loaded by `index.html`; resolved in `app.js`; required by compose/episode/materials tests | Obsolete exclusive | **Remove** module + script tag after tests retargeted |
| `resolveLdDesignPageComposeLib` / inline bootstrap | `app.js` ~12870–13407 | Compose build path | Obsolete | **Remove** with compose path |
| `buildLdDesignPageComposePromptBlock` | `app.js` + lib | `applyLdDesignPageComposeContractToDraft`; test API; `ld-design-page-compose-contract.test.js` | Obsolete | **Remove** |
| `applyLdDesignPageComposeContractToDraft` | `app.js` ~13467 | `applyWorkflowStepRuntimePromptAugmentations` (~14560); tests | Obsolete inject (no-ops when partial enabled) | **Remove** call + function |
| `ldDesignPageComposeAlreadyPresent` / related markers | `app.js` | Compose apply | Obsolete | **Remove** |
| `buildDesignPageActivityMaterialsFidelityPromptBlock` | `app.js` ~13864 PR-W3-2 | Test API only (no in-app call sites beyond definition) | Obsolete alias → compose | **Remove** with compose |
| `applyDesignPageActivityMaterialsFidelityContractToDraft` | `app.js` ~13869 PR-W3-2 | Test API only | Obsolete alias | **Remove** |
| Script tag | `index.html` ~1088 | Browser load | Obsolete bootstrap | **Remove** |
| Pack wording | `domain-learning-design-step-patterns.md` | Already says compose = rollback/legacy | Active docs | **Update** in T-040 docs slice: remove rollback wording that implies compose remains a product mode; state removed/obsolete |

**Ownership hand-off after removal:** Design Page prompt injection → **partial only**; page completeness → **assemble + P11a**.

### 4.2 Cluster B — PR-W\* thin aliases (non-compose)

| Symbol | Delegates to | In-app production callers | Test / API | Planned action |
| ------ | ------------ | ------------------------- | ---------- | -------------- |
| `buildMathSafeOutputContractPromptBlock` | `buildLdMathRenderPromptBlock` | **None** (definition + test API; `mathjax-producer-prompt-contract.test.js` asserts alias) | Test proves alias | **Remove** alias; retarget test to canonical builder |
| `buildSelfDirectedLearnerActionRhetoricPromptBlock` (+ 9 siblings PR-W1-4) | `buildLdSelfDirectedRhetoricPromptBlock` | **None** beyond definitions | Historical docs / possible test API | **Remove** aliases after grep for external test usage |
| `buildSelfDirectedGamTableRowAdequacyPromptBlock` | `buildLdTableFidelityPromptBlock({ role: "author" })` | **None** beyond definition | — | **Remove** alias |

**Do not classify as PR-W thin aliases (retain unless separate inventory proves unused):**

- `buildSelfDirectedLearnerPageMaterialShapePromptBlock`  
- `buildSelfDirectedTimelineSequencingAlignmentPromptBlock`  
- `buildSelfDirectedLearnerPageActivityFramingPromptBlock`  
- `buildSelfDirectedGam*` live scaffolds (PEL, voice, reading, self-study materials)  
- `applyMathSafeOutputContractToDraft` (live apply path — different from deprecated **build** alias)

### 4.3 Cluster C — Legacy always-pass capture shims

| Function | Approx line | Shim condition | Return | Live callers |
| -------- | ----------- | -------------- | ------ | ------------ |
| `validateDlaOrPageCapture` | ~9745–9746 | `activities[]` / `learning_activities` without modern v2 page path | `{ ok: true, legacy: true }` | Strict JSON dispatch ~12488; tests |
| `validateLearningSequenceOrPageCapture` | ~10025 | `timeline` / `activities_used` / … | same | ~12390 |
| `validateDesignPageOrPageCapture` | ~10367 | `sections` / `activity_materials` / `session_materials` | same | ~12409 |
| `validateGamOrPageCapture` | ~10482–10483 | `activity_materials` / `session_materials` | same | ~12518 |

**Planned action (authorised by S74B-D03):** Replace shims with **fail-closed** unrecognized-shape errors (or route only to modern validators). Do **not** silently accept old shapes. Do **not** create migration logic solely for old pre-release captures. Current partial/modern capture shapes remain protected.

**Test impact:** `tests/page-partial-capture-validate.test.js` — `"legacy path still follows existing validation path"` **expects** `legacy: true`. T-040 must **replace** that test with: obsolete shapes **rejected** under current architecture (not “migrated then accepted”).

**Retain:** Modern branches inside the same functions (partial validators, enriched-page validators, shell validators).

### 4.4 Cluster D — Duplicate injection ownership

| Concern | Obsolete owner | Definitive owner | Action |
| ------- | -------------- | ---------------- | ------ |
| Design Page contract inject | Compose apply | Partial apply | Remove compose call from augmentation chain |
| Mutual gating | Both apply functions | Partial-only inject | Delete compose branch; optional assert partial flags on DP steps |
| Materials fidelity at DP | Compose + materials-copy embed | GAM partial + assemble + P11a | No new DP materials-compose path |

---

## 5. Persisted-data matrix (current supported vs historical pre-release)

Under **S74-D09** / **S74B-D03**, distinguish data that must remain valid from historical pre-release state that does **not** block removal.

| Class | Examples | Blocks removal? | T-040 stance |
| ----- | -------- | --------------- | ------------ |
| **Current supported** | New WFs with `pageEnrichmentV2` + `partialPageOutputs` true; modern partial capture shapes; assemble inputs; load migration forcing both flags true for Sprint 58 page-pipeline WFs | **Yes** — preserve | Keep partial path, assemble, P11a, modern validators |
| **Historical pre-release** | Old local runstate with obsolete capture shapes; in-memory / test `partialPageOutputs: false`; compose rollback fixtures | **No** | Fail-closed / remove; re-run / re-capture may be required |
| **Existing load migration** | `migrateWorkflowToSprint58PageArtefactContract` | N/A — already converges to supported | **Retain** as current supported convergence (not a new Compatibility shim for obsolete compose) |

### 5.1 `partialPageOutputs: false`

Treat as **obsolete** unless a current supported responsibility is evidenced (none found in T-020). Plan **removal of dead false-mode branches** rather than retaining them for historical workflow Compatibility. After compose removal: **hard-error or ignore-false → partial-only**; do **not** revive compose.

### 5.2 Compose rollback

**No Compatibility requirement remains.** Tests/fixtures whose only purpose is rollback preservation are **removal candidates**.

### 5.3 Legacy capture shims

Fail-closed behaviour is **authorised in principle**. Do **not** add migration logic solely for old pre-release captures. Current partial/modern shapes remain protected.

### 5.4 No new Compatibility migrations

**No new schema/migration layer** in T-030 or T-040 purely to preserve obsolete pre-release state. T-040 may strengthen comments on the existing Sprint 58 load migration only if needed for clarity.

---

## 6. Exact T-040 execution slices (ordered)

Each slice = one coherent reversible commit + focused verification. **Every intermediate commit must remain verifiable (green).** Stop on unexpected behaviour. Retarget or delete compose-dependent tests **before or atomically with** module deletion — do **not** knowingly land a broken intermediate commit.

### Slice S1 — Remove Design Page compose injection from live augmentation

| Field | Content |
| ----- | ------- |
| Change | Delete `applyLdDesignPageComposeContractToDraft(...)` call from `applyWorkflowStepRuntimePromptAugmentations`; keep partial apply |
| Verify | Update any inject-path expectations in the **same commit** so suites stay green; Design Page prompt under partial WF still has PARTIAL marker; compose marker never present on supported path |
| Rollback | Revert commit |
| Risk | Low if partial flags always true on supported WFs |

### Slice S2 — Retarget or remove compose-oriented tests (before or with module deletion)

| Field | Content |
| ----- | ------- |
| Change | Delete or rewrite compose-dependent tests **before** (or in the same commit as) module deletion: `ld-design-page-compose-contract.test.js`; compose assertions in `design-page-materials-fidelity.test.js`, `workflow-self-directed-activity-framing-adoption.test.js`, `page-episode-plans-closure.test.js`; phase0 “rollback retains compose” → remove or invert to “compose absent / partial required”; suites that only load compose for bootstrap — switch to partial or drop |
| Verify | Focused Node suites green with **no** remaining require of compose module (or require removed atomically in S3) |
| Label | Supporting evidence only |
| Policy | Rollback-preservation tests are removal candidates under S74B-D03 |

### Slice S3 — Remove compose builders, aliases, bootstrap, `index.html` script, lib module

| Field | Content |
| ----- | ------- |
| Change | Remove compose lib file; script tag; `app.js` resolve/bootstrap/build/apply/PR-W3-2; prune `prismTestApi` compose exports; remove dead `partialPageOutputs: false` compose branches |
| Verify | App loads; no 404 on scripts; grep clean for `LD-DESIGN-PAGE-COMPOSE` / `PRISM_LD_DESIGN_PAGE_COMPOSE` in runtime paths; suites still green |
| Depends | S1; **S2 complete or same atomic commit** — never delete module while tests still require it |
| Risk | Medium — coordinate with S2 |

### Slice S4 — Remove PR-W1 thin aliases (math / rhetoric / table)

| Field | Content |
| ----- | ------- |
| Change | Remove deprecated build wrappers listed in §4.2; update `mathjax-producer-prompt-contract.test.js` to canonical builder; prune test API aliases |
| Verify | Grep zero for removed symbols; math/rhetoric/table suites green |
| Risk | Low — no in-app call sites evidenced |

### Slice S5 — Remove four legacy always-pass capture shims

| Field | Content |
| ----- | ------- |
| Change | Replace `{ ok: true, legacy: true }` branches with fail-closed unrecognized-shape errors (preserve modern v2/partial branches). **No** migration helper for old pre-release captures |
| Verify | Partial capture suites green; rewrite legacy-path test to expect **failure** |
| Risk | Medium — old local runstate may fail Next; **acceptable** under S74-D09 / S74B-D03 |
| Mitigation | Document re-run / re-capture; do not add Compatibility migration |

### Slice S6 — Active documentation + residue sweep

| Field | Content |
| ----- | ------- |
| Change | Align pack notes / architecture pointers / compose module absence; clear “rollback mode” product language; state historical pre-release Compatibility is not assumed |
| Verify | Residue sweep checklist (§8) |

### Slice S7 — Authoring export spot-check (supporting + browser if touching capture)

| Field | Content |
| ----- | ------- |
| Change | None if S1–S6 do not touch export; spot-check Preview still vNext |
| Verify | Static `index.html` load; Preview markers; no compose script |

**Do not combine all slices into one mega-commit** unless a pair (e.g. S2+S3) must be atomic to keep HEAD green.

---

## 7. Test / fixture disposition (plan only — do not change in T-030)

| Asset | Disposition in T-040 |
| ----- | -------------------- |
| `tests/sprint-58-phase0-design-page-partial-gates.test.js` | **Remove or rewrite** rollback-preservation cases; assert compose absent / partial required |
| `tests/sprint-58-phase1-design-page-domain-gates.test.js` | Update pack assertions if pack text drops “rollback/legacy compose” wording |
| `tests/sprint-58-flag-preservation-gates.test.js` | Keep current supported flag merge; **remove** false-mode branches that only protect obsolete compose |
| `tests/page-vnext-assemble.test.js` | Keep assemble; **remove/rewrite** “v2 rollback bypasses assembly” and other `!partial` Compatibility cases — `partialPageOutputs: false` is obsolete |
| `tests/ld-design-page-compose-contract.test.js` | **Delete** with module (S2 before/with S3) |
| `tests/page-partial-capture-validate.test.js` legacy case | **Replace** expectation (`legacy: true` → fail); no migration path |
| `tests/design-page-materials-fidelity.test.js` | Remove compose apply assertions; keep materials/VA product checks via partial/assemble where possible |
| `tests/page-episode-plans-closure.test.js` | Strip compose-marker dependency |
| `tests/mathjax-producer-prompt-contract.test.js` | Point at `buildLdMathRenderPromptBlock` |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Stop calling compose apply |
| Fixtures with `partialPageOutputs: true` / modern shapes | **Retain** (current supported) |
| Fixtures / cases only for historical `false` / compose rollback / legacy accept | **Removal candidates** |
| Historical sprint docs mentioning compose | **Historical** — do not rewrite; dated policy notes only |

---

## 8. Residue sweep checklist (after T-040 slices)

Search and classify every hit:

- `LD-DESIGN-PAGE-COMPOSE` / `PRISM_LD_DESIGN_PAGE_COMPOSE` / `ld-design-page-compose-contract`  
- `applyLdDesignPageComposeContractToDraft` / `buildLdDesignPageComposePromptBlock`  
- `buildDesignPageActivityMaterialsFidelity` / PR-W3-2  
- `buildMathSafeOutputContractPromptBlock` / PR-W1-3  
- `buildSelfDirectedLearnerActionRhetoricPromptBlock` (and PR-W1-4 siblings)  
- `buildSelfDirectedGamTableRowAdequacyPromptBlock` / PR-W1-1  
- `legacy: true` in capture validators  
- “rollback” / “compose contract” in **active** product docs  
- `index.html` script list  

Every remaining match: **removed** · **definitive owner** · **renamed** · **deferred with reason** · **historical evidence**.

---

## 9. Verification plan for T-040 (supporting vs deployment)

| Layer | Use |
| ----- | --- |
| Focused Node suites | Partial gates, assemble, partial capture validate, math/rhetoric/table, Authoring-related export shell if touched |
| Production browser | Static `index.html`; Design Page Copy shows partial marker not compose; Assemble + Preview still vNext |
| Grep residue | §8 |
| Non-proof | Broad suite totals; historical HTML exports |

---

## 10. Stop conditions for T-040

- Stop if removal requires rewriting live pedagogy pack prompts beyond Design Page compose wording  
- Stop if assemble or partial contract must be redesigned to “replace” compose  
- Stop if Authoring export / renderer regresses  
- Stop if a **current** Compatibility product requirement for compose / obsolete shapes is newly evidenced (escalate; would require amending D02 / D03 / D09 — historical existence alone is insufficient)  
- Stop if scope drifts into 74C or formation redesign  
- Stop if an intermediate commit would leave HEAD knowingly red (retarget tests first)

---

## 11. Risks

| Risk | Mitigation |
| ---- | ---------- |
| Old runstate captures fail validation after shim removal | Document re-capture; fail closed by design under S74-D09 — **no** Compatibility migration |
| Tests load compose as dependency soup | **S2 before/with S3**; never delete module while requires remain |
| Operators rely on “rollback” mental model | D02 + D03 + pack/docs update in S6 |
| Accidental deletion of live self-directed scaffolds | §4.2 retain list; ownership proof before each alias delete |
| Dead `!partial` / false-mode branches retained “just in case” | Remove under D03; historical state does not block |

---

## 12. Acceptance contribution

| AC | How T-030 contributes |
| -- | --------------------- |
| AC-03 | Ownership-proof removal plan (not zero-call-site alone) |
| AC-01 / AC-02 | Inventories complete for compose, PR-W\*, shims |
| AC-07 | Builds on T-020 roles under D02 |
| Enables T-040 | Exact slices S1–S7 (S2 tests before/with S3 module); Compatibility policy via D09/D03 |

---

## 13. Stop statement

S74B-T-030 is **Done** as planning (reconciled 2026-08-07 under **S74-D09** / **S74B-D03**). **S74B-D02** and **S74B-D03** are **Accepted**. Next: **S74B-T-040** (execute slices) — **not begun**. No production code, tests, or fixtures changed in this reconciliation. Sprint 74C remains **Not opened**.
