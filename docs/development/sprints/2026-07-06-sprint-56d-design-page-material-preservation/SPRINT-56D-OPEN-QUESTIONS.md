# Sprint 56D — Open Questions

**Sprint:** 56D — Design Page Material Preservation Fix  
**Date:** 2026-07-06  
**Status:** Active investigation register

---

## OQ-56D-00 — Did any JS preservation or repair path execute? (GATING)

**Question:** During the reproduced workflow run, did any JavaScript preservation hook, post-compose merge layer, or app-side repair path execute on the Design Page output?

**Why gating:** Workflow-run outputs are produced by workflow LLM steps. Application code in `app.js` and `lib/` may exist for capture, import, or post-processing paths that **do not run** during a standard workflow reproduction.

**Candidate paths (execution unproven):**

| Path | Function |
| ---- | -------- |
| GAM materials preserve | `applyComposedPageGamMaterialsPreserve` |
| GAM merge lib | `lib/page-gam-materials-preserve.js` → `applyGamMaterialsToComposedPage` |
| Cognition semantics pipeline | `applyPedagogicCognitionSemanticsToComposedPage` |
| Page capture normalize | `normalizePageWorkflowCapture` |
| Learner page repair | `repairLearnerPageCompositionFromUpstream` |

**Method:**

1. Identify the code path from workflow step completion → stored artefact → any post-processing
2. Add trace/logging or breakpoint evidence on reproduction run
3. Compare workflow-emitted raw output vs any post-processed artefact

**Until answered:** Treat **workflow runtime compose** as the default active path. Do not attribute root cause to application repair/preservation code.

**Status:** **Open — blocks confident root-cause assignment**

---

## OQ-56D-01 — Where exactly is truncation introduced?

**Question:** At which step does full GAM body become thin Design Page body?

**Prerequisite:** OQ-56D-00 resolved.

**Workflow runtime candidates (investigate first):**

| # | Candidate | Location | Status |
| - | --------- | -------- | ------ |
| 1 | Design Page LLM compose emit | Copilot Design Page step output | **Primary suspect** — reproduction shows thinning in workflow-generated page JSON |
| 2 | Design Page input payload gap | GAM bodies not fully bound in step context | **To verify** |
| 3 | Prompt contract insufficient | Compose/materials-copy embed ignored by model | **To verify** |

**Application path candidates (only if OQ-56D-00 = yes):**

| # | Candidate | Location | Status |
| - | --------- | -------- | ------ |
| 4 | Post-compose preserve not run | `applyComposedPageGamMaterialsPreserve` | **Conditional** |
| 5 | Capture picks wrong object | `normalizePageWorkflowCapture` | **Conditional** |
| 6 | Later pipeline overwrites | `applyPedagogicCognitionSemanticsToComposedPage` | **Conditional** |

**Evidence needed:** Side-by-side diff of GAM bodies vs workflow-emitted page `materials.*`; if application paths execute, diff before and after each proven hook.

---

## OQ-56D-02 — What mechanism causes truncation?

**Question:** Is thinning caused by prompt instruction, LLM compose behaviour, schema coercion, token guard, preview helper, or an application repair path?

| Mechanism | Inspect | Status |
| --------- | ------- | ------ |
| **LLM compose (workflow)** | Design Page step Copilot output | **Primary suspect** |
| **Prompt instruction** | `ld-design-page-compose-contract.js`, `ld-materials-copy.js` embed | Contracts forbid thinning — model may ignore |
| **Input payload binding** | GAM → Design Page step context assembly | **To verify** |
| **Token / length pressure** | Model behaviour during compose emit | Possible |
| **Schema coercion** | Page JSON schema / validator | Unlikely to truncate strings |
| **Application repair** | JS preserve/repair hooks | **Only if OQ-56D-00 = yes** |
| **Renderer adapter** | `renderLearningActivitiesBlocks` | Ruled out as first failure (JSON already thin) |

---

## OQ-56D-03 — Are full bodies present in an intermediate draft?

**Question:** Before final Design Page workflow output, does any intermediate artefact contain full GAM bodies?

**Sub-questions:**

- Does raw Copilot fenced JSON from the Design Page step contain full bodies?
- Is thinning present in the **first** workflow-emitted page object (before any app post-processing)?
- If application paths execute (OQ-56D-00 = yes): do bodies differ pre/post each hook?

**Method:**

1. Raw Design Page step capture text (workflow output)
2. Workflow-stored artefact as persisted
3. Pre/post each **proven** application hook only

---

## OQ-56D-04 — What fix class applies on the proven path?

**Question:** Once root cause is confirmed, what is the minimal compliant fix?

**Options (path-dependent — not pre-selected):**

| Proven path | Fix classes to evaluate |
| ----------- | ----------------------- |
| Workflow runtime compose | Prompt/contract/domain correction; upstream binding; validation language |
| Application preserve (if proven) | Targeted hook correction on proven execution path |
| Both (if proven) | Coordinated minimal changes |

**Not pre-decided:** Deterministic JS overwrite is one option among others and is **not** assumed to be the primary fix until the proven path is known.

---

## OQ-56D-05 — React minified error #185

**Question:** Is React #185 related to oversized content, recursive state update, render loop, malformed page JSON, or unrelated UI state?

**Known:** React error #185 typically indicates **"Maximum update depth exceeded"** (infinite re-render loop).

| Hypothesis | Investigation |
| ---------- | ------------- |
| **Oversized page JSON** | Large materials cause state churn on parse/render |
| **Recursive state update** | `setState` in render or effect without guard |
| **Render loop** | Page preview re-parses on every render |
| **Malformed page JSON** | Parse retry / repair loop |
| **Unrelated UI** | Workflow panel, settings, or other component |

**Status:** Separate from preservation fix unless reproduction links them.

---

## OQ-56D-06 — Fixture capture for CI

**Question:** Can reproduction workflow GAM/page captures be committed as redacted fixtures?

**Blockers:**

- PII or proprietary content in workflow
- Capture size

**Fallback:** Synthetic fixtures mirroring M1/M2/M5/M9/M15 structure with known full bodies.

---

## Resolution tracking

| ID | Question | Blocks | Resolution | Date |
| -- | -------- | ------ | ---------- | ---- |
| **OQ-56D-00** | JS path execution | OQ-56D-01, OQ-56D-04 | Open | — |
| OQ-56D-01 | Truncation location | Task D | Open | — |
| OQ-56D-02 | Truncation mechanism | Task D | Open | — |
| OQ-56D-03 | Intermediate draft bodies | OQ-56D-01 | Open | — |
| OQ-56D-04 | Fix class | Task D | Open | — |
| OQ-56D-05 | React #185 root cause | — | Open | — |
| OQ-56D-06 | Fixture capture | Task E | Open | — |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-OPEN-QUESTIONS.md` |
| Sprint | 56D |
