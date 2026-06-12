# Sprint 42 Implementation Start Points

**Theme:** Authorial Quality / Educational Exposition  
**Status:** Initialised — no implementation yet

---

## Implementation goal

Improve how learner-facing pages **read** — richer prose, explanatory depth, conceptual narrative, smooth transitions, publication-ready quality — while **preserving**:

- EQF and PEL educational structure (Sprint 40–41)
- Mandatory `activity_preamble` and cognition fields
- Design Page field preservation and compose repair
- Existing schema, workflow steps, and renderer layout

---

## Starting position

### What is already working

| Capability | Evidence |
| ---------- | -------- |
| Learner journey structure | Marx self-study 7/8 EQF; episode-plan obligation population |
| Judgement and capability tasks | Inflation, climate discussion fixtures |
| Learner framing fields | Mandatory at DLA; preserved at Design Page |
| Metacognitive scaffolds | PEL orientation/reasoning on self-study lineage |
| Renderer display | Framing renders when fields present |

### What feels weak (hypothesis)

| Symptom | Example pattern |
| ------- | ----------------- |
| Assembled not authored | Discrete labels: preamble → cognition block → “What to do” with little connective prose |
| Thin exposition | Orientation cues without teaching; task-first pages |
| Redundant framing | Same idea in `overview`, `activity_preamble`, and `study_orientation` |
| Weak transitions | `intellectual_coherence_bridge` present but formulaic |
| Publication gap | Correct structure, uneven instructional voice |

Sprint 42 should target **prose integration and voice**, not new fields or steps.

---

## Implementation strategy (expected)

| Approach | Likelihood |
| -------- | ---------- |
| Prompt / compose contract additions | **Primary** |
| Domain pack prompt template refinement | **Secondary** |
| Lightweight exposition diagnostic (optional) | **Possible** |
| Renderer changes | **Out of scope** |
| Schema changes | **Out of scope** |
| New workflow steps | **Out of scope** |

### Augmentation entry point (unchanged)

`applyWorkflowStepRuntimePromptAugmentations` in `app.js`

Likely insertion points for exposition guidance:

1. **Design Page** — `applyLdDesignPageComposeContractToDraft` / new sibling module
2. **DLA** — extend learner-page OUTPUT CONTRACT or framing block with exposition rules
3. **Rhetoric** — `lib/ld-self-directed-rhetoric.js` for closure and progression voice (self-directed profiles)

---

## Recommended slice sequence

### Slice 42-1 — Exposition baseline audit (start here)

**Type:** Investigation only — no production code changes.

**Tasks:**

1. Read rendered output for Marx self-study, inflation workshop, climate discussion (JSON + HTML where available).
2. Document “assembled vs authored” patterns per activity and per page section.
3. List redundancy hotspots (overview vs preamble vs orientation).
4. Define **exposition success criteria** (checklist, not new EQF dimensions) for Sprint 42 slices.
5. Store notes in `observations/42-1-exposition-baseline-audit.md`.

**Outputs:** Audit document + success criteria — gate for Slice 42-2.

---

### Slice 42-2 — Design Page authorial exposition contract (first implementation)

**Type:** Prompt / compose contract (recommended first **code** slice after audit).

**Rationale:** Design Page is where upstream activities, materials, and framing merge into the final learner experience. Exposition improvements here affect wrapper prose, section rhythm, and how framing fields sit relative to tasks — without reopening DLA obligation population or renderer layout.

**Likely changes:**

- New module (e.g. `lib/ld-authorial-exposition.js`) or extension to `ld-design-page-compose-contract.js`
- Rules for: page entry narrative, inter-activity transitions, redundancy avoidance, integrative prose around preserved framing fields
- Wire via `applyLdDesignPageComposeContractToDraft` or adjacent augmenter on Design Page step only
- Tests: prompt presence + compose behaviour on `marx-self-study-page.json` shape (structure preserved, exposition guidance present)

**Constraints:** Must not weaken `repairLearnerPageCompositionFromUpstream` or field preservation lists.

---

### Slice 42-3 — DLA exposition guidance

**Rationale:** Improve source text for `activity_preamble` and cognition fields so Design Page receives teachable prose, not label-like strings.

**Likely changes:** Exposition lines in `buildLearnerPageDlaOutputContractOverrideBlock` / `buildSelfDirectedLearnerPageActivityFramingPromptBlock` — depth_floor L3 teaching language, anti-formulaic preamble rules.

---

### Slice 42-4 — Validation and optional diagnostic

- Before/after captures in `captures/sprint-42-exposition/`
- Optional: exposition heuristic CLI (diagnostic only, never a build gate)
- Re-run EQF evaluator for regression — dimension scores should not collapse

---

## Investigation questions (Slice 42-1)

1. Where does the page feel like a **form dump** vs a **guided reading**?
2. Which sections could be merged rhetorically without losing accessibility?
3. Do workshop pages need a different **voice** than self-study while keeping the same framing minimums?
4. Does `intellectual_coherence_bridge` read as transition or as boilerplate?
5. What would a “publication-ready” Marx or inflation page do differently in **prose only**?

---

## Test baseline

Run before any Slice 42-2 changes:

```bash
node --test tests/workflow-learner-page-mandatory-framing.test.js
node --test tests/workflow-learner-page-design-page-preservation.test.js
node --test tests/workflow-learner-page-framing-delivery-mode.test.js
node --test tests/workflow-self-directed-activity-framing-adoption.test.js
node --test tests/utility-self-directed-activity-framing.test.js
```

EQF benchmark (structure regression):

```bash
node tools/evaluate-educational-quality-framework.js tests/fixtures/page-render/marx-self-study-page.json
```

---

## Key principle

Optimise for **readable exposition that carries cognitive demand** — not more schema, not more visible UI, not more framework machinery.

The learner should experience a coherent authored resource, not a stack of correctly labelled educational fields.
