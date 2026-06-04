# PR-W1-4 — LD-SELF-DIRECTED-RHETORIC (PROPOSED — not wired in `app.js` yet)

**Date:** 2026-06-04  
**Change class:** CC-MODULE  
**Baseline:** post PR-W1-3 four-step sum **156,571** (self-directed augmented)  
**Wave 1 target:** **≤129,865** (−15% vs 38B-1 **152,782**) or documented deferral at PR-W1-5  
**Canonical draft:** `lib/ld-self-directed-rhetoric.js` (created; **pending** `app.js` integration)

---

## 1. Inventory — ten rhetoric blocks → one module

38B-2 names a **9-block** stack; runtime today appends **ten** markers via `applyLearnerActionRhetoric` in `applySelfDirectedLearnerPageStepScaffoldsToDraft` (Metacognitive + Epistemic + Transfer were split across closure cluster).

| # | Current builder / marker | Est. chars | Taxonomy |
|---|--------------------------|----------:|----------|
| 1 | `buildSelfDirectedLearnerActionRhetoricPromptBlock` | ~1,350 | L7 voice + L5 task fields |
| 2 | `buildSelfDirectedWorkedExampleFadingPromptBlock` | ~2,450 | L5 pedagogical preservation |
| 3 | `buildSelfDirectedEmbeddedFeedbackMisconceptionPromptBlock` | ~2,100 | L5 misconception / QA |
| 4 | `buildSelfDirectedConceptProcedureIntegrationPromptBlock` | ~2,200 | L5 concept/procedure |
| 5 | `buildSelfDirectedMetacognitiveJudgementPromptBlock` | ~1,850 | L5 closure / judgement |
| 6 | `buildSelfDirectedSessionOrientationRhetoricPromptBlock` | ~2,050 | L5 orientation |
| 7 | `buildSelfDirectedConceptualTensionDifficultyPromptBlock` | ~2,650 | L5 difficulty framing |
| 8 | `buildSelfDirectedIntellectualProgressionPromptBlock` | ~2,400 | L5 progression |
| 9 | `buildSelfDirectedEpistemicSynthesisClosurePromptBlock` | ~2,700 | L5 closure |
| 10 | `buildSelfDirectedTransferDurableUnderstandingPromptBlock` | ~2,550 | L5 transfer |
| | **Stack total (per append)** | **~22,300** | |
| | **Canonical `LD-SELF-DIRECTED-RHETORIC` (core)** | **3,412** | L5 + L7 merged |
| | **+ role rider (GAM / Assessment / Design Page)** | **+127–196** | step-specific preserve/author |

**38B-1 audit estimate:** ~**75k** rhetoric duplicated across four heavy steps ([38B-1-prompt-audit.md](38B-1-prompt-audit.md) § consolidation).

**Projected four-step savings (rhetoric only):** ~(22,300 − 3,550) × 4 ≈ **~75,000 chars** → post-W1-4 sum ≈ **~81,500** (well under **129,865** if estimate holds).

---

## 2. Classification

| Class | Treatment |
|-------|-----------|
| **Essential → canonical** | Learner voice, worked/faded sequence, Check your thinking, step → meaning, journey/tension/progression, closure/transfer bullets, L4 subordination, facilitator ban |
| **Duplicated → remove** | Cross-block “Design Page preserve verbatim” / “GAM realise when specified” repeated 6× → **role riders** (1 line each) |
| **Duplicated → remove** | Metacognitive vs Epistemic vs Transfer overlap (study_tips caps, avoid reflect-on-learning) → single **Closure / transfer** stanza |
| **Step-specific → stay outside module** | DLA material shape, activity framing, output contract, timeline; GAM reading/voice; Design Page field preservation; Sprint 38; LD-TABLE/MATERIALS/MATH |
| **Owned by L4/L7 modules — not reintroduced** | Pipe tables, materials verbatim, TeX delimiters |

---

## 3. Canonical module shape

**Marker:** `LD-SELF-DIRECTED-RHETORIC (auto-applied)`  
**Roles:** `core` (DLA), `gam`, `assessment`, `design_page` — optional one-line rider appended.

**Idempotency:** `rhetoricAlreadyPresent()` matches new marker, module ID line, or **any legacy** of the ten marker titles (safe re-apply during transition).

---

## 4. Proposed `app.js` wiring (NOT applied)

### 4.1 Replace ten appends (lines ~8838–8891)

```javascript
    if (applyLearnerActionRhetoric) {
      draftBody = applyLdSelfDirectedRhetoricContractToDraft(draftBody, context);
    }
```

### 4.2 New helpers (after `bootstrapLdMathRenderInlineIfMissing`, mirror W1-3)

- `resolveLdSelfDirectedRhetoricLib()`
- `bootstrapLdSelfDirectedRhetoricInlineIfMissing()` — inline mirror of `lib/ld-self-directed-rhetoric.js`
- `buildLdSelfDirectedRhetoricPromptBlock(options)`
- `applyLdSelfDirectedRhetoricContractToDraft(draftText, context)` — role from step id; skip if `rhetoricAlreadyPresent`

### 4.3 Deprecate ten `buildSelfDirected*Rhetoric*` functions

Replace bodies with:

```javascript
  /** @deprecated PR-W1-4 — use buildLdSelfDirectedRhetoricPromptBlock */
  function buildSelfDirectedLearnerActionRhetoricPromptBlock() {
    return buildLdSelfDirectedRhetoricPromptBlock();
  }
```

(or remove and fix tests — preferred: **single** export on `__PRISM_TEST_API`).

### 4.4 `stripInternalPromptContractsFromVisibleText`

Add leak patterns:

- `/LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i`
- `/LD-SELF-DIRECTED-RHETORIC \| Layers: L5/i`

### 4.5 Loader / probe / test bootstrap

- `index.html`: `<script src="lib/ld-self-directed-rhetoric.js?v=20260604-1"></script>` before `app.js`
- `tests/prism-vm-lib-bootstrap.js`: add lib path
- `scripts/probe-38b1-ld-workflow-prompt-audit.js`: preload lib

---

## 5. Projected probe (self-directed augmented)

| Step | Post W1-3 | Projected post W1-4 | Δ (est.) | Markers post |
|------|----------:|----------------------:|---------:|-------------:|
| DLA | 39,106 | ~24,800 | **~−14,300** | **5** (was 14) |
| GAM | 37,226 | ~22,900 | **~−14,300** | **6** (was 15) |
| Assessment | 32,034 | ~17,700 | **~−14,300** | **2** (was 11) |
| Design Page | 48,205 | ~33,900 | **~−14,300** | **6** (was 15) |
| **Sum** | **156,571** | **~99,300** | **~−57,200** | |

**Wave 1 −15% target (129,865):** **likely met** on rhetoric merge alone; PR-W1-5 probe required to confirm.

**If under-delivers:** remaining duplication = pack session-orientation lines, PEL orientation/reasoning blocks, DLA output contract bulk — documented for W1-5 / Waves 2–3.

---

## 6. Test / validation plan (on apply)

| Check | Action |
|-------|--------|
| L8-01 | `node --test tests/*.test.js` — update `workflow-self-directed-activity-framing-adoption.test.js` markers → `LD-SELF-DIRECTED-RHETORIC`; keep substance regexes |
| New | `tests/ld-self-directed-rhetoric.test.js` — module metadata, legacy idempotency regex, role riders |
| GAP-02 | Marker count **decreases** on all four heavy steps |
| S11 | Facilitated brief — no rhetoric append |
| 38B-6 checklist | Sign on merge PR |

---

## 7. Files in this proposal

| File | Status |
|------|--------|
| `lib/ld-self-directed-rhetoric.js` | **Drafted** (3,412 chars core) |
| `app.js` | **Not modified** — awaiting approval |
| `index.html`, probes, tests | **Not modified** |
| `observations/38B-W1-4-ld-self-directed-rhetoric-mapping.md` | Create on apply after probe |

---

## 8. Approval

Reply **apply W1-4** to wire `app.js`, loaders, tests, run probe + full suite, and publish final mapping with measured sizes.
