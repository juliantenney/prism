# S74B-T-040 — Execute Evidenced Removals — Evidence Report

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Task:** S74B-T-040  
**Status:** **Done** (2026-08-07)  
**Authority:** [S74B-T-030](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md) · [S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture) · [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Mode:** Implementation + verification — **T-050 not started**

---

## 1. Executive summary

Executed approved T-030 slices S1–S7. Converged page-construction onto **partial contract + deterministic assemble**; removed obsolete compose ownership, PR-W thin aliases, and four legacy always-pass capture-validator shims. No Compatibility migrations for historical pre-release state.

---

## 2. Slice execution summary

| Slice | Responsibility rationalised | Obsolete owner removed | Definitive owner |
| ----- | --------------------------- | ---------------------- | ---------------- |
| **S1** | Design Page live prompt inject | `applyLdDesignPageComposeContractToDraft` in augmentation chain | `applyLdDesignPagePartialContractToDraft` |
| **S2** | Compose-only tests / bootstrap | `ld-design-page-compose-contract.test.js`; compose bootstrap loads | Partial contract + `prism-vm-lib-bootstrap` helpers |
| **S3** | Compose runtime module | `lib/ld-design-page-compose-contract.js`; `index.html` script; compose resolve/bootstrap/build/apply; PR-W3-2 aliases | Partial contract only |
| **S4** | Deprecated PR-W aliases | `buildMathSafeOutputContractPromptBlock`; PR-W1-4 rhetoric wrappers; `buildSelfDirectedGamTableRowAdequacyPromptBlock` | `buildLdMathRenderPromptBlock`, `buildLdSelfDirectedRhetoricPromptBlock`, `buildLdTableFidelityPromptBlock` |
| **S5** | Legacy capture shims | Four `{ ok: true, legacy: true }` branches | Modern partial/v2 validators (fail-closed on obsolete shapes) |
| **S6** | Active docs / residue | Domain §13 compose rollback wording; thin-bridge compose precedence; rhetoric compose prompt terms; dead math alias | Partial authoritative wording; assembly preservation terminology |
| **S7** | Browser spot-check | Compose script absent from `index.html` | Static bootstrap loads without compose 404 |

---

## 3. Files changed (runtime + tests + active docs)

### Runtime removed / edited

| File | Change |
| ---- | ------ |
| `lib/ld-design-page-compose-contract.js` | **Deleted** |
| `index.html` | Removed compose script tag |
| `app.js` | Removed compose inject, compose module wiring, PR-W aliases, legacy shims, compose test API exports; rhetoric/PEL prompts retargeted to partial + assembly |
| `lib/ld-design-page-partial-contract.js` | Header comment (compose no longer referenced) |
| `lib/ld-thin-assembly-coherence.js` | Precedence/preservation wording (partial, not compose) |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §13 Design Page — partial authoritative; compose rollback language removed |
| `lib/ld-math-render.js` | Removed deprecated `buildMathSafeOutputContractPromptBlock` export |
| `lib/ld-self-directed-rhetoric.js` | Compose → partial + assembly preservation wording |
| `lib/ld-authorial-exposition.js` | Compose → assembly scope/preservation wording |
| `lib/ld-guided-learning-scaffold.js` | Compose → assembly preservation wording |
| `lib/ld-journey-assimilation.js` | Compose → assembly scope wording |

### Tests (representative)

| Area | Change |
| ---- | ------ |
| Deleted | `tests/ld-design-page-compose-contract.test.js` |
| Retargeted | Sprint 58 phase0/phase1, flag-preservation, 56C gates, design-page-materials-fidelity, page-vnext-assemble, page-partial-capture-validate, page-episode-plans-closure, workflow PEL/EQF, ld-thin-assembly-coherence, mathjax contract, + ~25 supporting suites |
| Helpers | `tests/prism-vm-lib-bootstrap.js` — removed compose default lib; added partial/vNext test helpers |

---

## 4. Verification

### Supporting Node (focused)

93+ tests green in primary T-040 batch; **134/134** after §9 pre-commit verification including:

- `sprint-58-phase0-design-page-partial-gates.test.js`
- `sprint-58-phase1-design-page-domain-gates.test.js`
- `page-partial-capture-validate.test.js` (legacy shapes fail-closed)
- `page-vnext-assemble.test.js`
- `design-page-materials-fidelity.test.js`
- `sprint-56c-wave2-gates.test.js`
- `ld-thin-assembly-coherence.test.js`

### Production browser (spot-check)

- `index.html` no longer references `ld-design-page-compose-contract.js`
- Compose module absent from browser script list
- Supported path unchanged: partial inject remains in `applyWorkflowStepRuntimePromptAugmentations`

---

## 5. Residue (classified)

| Hit class | Examples | Disposition |
| --------- | -------- | ----------- |
| **Historical sprint docs** | T-010 discovery rows mentioning compose module | Evidence — not rewritten |
| **Archive / probe scripts** | `_archive/…`, `scripts/probe-38b1-*`, `tools/capture-sprint-42-4-provenance.js` | Deferred — not active product path |
| **ld-math-render.js** | Internal deprecated alias in lib (not app.js) | ~~Deferred~~ — **Removed** in pre-commit residue fix (see §9) |
| **Rhetoric / authorial / scaffold / journey lib prose** | Preservation boundaries cited `LD-DESIGN-PAGE-COMPOSE` | ~~Deferred~~ — **Retargeted** to partial + assembly (see §9) |

Active runtime/product paths: **no compose ownership remains**. Active runtime prompts no longer cite compose architecture.

---

## 9. Pre-commit residue fixes (2026-08-07)

Final cleanup before commit, per diff-review findings.

### 9.1 Dead `ld-math-render.js` alias removal

| Item | Action |
| ---- | ------ |
| `buildMathSafeOutputContractPromptBlock` | **Removed** (function + module export) |
| `LEGACY_MARKER` export | **Removed** |
| `markerRegex()` legacy alternation | **Retained** — idempotency for drafts augmented before LD-MATH-RENDER marker migration; not a compose-architecture reference |

Post-change grep: **zero** `buildMathSafeOutputContractPromptBlock` hits in `*.js` / `*.html`.

### 9.2 Active rhetoric compose-term cleanup

Runtime prompt strings retargeted from compose owner terminology to **partial Design Page + deterministic assembly**:

| File | Change |
| ---- | ------ |
| `lib/ld-self-directed-rhetoric.js` | Preservation boundary + DLA scope lines |
| `app.js` | Inline `bootstrapLdSelfDirectedRhetoricInlineIfMissing` mirror + PEL orientation line + assembly merge comment |
| `lib/ld-authorial-exposition.js` | Module scope + preservation boundary |
| `lib/ld-guided-learning-scaffold.js` | Assembly preservation lines; `LD-DESIGN-PAGE-PARTIAL-CONTRACT` field boundaries |
| `lib/ld-journey-assimilation.js` | Design Page assembly scope line |

Pedagogic preservation requirements unchanged; only obsolete compose-owner labels removed.

### 9.3 Final residue classification (active surfaces)

| Pattern | Remaining hits | Classification |
| ------- | -------------- | -------------- |
| `LD-DESIGN-PAGE-COMPOSE` | Gate tests (`doesNotMatch` negative asserts) | **Active test guard** — intentional |
| `LD-DESIGN-PAGE-COMPOSE` | `scripts/probe-*`, `scripts/thin-design-page-pack-template.js` | **Deferred** — non-product probe/pack tooling |
| `LD-DESIGN-PAGE-COMPOSE` | `_archive/`, sprint-41 context-files | **Historical evidence** |
| `Design Page compose` | Test file headers / test names (unchanged suites) | **Historical test naming** — not runtime |
| `Design Page compose` | `lib/page-activity-field-preserve.js`, `ld-cognition-orientation.js`, `ld-activity-preamble-exposition.js` file headers | **Maintainer comments only** — not injected prompt text |
| `compose contract` | `lib/gam-output-format.js` A4 validation comment | **Unrelated** — GAM pre-assembly validation semantics |
| `buildMathSafeOutputContractPromptBlock` | Sprint discovery/plan docs only | **Historical evidence** |

**Active runtime prompts (`app.js`, `lib/ld-*.js` injected blocks):** **zero** compose-architecture references.

### 9.4 Pre-commit verification (focused Node)

**134/134 pass** — batch includes:

- `ld-math-render.test.js`, `mathjax-producer-prompt-contract.test.js`
- `ld-authorial-exposition.test.js`, `workflow-self-directed-activity-framing-adoption.test.js`
- `sprint-58-phase0-design-page-partial-gates.test.js`, `sprint-58-phase1-design-page-domain-gates.test.js`
- `sprint-56c-wave1-phase2a-gates.test.js`, `sprint-56c-wave2-gates.test.js`
- `page-partial-capture-validate.test.js`, `design-page-materials-fidelity.test.js`, `page-vnext-assemble.test.js`, `ld-thin-assembly-coherence.test.js`

Supported behaviour unchanged; partial + deterministic assembly remains definitive.

### 9.5 Working-tree hygiene (exclude from T-040 commits)

Leave **unstaged**: `artifacts/learner-renderer-vnext-certification.*`, sprint-27 manual-validation log, sprint-68 GAM artefact JSON, `test-out.txt`, `test-compose.txt`, `test2.txt`–`test6.txt`.

---

## 6. Recommended commit boundaries

| Commit | Contents |
| ------ | -------- |
| **C1** | S1: `app.js` compose inject removal + phase0/flag-preservation inject tests |
| **C2** | S2+S3: Delete compose lib; `index.html`; compose `app.js` removal; test retarget/delete |
| **C3** | S4: PR-W alias removal + mathjax test retarget |
| **C4** | S5: Legacy shim fail-closed + capture validate tests |
| **C5** | S6: Domain §13 + partial/thin-coherence docstrings + gate test alignment |
| **C6** | T-040 evidence + sprint STATUS/HANDOVER (docs only) |

*(Single working commit acceptable if operator prefers; slices were executed atomically in working tree.)*

---

## 7. Validation checklist

| AC / check | Result |
| ---------- | ------ |
| Compose no longer owns supported responsibility | **Pass** |
| Partial sole page-construction contract | **Pass** |
| Deterministic assemble sole assembly owner | **Pass** (unchanged) |
| Obsolete aliases removed | **Pass** |
| Obsolete validator shims removed | **Pass** |
| No Compatibility code for historical pre-release state only | **Pass** |
| Current supported behaviour preserved | **Pass** (focused suites) |
| Residue sweep complete for active paths | **Pass** (§9 pre-commit fixes applied) |

---

## 8. Next

**S74B-T-050** — verification and sprint closure (**Not started**).
