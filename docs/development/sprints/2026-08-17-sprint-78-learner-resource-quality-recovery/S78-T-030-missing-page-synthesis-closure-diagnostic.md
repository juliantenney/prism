# S78-T-030 — Missing page-synthesis closure / study-tips diagnostic

**Task:** S78-T-030  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** Diagnostic / design only — **no implementation**  
**Sprint 78:** OPEN · **T-013:** remains OPEN · **T-019:** not started  

**Renderer ownership / schemas / implementation:** **NOT CHANGED**

---

## 0. Operator exhibit (updated)

Assembled page JSON inspected directly. `page_synthesis` contained only:

- `overview`
- `learning_purpose`
- `knowledge_summary`

Absent:

- `study_tips`
- `final_synthesis`
- `next_steps`
- any other learner-facing transfer/conclusion wrapper section

**Verdict on layer:** content is absent **before rendering**. Not a renderer omission.

Transfer beats exist in some activity episode plans as **planning metadata**; they have not become a final learner-facing page section.

---

## 1. What final page-synthesis fields the current Design Page contract/schema intends

Canonical Design Page partial surface (`lib/ld-design-page-partial-contract.js`):

| Field | Intent |
| ----- | ------ |
| `page_synthesis.knowledge_summary` | **Mandatory** (body + format) |
| `page_synthesis.overview` | Transport upstream when present |
| `page_synthesis.learning_purpose` | Transport upstream when present |
| `page_synthesis.study_tips` | **Transport upstream closure/debrief only; do not synthesize from scratch** |

Canonical shape snippet lists exactly those four keys under `page_synthesis`.

Capture gate (`validateDesignPagePartialPageCapture` in `app.js`):

- Requires `page_synthesis` and/or `sections`
- Requires **knowledge summary** (`page_synthesis.knowledge_summary` or `sections[].section_id = "knowledge_summary"`)
- Does **not** require `study_tips`, overview, or learning_purpose

Learner renderer (`lib/learner-renderer-vnext/build-page-model.js`):

- Orientation sections: `overview`, `learning_purpose`, `knowledge_summary`
- Separate model slot: `studyTips` from `page_synthesis.study_tips`
- **No** `final_synthesis` or `next_steps` fields anywhere in page_synthesis schema / renderer model

**Conclusion:** The intended final wrapper set is the four fields above. There is **no** first-class `final_synthesis` / `next_steps` page-synthesis capability in current vNext contracts.

---

## 2. Does a study-tips / consolidation / transfer / final-synthesis capability already exist?

| Capability | Exists? | Where |
| ---------- | ------- | ----- |
| `page_synthesis.study_tips` | **Yes** | Design Page partial contract + renderer Study tips section |
| Page-level consolidation via `knowledge_summary` | **Yes (mandatory)** | Authored/transported at Design Page; renderer Knowledge summary |
| Activity-level transfer | **Yes** | EP transfer beats → DLA `transfer_or_application_task` / GAM materials → activity moments |
| `final_synthesis` / `next_steps` page fields | **No** | Not in schema, contract, or renderer |
| Automatic promotion of EP transfer beats → page wrapper | **No** | Beats remain planning / activity metadata |

Historical authoring rhetoric (`LD-SELF-DIRECTED-RHETORIC` Design Page wrapper lines) still describes study_tips closure as 2–4 epistemic-synthesis bullets. Sprint 56C Wave 1–2 **explicitly demoted** that synthesis mandate on Design Page emit (transport-or-omit / R-41).

---

## 3. Why live Design Page output has only overview / learning_purpose / knowledge_summary

**Primary cause: contract-conditional omission of `study_tips`, not a missing injection of the Design Page contract.**

Authoritative rules:

1. **LD-DESIGN-PAGE-PARTIAL-CONTRACT:**  
   `page_synthesis.study_tips — transport upstream closure/debrief bodies only; do not synthesize from scratch`

2. **LD-THIN-ASSEMBLY-COHERENCE:**  
   `study_tips — transport upstream GAM closure/debrief bodies when present; omit when none. Bridge must not author or synthesize.`  
   Also hard-prohibits: `knowledge_summary or study_tips synthesis or authoring` and epistemic-closure bullets in wrapper slots.

3. **Capture:** accepting a partial without `study_tips` is **valid** when `knowledge_summary` is present.

Therefore, when Copilot/conversation has no clear upstream closure/debrief body to transport into `page_synthesis.study_tips`, the model is instructed to **omit** the field. Emitting only the three observed fields is **compliant** with current contracts.

Transfer beats in episode plans do not satisfy the transport rule: they are not page_synthesis bodies and are not defined as the upstream source for `study_tips`.

---

## 4. Is this another live prompt-path omission similar to GAM V2 Copy?

**No — different failure class.**

| Aspect | GAM V2 Copy (T-029) | Design Page (this exhibit) |
| ------ | ------------------- | -------------------------- |
| Live assembler | `buildWorkflowStepInstructions` bypasses `resolveStepPromptText` | Design Page uses `resolveStepPromptText` → `applyWorkflowStepRuntimePromptAugmentations` |
| Contract injection | LD-MATH-RENDER was missing until T-029 | `LD-DESIGN-PAGE-PARTIAL-CONTRACT` **is** injected on live path when seeded (proven by `tests/page-design-page-enrich.test.js`, `tests/workflow-design-page-live-prompt-unification.test.js`) |
| Observed absence | Contract text absent from prompt | Field absent from **artefact** while contracts say omit-when-none |

Residual note: Design Page V2 Copy brief (`buildDesignPageV2CopyAuthoringBrief`) is only a short execution reminder; the partial contract arrives via the library/override prompt + augmentation chain (unlike GAM’s dedicated brief that replaced the chain). That path is working for DP when a seeded override exists.

---

## 5. Is the missing final section generated conditionally — what condition failed?

**Yes — conditional, and the condition behaved as designed.**

Condition for `study_tips`:

```text
IF upstream GAM closure/debrief (or equivalent transportable closure body) is present in conversation
  THEN transport into page_synthesis.study_tips
ELSE omit study_tips
```

On this run: no transportable upstream closure body → omit.

What did **not** fail:

- Renderer dropping a present field
- Capture rejecting a valid three-field synthesis
- Design Page live prompt skipping LD-DESIGN-PAGE-PARTIAL-CONTRACT (for seeded DP path)

What **did** fail relative to operator expectation of a final learner-facing transfer/conclusion:

- Product/architecture gap: page-level epistemic closure is **optional** and **non-generative** at Design Page after Sprint 56C; activity transfer beats are not mapped into a page wrapper.

Secondary residual conflict (not the live omission mechanism, but salience noise):

- `LD-SELF-DIRECTED-RHETORIC` Design Page still says Closure: study_tips with epistemic synthesis
- Thin assembly + partial contract forbid synthesizing study_tips  
Precedence on DP emit: thin assembly / partial contract win; rhetoric may still confuse models when both appear.

---

## 6. Smallest correct fix and live-path regression test (recommendation only)

### Do not

- Add `final_synthesis` / `next_steps` without schema + renderer + assembly design
- Treat this as a T-029-style missing-block injection unless a live DP prompt exhibit shows the partial contract absent
- Expand renderer ownership investigation (artefact already lacks the field)

### Smallest correct owner (product choice required)

| Option | Owner | Nature | Risk |
| ------ | ----- | ------ | ---- |
| **A (preferred if page-level closure is required)** | `lib/ld-design-page-partial-contract.js` (+ thin-assembly alignment) | Narrow salience: when no upstream closure body exists, Design Page **must author** a short `study_tips` epistemic consolidation (not a task recap); keep knowledge_summary mandatory | Reopens 56C “no study_tips synthesis” carefully; smallest surface for operator need |
| **B** | DLA/GAM commissioning | Ensure a transportable closure/debrief material exists upstream so DP transport succeeds | Larger pipeline coupling; still needs reliable transport in partial mode (conversation-only) |
| **C** | Clarify product | Accept omit-when-none; treat activity transfer as sufficient; document that Study tips is optional | No code; may fail learner-experience expectation |

**Recommended default for Sprint 78 quality recovery:** **Option A** — page-level `study_tips` as Design Page–owned short consolidation when transport source is absent, without inventing new schema fields.

> **Superseded (2026-08-25):** Historical/ownership review in [S78-T-031](S78-T-031-page-closure-ownership-design-decision.md) / [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) **rejects Option A** as default and **accepts Option B** (GAM substance · Design Page transport). T-030 findings on transport-or-omit and non-renderer cause remain valid.

### Live-path regression tests (for a follow-on implementation task)

1. **`buildWorkflowStepInstructions` (partial DP + seeded override):** asserts `LD-DESIGN-PAGE-PARTIAL-CONTRACT` and the revised study_tips rule wording (live Run Copy path).
2. **Capture fixture:** Design Page partial with overview + learning_purpose + knowledge_summary **and** non-empty `study_tips` after the new rule — accepted.
3. **Negative guard:** still forbid inventing `final_synthesis` / `next_steps` keys (optional: assert absence from contract).
4. **Do not** overfit Lagrangian text; use a domain-general consolidation fixture.

---

## 7. Answers to inspection questions (summary)

1. **Intended fields:** `overview`, `learning_purpose`, `knowledge_summary` (mandatory), `study_tips` (optional transport). No `final_synthesis` / `next_steps`.
2. **Capability:** `study_tips` exists; page-level final-synthesis fields do not; activity transfer exists separately.
3. **Why three fields:** omit-when-none + do-not-synthesize for `study_tips`; capture allows it.
4. **Like GAM V2 Copy?** **No** — not a missing contract injection on the live DP path.
5. **Conditional?** **Yes** — transport source absent → omit.
6. **Smallest fix (at diagnostic time):** authorize Design Page to author short `study_tips` when transport is empty (Option A) — **superseded by S78-D04 / T-031** (Option B packaging).

---

## 8. Files inspected

- `lib/ld-design-page-partial-contract.js`
- `lib/ld-thin-assembly-coherence.js`
- `lib/ld-self-directed-rhetoric.js`
- `lib/learner-renderer-vnext/build-page-model.js`
- `app.js` — `buildDesignPageV2CopyAuthoringBrief`, `validateDesignPagePartialPageCapture`, `buildWorkflowStepInstructions` Design Page branch, `applyLdDesignPagePartialContractToDraft`, augmentation chain
- `tests/page-design-page-enrich.test.js`
- `tests/workflow-design-page-live-prompt-unification.test.js`
- Sprint 56C Wave 1/2 docs (transport-or-omit / study_tips synthesis demotion)
- Operator exhibit: assembled page `page_synthesis` keys only

---

## 9. Files changed (this task)

| File | Change |
| ---- | ------ |
| `S78-T-030-missing-page-synthesis-closure-diagnostic.md` | **Added** — this record |
| `STATUS.md` / `PLAN.md` / `SPRINT-78-START-HERE.md` / `HANDOVER.md` / `next-chat-briefing.md` | Minimal T-030 pointers |

**Production / tests:** **unchanged**

---

## 10. Sprint 78 state

| Item | Status |
| ---- | ------ |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-029 | Complete |
| T-030 | **Diagnostic complete** — implementation not authorised |
| T-031 / S78-D04 | **Decision complete** — Option B accepted; packaging not implemented |
| T-019 | Queued — not started |
| Next | Authorise Option B prompt/contract follow-on, or fresh regen |
