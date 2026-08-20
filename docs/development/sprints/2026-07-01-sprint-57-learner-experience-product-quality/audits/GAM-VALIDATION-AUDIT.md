# GAM PRE-EMIT and Validation Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01

---

## 1. Executive finding

| Question | Answer |
|----------|--------|
| PRE-EMIT gate on GAM emit? | **No** |
| Validation systems on GAM path | **4** (sanitize, capture gate, stabilisation evaluator, compose contract) |
| Authoritative validation for workflow advance | **GAM-FMT capture gate** (`applyGamPackTextValidationToCapture`) |
| Duplicate validation layers? | **Yes** — prompt FAIL taxonomies + capture tiers + sanitization overlap on facilitator/depth |
| Capture-side repair (DLA S56 analogue)? | **Partial** — `normalizeGamPackTextForCompose` appends transfer word-band; no scaffold repair |

---

## 2. Validation layer inventory

### Layer 1 — Prompt-side contract FAIL codes (emit-time guidance)

| Attribute | Value |
|-----------|-------|
| **Location** | Pack §6 `promptTemplate` (GAM-PRES, GAM-WB, FAIL F1–F9, AP, EV-GAM-FAIL, DEPTH-COLLAPSE) |
| **Purpose** | Teach model what constitutes instructional failure before generation |
| **Trigger** | Always present in seeded prompt (~15,145 chars base) |
| **Authority level** | Pack L4 — **guidance only** (not enforced programmatically on emit) |
| **Enforcement** | None at emit; relies on model compliance |

### Layer 2 — PRE-EMIT gate

| Attribute | Value |
|-----------|-------|
| **Location** | N/A on GAM path |
| **Comparison** | DLA has `DLA PRE-EMIT SCAFFOLD GATE` in `lib/ld-guided-learning-scaffold.js` (Sprint 56 SSOT) |
| **Finding** | GAM has **no** unified pre-return self-check block on the Copy/Run prompt |

### Layer 3 — Post-capture sanitization

| Attribute | Value |
|-----------|-------|
| **Location** | `app.js` `sanitizeSelfDirectedGamMaterialsOutput` (~10606) |
| **Purpose** | Strip facilitator headings/blocks; dedupe paragraphs overlapping upstream activity fields |
| **Trigger** | `shouldSanitizeSelfDirectedGamMaterialsOutput` — self-directed GAM step capture sync |
| **Authority level** | **Transform** (mutates captured text before state storage) |
| **Pipeline** | `pelGamStripFacilitatorBlocksFromText` → `pelGamStripRedundantParagraphsFromText` |

```10606:10627:app.js
  function sanitizeSelfDirectedGamMaterialsOutput(textOrValue, context) {
    // ...
    var stripFac = pelGamStripFacilitatorBlocksFromText(s);
    var stripDup = pelGamStripRedundantParagraphsFromText(stripFac.text, ctx);
```

### Layer 4 — Tiered capture gate (workflow hard gate)

| Attribute | Value |
|-----------|-------|
| **Location** | `app.js` `applyGamPackTextValidationToCapture` (~11858); `lib/gam-output-format.js` `validateGamPackTextCaptureGate` |
| **Purpose** | Block step completion on format/coverage failures; warn on thin bodies |
| **Trigger** | Capture sync for self-directed GAM when upstream DLA available |
| **Authority level** | **Authoritative** for workflow step completion (Sprint 44 tiered gate) |

| Tier | Code | Blocking? |
|------|------|-----------|
| 1 | GAM-FMT-01 JSON stub | Yes |
| 1 | GAM-FMT-02 missing Material:/Content: | Yes |
| 2 | GAM-FMT-03 material count | Yes (when upstream available) |
| 2 | GAM-FMT-05 activity coverage | Yes |
| 3 | GAM-FMT-04 thin Content bodies | Warning only |
| — | GAM-FMT-08 transfer word-band | Used in `validateGamTransferPrompts` / normalise (not always in tiered gate return) |

```354:424:lib/gam-output-format.js
  function validateGamPackTextCaptureGate(text, options) {
    // Tier 1–2 blockingErrors; Tier 3 warnings (GAM-FMT-04)
```

**Hook order** (Sprint 44):

```
sanitizeSelfDirectedGamMaterialsOutput
  → applyGamPackTextValidationToCapture(sanitized, ...)
```

### Layer 5 — Stabilisation evaluator (diagnostic)

| Attribute | Value |
|-----------|-------|
| **Location** | `app.js` `evaluatePelGamMaterialStabilisation` (~10795) |
| **Purpose** | Factory/probe warnings: facilitator language, timing choreography, upstream paragraph overlap |
| **Trigger** | Test API / probes — **not** wired as workflow hard gate in production capture path |
| **Authority level** | **Advisory** |

### Layer 6 — Compose-time contracts (downstream)

| Attribute | Value |
|-----------|-------|
| **Location** | `lib/gam-output-format.js` `validateGamA4ComposeContract`; `lib/page-gam-materials-preserve.js` |
| **Purpose** | A4 Evaluate marker preservation; GAM → Design Page merge fidelity |
| **Trigger** | Design Page compose / pre-compose validation |
| **Authority level** | **Downstream** — does not block GAM step; blocks compose quality |

### Layer 7 — Capture-side normalisation (repair-lite)

| Attribute | Value |
|-----------|-------|
| **Location** | `lib/gam-output-format.js` `normalizeGamPackTextForCompose` (~295) |
| **Purpose** | Patch A4 purpose lines; **append** transfer word-band sentence if missing |
| **Trigger** | Compose normalisation path — not full DLA-style capture repair |
| **Authority level** | **Transform** on specific markers |

```308:316:lib/gam-output-format.js
      function (_m, head, body) {
        if (/at\s+least\s+80\s+words/i.test(text)) return _m;
        return head + text + "\n\nWrite at least 80 words applying...";
```

### Layer 8 — Retry system prompt (non-production emit)

| Attribute | Value |
|-----------|-------|
| **Location** | `lib/gam-output-format.js` `buildGamOutputContractSystemPrompt` (~1,250 chars) |
| **Purpose** | Probe/retry hint with A4 Evaluate exemplar |
| **Trigger** | Not auto-surfaced in UI (Sprint 44 explicit non-goal) |
| **Authority level** | **Deprecated path** for automatic repair |

---

## 3. System count and authority

```
Emit prompt (FAIL taxonomies — guidance)
        ↓ model generates
Capture paste
        ↓
[L3] sanitizeSelfDirectedGamMaterialsOutput  ← transform
        ↓
[L4] applyGamPackTextValidationToCapture     ← AUTHORITATIVE for step gate
        ↓
(state: workflowRunGamFormatValidation)
        ↓ (later)
[L6] validateGamA4ComposeContract            ← compose only
[L6] applyGamMaterialsToComposedPage         ← merge preserve
```

**Authoritative for “can user advance GAM step?”:** Layer 4 (`GAM-FMT` blocking errors).

**Authoritative for “what should model generate?”:** Pack GAM-PRES/GAM-WB (no programmatic emit enforcement).

---

## 4. Duplicate validation analysis

| Check | Prompt (pack) | Sanitize | Capture gate | Stabilisation eval |
|-------|:-------------:|:--------:|:------------:|:------------------:|
| Facilitator ban | ✓ | ✓ strips | — | ✓ warns |
| Thin bodies | ✓ DEPTH-COLLAPSE | — | ✓ GAM-FMT-04 warn | — |
| Pack text shape | ✓ template | — | ✓ GAM-FMT-02 | — |
| JSON stub | ✓ | — | ✓ GAM-FMT-01 | — |
| Transfer ≥80w | ✓ GAM-PRES-08 | — | partial FMT-08/normalise | — |
| A4 Evaluate markers | ✓ GAM-PRES-10 | — | — | ✓ compose FMT-06/07 |

**Duplication footprint:** Facilitator + thin-body + shape checks exist in **2–3 layers** each. Unlike DLA pre-S56, there is **no second emit-time PRE-EMIT** duplicating capture checks.

---

## 5. Comparison to DLA validation (post-Sprint 56)

| Aspect | DLA post-S56 | GAM |
|--------|--------------|-----|
| SSOT contract module | `ld-guided-learning-scaffold.js` | None (pack GAM-PRES) |
| PRE-EMIT on emit | Unified gate in SSOT | **Absent** |
| Capture repair | `repairGuidedLearningScaffoldOnDlaCapture` | Transfer band append only |
| Capture hard gate | DLA scaffold validation | GAM-FMT tiered gate |
| Validation system count | 3 (SSOT + capture + repair) | 4 (sanitize + gate + eval + compose) |

---

## 6. Traceability

| Artefact | Path |
|----------|------|
| Capture hook | `app.js` ~19750–19897 (`syncWorkflowRunCapturedOutputToState`) |
| Gate implementation | `lib/gam-output-format.js` |
| Sprint 44 gate design | `docs/development/sprints/2026-06-15-sprint-44/sprint-44-slice-1-tiered-gam-capture-gate.md` |
| 38B GAM authority review | `38B-W2A-GAM-authority-review.md` |
| Tests | `tests/workflow-dla-framing-capture-validation-gate.test.js` (GAM stub) |
