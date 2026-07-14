# Sprint 58 — Context for New Chat

**Sprint status: COMPLETE (2026-07-14).**  
Authoritative close-out: [SPRINT-58-CLOSURE.md](SPRINT-58-CLOSURE.md).  
This file remains historical onboarding context for why Sprint 58 existed.

**Updated:** 2026-07-14

---

## 1. What Sprint 56F concluded

- PRISM should move from multi-artefact LLM merge at Design Page to a **single v2 page artefact** (`schema_version: 2.0.0`).
- Each workflow stage **owns specific fields** (see ownership matrix).
- Design Page LLM merge is retired.
- Schema and ownership were **frozen**; 56F was investigation/planning — not production implementation.
- Key docs: `design-page.schema.vNext.json`, `ownership-matrix-vnext.md`.

---

## 2. What Sprint 57A investigated

- **Instructional sufficiency** and **content budgeting** before large-scale implementation.
- Learner workload as multi-component time (reading, thinking, production, review) — not word count.
- DLA activity sizing and GAM material budget heuristics.
- Whether instructionally valid pages fit realistic learner-time budgets.

57A was **investigation only** — no production code.

---

## 3. Why full-page progressive enrichment was abandoned

Sprint 56F/57A implemented and tested **full-page enrich-in-place**: each post-EP stage receives the complete page, mutates only owned fields, returns the complete page.

**End-to-end testing failed.** Despite extensive prompt hardening, LLM steps:

- Reconstructed or simplified non-owned fields
- Emitted partial pages (stopped after early activities)
- Reduced activities to `{ activity_id, materials }` stubs
- Emptied DLA-owned arrays (`required_materials`)
- Truncated `episode_plans`
- Emitted meta-notes instead of full JSON

Prompt-only fixes improved some runs but were **not durable** across fresh Copilot sessions.

---

## 4. Evidence from end-to-end workflow testing

Pipeline tested: **Episode Plan → DLA → GAM → Learning Sequence → Design Page → Render**

| Observation | Implication |
| ----------- | ----------- |
| Renderer works on structurally complete pages | Assembly target is valid |
| Failures occur at LLM emission stages | Cannot rely on LLM preservation |
| GAM is the worst failure point (size + materials) | Partial GAM output is essential |
| Later stages also regress when given full pages | All post-EP stages emit partials |

---

## 5. Decision: partial page artefacts

**Keep** v2 schema and `artifact_type: page`.

**Change** post-EP behaviour:

- Each stage emits a **partial** page artefact: envelope + owned fields only.
- Stages do **not** preserve, replay, or copy-forward other stages' fields.
- Users paste each artefact into that step's **`runStepOutput`** field (UI label: step output).
- PRISM stores captures per workflow step ID.
- **Stored captures are not injected into downstream prompts.**
- Downstream prompts use **Copilot conversation context** only.
- **Deterministic code** assembles the final page before render.
- No LLM merge, repair, or reconciliation.

---

## 6. Architecture for Sprint 58

```
Episode Plan     → full v2 page shell (deterministic derive + user paste)
DLA              → partial page (activities instructional fields + assembly_state)
GAM              → partial page (activities[].materials + assembly_state)
Learning Seq     → partial page (learning_sequence + assembly_state)
Design Page      → partial page (page_synthesis/sections + assembly_state)
       ↓
PRISM assembly   → merge by activity_id / material_id (code only)
       ↓
Renderer         → normalizePageForRender → HTML
```

**Authoritative principle:**

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.

---

## 7. Current implementation status (sprint open)

**Exists (full-page v2 — to be refactored):**

- `lib/page-shell-create.js` — EP page shell
- `lib/page-dla-enrich.js`, `lib/ld-dla-page-enrich-contract.js`
- `lib/page-gam-enrich.js`, `lib/ld-gam-page-enrich-contract.js`
- `lib/page-render-normalize.js` — renderer adapter
- `app.js` — v2 prompt assembly, upstream JSON embeds, full-page validators, `isPageEnrichmentV2WorkflowEnabled()` currently always `true`
- Tests: `page-*-enrich.test.js`, `page-render-vnext-adapter.test.js`

**Not yet implemented:**

- `lib/page-vnext-assemble.js`
- Partial capture validators
- Upstream injection suppression (post-EP)
- Partial output prompt contracts
- Assembly-integrated render path
- Legacy workflow gating restoration

**Uncommitted work in repo** (at sprint open): full-page v2 LS/DP implementation — to be revised per Sprint 58 plan.

---

## 8. Immediate next implementation tasks

1. Add `isPartialPageOutputWorkflowEnabled` gate; restore workflow-flag gating for legacy.
2. Create `lib/page-vnext-assemble.js` + assembly tests.
3. Add partial capture validators (DLA, GAM, LS, DP).
4. Rewrite post-EP prompt contracts for partial output.
5. Disable upstream JSON embed in `buildWorkflowStepInstructions` and draft augmentations.
6. Skip compose closure on partial post-EP captures in `syncWorkflowRunCapturedOutputToState`.
7. Wire assembly into render path.
8. Update existing v2 tests; add no-injection tests.

Full plan: [implementation-plan.md](implementation-plan.md)

---

## 9. Major risks / open questions

| Risk / question | Notes |
| --------------- | ----- |
| Chat-only context without PRISM embed | DLA onward must find EP page in conversation — operational dependency |
| `page_synthesis` vs `sections[]` for DP partial | vNext uses `page_synthesis`; no `page_layout` in schema |
| GAM partial shape | Prefer minimal `{ activity_id, materials[] }` stubs |
| Partial paste failing full-page validators | Stage-subset validation required |
| Legacy workflows | Must not break compose-based non-v2 paths |
| `isPageEnrichmentV2WorkflowEnabled` hard-coded `true` | Must restore flag-based gating |

See [risks-and-open-questions.md](risks-and-open-questions.md)

---

## Key file paths

| Area | Path |
| ---- | ---- |
| Main app | `app.js` |
| Assembly (new) | `lib/page-vnext-assemble.js` |
| Renderer normalize | `lib/page-render-normalize.js` |
| v2 schema | `docs/.../56f-.../design-page.schema.vNext.json` |
| Sprint 58 docs | `docs/.../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/` |

---

## Start implementation

[SPRINT-58-START-HERE.md](SPRINT-58-START-HERE.md) → [implementation-plan.md](implementation-plan.md)
