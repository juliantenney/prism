# Slice 38G-4 — Regression and preservation review

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** **Review only** — no pack/code/pipeline changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38G-4  
**Inputs:** [38G-1](38G-1-first-glance-workbook-quality-analysis.md) · [38G-2](38G-2-activity-component-model.md) · [38G-3](38G-3-dla-gam-implementation.md)  
**Pack reviewed:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 (DLA) · §6 (GAM)  
**Automated checks:** `node --test tests/workbook-contract-prompt-surface.test.js` — **12/12 PASS** (38E/38F surface; no 38G-specific assertions yet)

---

## 1. Review purpose

Confirm that 38G-3 correctly encodes the Activity Component Model (ACM) into DLA/GAM prompt contracts **without weakening** 38E/38F structural protections, and assess readiness for `EV-38G-AFTER` (38G-5).

**Programme question:**

> Have we successfully connected the existing KM and LO architecture to richer instructional design without introducing regressions?

**Method:**

| Step | Action |
|------|--------|
| 1 | Manual clause audit of §5/§6 `promptTemplate` and `defaultPromptNotes` |
| 2 | Component-by-component mapping against [38G-2](38G-2-activity-component-model.md) |
| 3 | Hold-condition clause presence check (V-01, V-05, 38E-8/9 types) |
| 4 | Boundary check — no changes outside pack §5/§6 per [38G-3](38G-3-dla-gam-implementation.md) |
| 5 | Run existing `workbook-contract-prompt-surface.test.js` regression suite |

No pack edits were made during this review.

---

## 2. ACM implementation review

### 2.1 Summary

| Lens | Result |
|------|--------|
| ACM encoded in DLA | **PASS** — general instructions + DLA-WB-20/21 |
| ACM encoded in GAM | **PASS** — general instructions + GAM-WB-21 |
| 38G-2 component coverage | **PASS** — all ten components represented |
| Implementation sufficiency | **PASS with ambiguities** — see §2.3 |
| Regression vs 38E/38F | **PASS** — hold clauses present; tests green |

### 2.2 Component-by-component matrix

| Component | Where it appears | Supporting clauses | Sufficient? | Risks / ambiguities |
|-----------|------------------|-------------------|:-----------:|---------------------|
| **Orientation** | DLA: `activity_preamble` required (self_directed); LO bundle “orientation + …”; DLA-WB-20 | DLA `promptTemplate` (bundles, WB-20); `defaultPromptNotes`; GAM-WB-21 | **Yes** | Compose step may still drop preambles ([38G-1](38G-1-first-glance-workbook-quality-analysis.md) §6.3) — out of 38G charter |
| **Concept elucidation** | DLA: teach/activate split in `required_materials` purpose; WB-07 exposition; WB-08 worked path | DLA instructions; DLA-WB-07/08; GAM `text`/`worked_example` guidance; GAM-WB-01/02; GAM-WB-21 | **Yes** | Relies on LLM following purpose/specification language |
| **Knowledge activation** | DLA: explicit instruction + optional `prior_knowledge_activation` field | DLA `promptTemplate`; DLA-WB-20; cognition field list in output schema | **Partial** | Not a dedicated DLA-WB row; GAM depends on DLA field presence |
| **Misconception handling** | DLA: KM misconceptions → commentary/checklist; optional `support_note` | DLA instructions; DLA-WB-21; GAM `misconception_note`; GAM-WB-15; GAM-WB-21 | **Yes** | “Where relevant” — discretionary, not counted per activity |
| **Worked reasoning** | DLA: processes → worked reasoning before practice; WB-08 mandatory row | DLA instructions; DLA-WB-08/09; GAM-WB-02/03/MIX-04; GAM-WB-21 | **Yes** | Strongest structural hold (38E-8) |
| **Guidance** | DLA: stepwise guidance on apply/analyse/evaluate; `learner_task` / `expected_output` | DLA instructions; DLA-WB-10/19; GAM-WB-04; GAM-WB-21 | **Yes** | Anti–hollow-task is instructional, not schema-enforced |
| **Practice** | DLA: WB-10 practice-oriented materials; scenario + table pairing | DLA-WB-10/18; GAM-WB-04/10/38F-01; GAM-WB-21 | **Yes** | Unchanged from 38F — additive ACM layer |
| **Verification / self-check** | DLA: WB-11 (≥2 activities with cards/prompt_set/checklist) | DLA-WB-11; GAM-WB-05/13/18; LO bundles “verification/check” | **Yes** | Function-first R3 still depends on authored beats, not type presence alone |
| **Reflection** | DLA: WB-12 consolidation + optional cognition fields; Evaluate bundle | DLA-WB-12/13/14; GAM-WB-06/08/19; GAM-WB-21 | **Partial** | Anti-spoiler discipline implicit, not explicit (see §2.3) |
| **Transition** | DLA: relationships → transition cues; Analyse/Evaluate bundles | DLA instructions; DLA-WB-05 (progression/fading); DLA-WB-20; GAM-WB-21 | **Partial** | No dedicated `transition` material type — prose/field only |

### 2.3 Implementation sufficiency notes

**Strengths**

- ACM is woven into **general** DLA instructions (before DLA-WB block), not only workbook rows — applies beyond strict workbook detection.
- **DLA-WB-20** and **DLA-WB-21** provide traceable workbook-specific anchors for 38G-4/38G-5 audits.
- **GAM-WB-21** closes the DLA→GAM handoff: realise component intent in learner-facing materials without literal headings.
- **Anti–LO→Task** language appears in DLA instructions, `defaultPromptNotes`, and WB-21.

**Ambiguities (not pack defects — empirical risks for 38G-5)**

| Item | Detail |
|------|--------|
| **Bundle vs 38G-2 model** | Pack bundles are **compressed** (e.g. Apply => “worked example + guided practice + verification”) vs 38G-2’s fuller minimum bundles (orientation, activation, etc.). Acceptable prompt shorthand; may under-specify orientation/activation on Apply-level activities. |
| **DLA-WB-20 breadth** | Single row covers all components — no per-component fail rule. Enforcement is instructional + LLM-dependent. |
| **Consolidation anti-spoiler** | GAM-WB-06 requires ≥80-word closure body but does **not** explicitly forbid model-essay spoilers while `learner_task` asks for learner writing ([38G-1](38G-1-first-glance-workbook-quality-analysis.md) GQ-10). Not a regression — gap predates 38G — but EV-38G-AFTER should be scored for this. |
| **Evaluate activity count** | No DLA row mandating a **dedicated** evaluate activity before consolidation (38E10 four-activity arc). DLA-WB-20 + Evaluate bundle may improve A3 without restoring A3-evaluate — **38G-5** must judge. |

---

## 3. KM affordance review

### 3.1 Summary

| Affordance | DLA explicit? | GAM explicit? | Linkage explicit enough? |
|------------|:-------------:|:-------------:|:--------------------------:|
| Concepts | **Yes** | **Yes** | **Yes** |
| Definitions | **Yes** | **Yes** | **Yes** |
| Relationships | **Yes** | **Yes** | **Yes** — transition/explanatory links |
| Processes | **Yes** | **Yes** | **Yes** — worked reasoning before practice |
| Groupings | **Yes** | **Yes** | **Partial** — listed but no dedicated instruction line |
| Misconceptions | **Yes** | **Yes** | **Yes** — handling + verification/checklist |

### 3.2 Per-affordance detail

| KM affordance | How it should influence design | Encoded where | Assessment |
|---------------|-------------------------------|---------------|------------|
| **Concepts** | Scope terms before tasks; teach vs activate split | DLA: “identify required concepts…”; DLA-WB-21; GAM: KM affordance line in `promptTemplate` | **Explicit** |
| **Definitions** | Concept elucidation content | DLA-WB-21; GAM realisation guidance | **Explicit** |
| **Relationships** | Analysis/evaluation logic; bridges | DLA: “definitions and relationships to shape explanatory links and transition cues” | **Explicit** |
| **Processes** | Worked reasoning + method before practice | DLA: “processes to require worked reasoning and stepwise guidance…” | **Explicit** |
| **Groupings** | Chunking and sequencing | Listed in KM affordance roll-call (DLA + GAM) | **Present but thin** — no “use groupings to…” instruction |
| **Misconceptions** | Surfacing + self-correction | DLA: misconceptions → handling/checklist; GAM: `misconception_note`, GAM-WB-15 | **Explicit** |

**DLA-WB-21** names definitions/relationships/processes/misconceptions but omits **concepts** and **groupings** in the clause text — both are covered in the preceding general instruction bullet. **Not a defect.**

---

## 4. LO affordance review

### 4.1 Summary

| LO affordance | DLA explicit? | GAM explicit? | Assessment |
|---------------|:-------------:|:-------------:|------------|
| Related concepts (concept mappings) | **Yes** | **Indirect** | DLA primary; GAM via DLA |
| Cognitive level | **Yes** | **Indirect** | Bundles in DLA only |
| Progression | **Yes** | **Indirect** | DLA-WB-05 + collective progression instruction |
| Outcome intent | **Yes** | **Indirect** | Listed in DLA affordance roll-call |

GAM correctly treats `learning_activities` as source of truth and references “DLA LO/KM intent” in `defaultPromptNotes` and `promptTemplate` — appropriate for the step boundary.

### 4.2 Cognitive bundles — distinctiveness

| Bundle | Pack obligation (DLA `promptTemplate`) | Materially different from others? |
|--------|--------------------------------------|:---------------------------------:|
| **Understand** | orientation + concept elucidation + check | **Yes** — lightest; no worked-example mandate in bundle line |
| **Apply** | worked example + guided practice + verification | **Yes** — introduces worked path + verification |
| **Analyse** | comparison/classification + reasoning scaffold + verification + transition | **Yes** — adds scaffold + transition |
| **Evaluate** | trade-offs + judgement + justification + reflection + transition | **Yes** — highest rhetorical demand |

**Verdict:** Bundles are **distinct on paper**. Whether a live run produces materially different activity shapes is an **38G-5 empirical** question.

**Gap vs 38G-2:** 38G-2 minimum bundles include orientation/activation on Apply+; pack bundle lines omit some components — see §2.3.

---

## 5. Traceability review

### 5.1 Intended chain

```text
KM affordances ──┐
                 ├──► Activity components (ACM) ──► DLA ──► GAM ──► Workbook (page)
LO affordances ──┘
```

### 5.2 Chain assessment

| Segment | Status | Evidence |
|---------|--------|----------|
| **KM → components** | **Connected** | DLA maps concepts/processes/misconceptions/relationships to elucidation, worked reasoning, misconception handling, transition |
| **LO → components** | **Connected** | Cognitive bundles + mapped outcomes + teach/activate split |
| **Components → DLA** | **Connected** | Field list (`activity_preamble`, cognition fields, material specs) + DLA-WB-20/21 |
| **DLA → GAM** | **Connected** | GAM source-of-truth rule + GAM-WB-21 realises DLA component intent |
| **GAM → Workbook** | **Partial break (known)** | Design Page compose may drop orientation fields ([38G-1](38G-1-first-glance-workbook-quality-analysis.md) §6.3) — **not introduced by 38G-3**; out of charter |
| **KM → GAM (direct)** | **Optional path** | GAM may read `knowledge_model` when present — supplements DLA, does not bypass it |

### 5.3 Traceability breaks

| Break | Severity | Owner | 38G-4 action |
|-------|----------|-------|--------------|
| Design Page drops `activity_preamble` / cognition fields | **High** (learner-visible) | Compose / page step | **Observe in 38G-5** — not a 38G-3 defect |
| LLM non-compliance with prompt instructions | **Medium** | Runtime | **Measure in 38G-5** |
| No automated 38G clause tests | **Low** (process) | Test suite | **Note** — charter allows extension; not blocking rerun |

**No new traceability break introduced by 38G-3** in the DLA→GAM prompt layer.

---

## 6. Hold-condition review

### 6.1 Structural requirements

| Hold item | Required clauses | Present? | Weakened? |
|-----------|------------------|:--------:|:---------:|
| **scenario** (V-05) | DLA-WB-18; GAM-WB-10; F5; AP-04 | **Yes** | **No** |
| **worked_example** | DLA-WB-08; GAM-WB-02; F3; MIX-04 | **Yes** | **No** |
| **sample_output** | DLA-WB-08; GAM-WB-02/12 | **Yes** | **No** |
| **consolidation_summary** | DLA-WB-12; GAM-WB-06; F1–F2; MIX-03 | **Yes** | **No** |
| **table family** (V-01) | DLA-WB-06a; GAM-WB-38F-01; F6 | **Yes** | **No** |
| **Co-presence rows (1)–(4)** | DLA output schema guard | **Yes** | **No** |
| **Anti-weaken** | GAM “do not weaken” LD-MATERIALS-COPY / LD-TABLE-FIDELITY | **Yes** | **No** |
| **F1–F6 fail rules** | GAM-WB-38E-9 block | **Yes** | **No** |

### 6.2 Automated regression

```
node --test tests/workbook-contract-prompt-surface.test.js
→ 12/12 PASS (2026-06-05)
```

Tests cover 38E/38F prompt surface and preservation lib modules. **38G-specific clauses (DLA-WB-20/21, GAM-WB-21) are not yet asserted** — recommended follow-up test additions; **not a hold failure**.

### 6.3 Preservation architecture (V-13)

| Module | Workbook clause pollution? |
|--------|---------------------------|
| `lib/ld-table-fidelity.js` | **None** (test verified) |
| `lib/ld-materials-copy.js` | **None** |
| `lib/ld-design-page-compose-contract.js` | **None** |

**Preservation PASS** at architecture level.

---

## 7. Boundary review

| Boundary | Changed by 38G? | Verified |
|----------|:---------------:|----------|
| Schemas | **No** | 38G-3 scope statement; no schema paths in 38G work |
| `app.js` | **No** | No application code edits for 38G-3 |
| Renderer code | **No** | LD-MATH-RENDER references only |
| Preservation architecture | **No** | Lib modules unchanged |
| Pipeline logic / capture scripts | **No** | No edits to `ev-*-pipeline-capture*.mjs` for 38G |
| Pack scope | **§5 + §6 only** | Confirmed — single file `domain-learning-design-step-patterns.md` |

**38G remains a prompt-layer implementation.** No forbidden boundary crossed.

---

## 8. Readiness assessment

### 8.1 Verdict

| Assessment | Result |
|------------|--------|
| **Regression / preservation** | **PASS** |
| **ACM prompt encoding** | **PASS** (with documented ambiguities) |
| **Ready for `EV-38G-AFTER`** | **PASS — proceed to 38G-5** |

### 8.2 Rationale

38G-3 **additively** connects KM/LO affordances and ACM components to DLA/GAM without removing or weakening 38E/38F structural rows. Existing regression tests pass. Known learner-visible gaps (compose fidelity, spoiler consolidation, optional evaluate activity) are **pre-existing programme risks** to **measure**, not blockers for the first post-38G pipeline capture.

**No pack defects requiring amendment before 38G-5** were found in this review.

### 8.3 If this had been FAIL (not applicable)

No exact pack defects identified. Residual risks below are **observation targets for 38G-5**, not 38G-4 failures.

### 8.4 Expected improvements in `EV-38G-AFTER` (if prompts are followed)

Compared to `EV-38F-AFTER` baseline, a successful 38G run should show movement on:

| Dimension | Expected signal |
|-----------|-----------------|
| **Instructional framing** | Non-empty `activity_preamble` on each activity in DLA output |
| **Concept explanation** | Richer `required_materials` purpose/specification; WB-07 exposition |
| **KM relationship utilisation** | Transition bridges; explanatory links in text/scenario materials |
| **Process demonstration** | Worked reasoning before analyse/evaluate practice (WB-08 path) |
| **Misconception handling** | `support_note` / checklist / `misconception_note` where KM suggests confusion |
| **Coaching voice** | Natural instructional wording per bundle examples |
| **Verification** | WB-11 retrieval on ≥2 activities — checklist/cards/prompt_set |
| **Cognitive progression** | Evaluate-level activities with trade-off/judgement language; less inverse fading |
| **Structural holds** | scenario · table family · worked_example · sample_output · consolidation_summary **retained** |

**May not improve without out-of-scope fixes:**

- Preambles visible on Design Page if compose still drops fields
- Spoiler consolidation if GAM authors full essay under `consolidation_summary`
- Four-activity evaluate arc if DLA still compresses to three activities

---

## 9. Recommendation

| Decision | Action |
|----------|--------|
| **Proceed to 38G-5?** | **Yes** — run `EV-38G-AFTER` pipeline capture and quality review |
| **Pack changes before rerun?** | **No** |
| **Optional follow-up (non-blocking)** | Add 38G prompt-surface tests for DLA-WB-20/21, GAM-WB-21, and ACM keyword presence per charter §38G-4 permission |

---

## 10. Completion statement

| Criterion | Met? |
|-----------|:----:|
| 1. ACM implementation review | **Yes** — §2 |
| 2. KM affordance review | **Yes** — §3 |
| 3. LO affordance review | **Yes** — §4 |
| 4. Traceability review | **Yes** — §5 |
| 5. Hold-condition review | **Yes** — §6 |
| 6. Boundary review | **Yes** — §7 |
| 7. Readiness assessment | **Yes** — §8 |
| 8. EV-38G-AFTER recommendation | **Yes** — §9 **PASS / proceed** |
| No pack/code changes | **Yes** |

**Slice 38G-4:** **COMPLETE**  
**Next slice:** **38G-5** — Inflation rerun (`EV-38G-AFTER`) + quality review
