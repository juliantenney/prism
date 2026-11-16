# Sprint 98 — M5 options assessment (recommend only)

**Date:** 2026-11-16  
**Status:** Option **C implemented** ([S98-D07](decisions.md#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing)); Option B **not** implemented  
**Depends on:** [S98-D04](decisions.md#s98-d04--accept-m3-investigation-findings-read-only--architectural-gap-no-automatic-learner-facing-defect) · [S98-D06](decisions.md#s98-d06--reopen-sprint-98-for-m5-instructional-sequencing-resolution)  
**Evidence:** [M3-SEQUENCING-INVESTIGATION.md](M3-SEQUENCING-INVESTIGATION.md) · [evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md](evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md) · [VALIDATION.md](VALIDATION.md)

---

## Problem restated

Authored `learning_sequence.timeline[].learner_study_flow` specifies instructional order and disclosure. Assembly preserves it; composition always emits Orient → Learn → Do → Check → Transfer. Consequence for *Why the constraint matters*:

| Activity | Authored intention | Current render | Severity |
| -------- | ------------------ | -------------- | -------- |
| **A3** | Attempt **A3-M2** before studying **A3-M1** (`conceptual_scaffold`) | A3-M1 open in Learn, then A3-M2 in Do | Highest — full illustrative proof before first attempt |
| **A2** | A2-M2 as `optional_scaffold` after initial attempt | A2-M2 open in Learn | Medium — mitigated by distinct-data modelling + `practice_independence` |
| **A1** | Predict before examining A1-M1’s mathematical explanation | Whole A1-M1 in Learn before Do template | Moderate — same `material_id` holds challenge + explanation; not a pure reorder |

**Constraint:** Do must **not** always precede Learn. Legitimate explanation-before-practice must remain possible. Knowledge Summary stays before activities. No mandatory gates. No other product types. No general sequencing engine.

---

## 1. Existing metadata and classifications available

| Signal | Where | Reliability | Useful for |
| ------ | ----- | ----------- | ---------- |
| `timeline[].learner_study_flow[]` `{step, action, material_ids, disclosure}` | Assembled LS | Authored on this page; **not contract-validated as a closed enum today**; not consumed by renderer | A2/A3 scaffold timing if we parse narrowly |
| `disclosure` values observed | `initial_attempt`, `optional_scaffold`, `conceptual_scaffold`, `conceptual_support`, `post_attempt_feedback`, `guided_review`, … | Observed vocabulary; not a frozen schema | Prefer allow-list of known disclosure tokens |
| `practice_independence.attempt_operand_material_ids` | DLA/GAM on `worked_example` / `modelling_note` | **Commissioned + validated** (S78 WS-2); present on **A2-M2**; absent on A3-M1 (`text`) | A2 optional model presentation |
| Material type placement | `compose-moment-classification.js` | Stable: `text`/`modelling_note` → learn; `template`/`scenario`/tables → task/Do; `sample_output`/`checklist` → Check | Keep answer deferral |
| Reveal-after / Check deferral | `shouldDeferMaterialToCheck` | Stable for answers | Keep A2-M4 / A3-M3 / A4-M5 behaviour |
| Top-level `study_flow` (phase labels) | Orient only | Absent on this page; wrong tool for material order | Do not use for M5 |

**Not reliable:** Inferring “predict before explanation” from free prose inside a single material body (A1).

---

## 2. Options (do not assume Do-before-Learn universally)

### Option A — Authoring-only (no runtime change)

Strengthen DLA/GAM so attempt-before scaffolds are not open Learn text (e.g. split materials; require `practice_independence`; commission mid-attempt scaffolds differently).

- **Pros:** No renderer risk.  
- **Cons:** Does not correct already-correct commissions that LS already expressed; A3-M1 is intentionally a mid-attempt scaffold, not a Check answer; leaves architectural gap.  
- **Verdict:** Insufficient alone for the confirmed case.

### Option B — `practice_independence` presentation only

If `modelling_note`/`worked_example` carries `practice_independence`, do not show it as open pre-Do Learn; show as **learner-controlled collapsed details** adjacent to Do (default closed), accessible/keyboardable.

- **Pros:** Uses existing validated signal; fixes **A2**; low blast radius.  
- **Cons:** Does **not** fix **A3** (type `text`, no `practice_independence`); does not fix **A1**.  
- **Verdict:** Safe slice, incomplete.

### Option C — Narrow LS disclosure → material presentation (recommended core)

When an activity has `timeline[].learner_study_flow`:

1. Map each `material_id` to disclosures / step order.  
2. If a material’s **first** study-flow appearance is only `optional_scaffold` or `conceptual_scaffold`, and an earlier `initial_attempt` (or `independent_*`) step exists that does **not** include that material → treat as **attempt-before scaffold**.  
3. Presentation: **do not** emit that material as open Learn-before-Do content; attach as **collapsed `<details>`** after Do begins (or between Do and Check), default closed, with a clear summary (e.g. “Optional support” / “Worked illustration — use after your first attempt”).  
4. Materials also listed in `initial_attempt` remain eligible for Learn/Do as today.  
5. `post_attempt_feedback` materials continue via existing Check deferral (no change).  
6. **Do not** invert global Learn→Do for the activity.  
7. If no timeline study-flow is present → **no behaviour change** (preserves explanation-first Interactives).

- **Pros:** Directly targets A3 + A2 using authored intentions; preserves explanation-first default; no gates; Interactive-only path.  
- **Cons:** Depends on LS emitting study-flow with stable disclosure tokens; need defensive allow-list + no-op fallback; A1 still imperfect (dual-use A1-M1).  
- **Verdict:** Smallest approach that addresses the confirmed A3 defect without a sequencing engine.

### Option D — Reorder moments (Do before Learn when “attempt-first”)

Detect attempt-first activities and swap Learn/Do wholesale.

- **Pros:** Simple-looking.  
- **Cons:** Violates “Do must not always precede Learn”; breaks legitimate Learn-then-Do; coarse; wrong for mixed activities.  
- **Verdict:** Reject for Sprint 98.

### Option E — General study-flow execution engine

Execute full step graphs, progressive unlocking, etc.

- **Verdict:** Out of scope — large redesign; overlaps Interactive V2 / PB-FA-019.

---

## 3. Recommended approach (for authorisation)

**Primary:** Option **C** (narrow disclosure → collapsed scaffold presentation).  
**Additive:** Option **B** as a fallback when `practice_independence` is present but timeline study-flow is missing (defensive for A2-like models).

**Explicit non-goals for M5 implementation:** moment-order inversion; mandatory gates; schema redesign; Expository/AP/ST changes; A1 body-splitting in renderer; committing unrelated trees.

### A1 residual

A1-M1 is cited in both `initial_attempt` and later `conceptual_support`. Runtime cannot safely hide “the mathematical explanation” inside the same body without fragile prose parsing or a GAM material split. **Recommend:** leave A1 as known residual unless a separate authoring split is commissioned; M5 success criteria = A2 + A3 presentation aligned with LS disclosure intent.

---

## 4. Files / functions likely to change (if authorised)

| Area | Likely touchpoints |
| ---- | ------------------ |
| Sequence context | `lib/learner-renderer-vnext/compose-sequence-context.js` — parse `timeline[].learner_study_flow` → per-activity material disclosure map |
| Generic moments | `lib/learner-renderer-vnext/compose-generic-moments.js` — withhold attempt-before scaffolds from open Learn; attach reveal descriptors |
| Classification (minimal) | `compose-moment-classification.js` only if needed to avoid mis-placing scaffolds |
| Render | `render-composed-moment.js` / learn-material reveal helpers — closed details UX (reuse existing reveal patterns) |
| Browser bundle | `learner-renderer-vnext-browser.js` if generated/synced from modules |
| Tests | New focused tests + extend post-attempt / composition suites |

Assembly (`page-vnext-assemble.js`) likely **unchanged** (LS already preserved).

---

## 5. Risks to other Interactive resources

| Risk | Mitigation |
| ---- | ---------- |
| Explanation-first activities lose Learn content | Apply only when timeline study-flow present **and** material first appears as optional/conceptual scaffold after an attempt step |
| Unstable/novel disclosure strings | Allow-list; unknown tokens → no change |
| Collapsed UI harms accessibility | Reuse existing `<details>` patterns; keyboard; visible summary; content in DOM |
| Over-hiding genuine required Learn text | Require earlier attempt step without that material_id; materials in `initial_attempt` stay visible |
| Cross-product impact | Gate on Interactive composition path only |

---

## 6. Regression tests needed

1. Fixture with LS study-flow: conceptual_scaffold material after initial_attempt → not open in Learn; collapsed after Do; reachable.  
2. Fixture with `practice_independence` modelling_note, no study-flow → optional collapsed (Option B).  
3. Explanation-first activity **without** study-flow → Learn before Do unchanged.  
4. `sample_output` / Reveal-after → still Check-deferred.  
5. Knowledge Summary still before activities.  
6. A3-shaped fixture mirroring case study material ids/disclosures.  
7. Optional: snapshot that Do does not globally precede Learn for ordinary apply activities.

---

## 7. Author-led verification plan

After implementation (when authorised):

1. Author regenerates or reassembles *Why the constraint matters* in PRISM (or re-exports learner package from current assembled JSON if sufficient).  
2. Confirm A3: Do/template available before open illustrative proof; A3-M1 behind learner-controlled disclosure; A3-M3 still Check.  
3. Confirm A2: modelling note not forced open before attempt; R1–R4 scenario still available for independent work.  
4. Confirm KS → activities order unchanged; no new gates.  
5. Spot-check one explanation-first Interactive regression pack if available.

---

## 8. Is a safe narrow correction possible within Sprint 98?

**Yes — provisionally, for A2 and A3**, via Option C (+ B fallback), without a general sequencing engine and without mandatory gates.

**Not fully solvable in-renderer for A1** without splitting A1-M1 (authoring) or fragile prose interpretation — treat as residual / separate authoring follow-on.

**Implementation note (2026-11-16):** Option C authorised and shipped in renderer composition. Option B deferred indefinitely unless author regen shows C cannot identify intended scaffolds. A1 residual = S98-AD-012.

**Stop after impl:** no regen / commit / push / close by agent — author evaluates learner-facing result in PRISM.
