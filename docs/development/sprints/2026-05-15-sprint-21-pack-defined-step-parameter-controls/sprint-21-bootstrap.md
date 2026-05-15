# Sprint 21 bootstrap — Pack-defined Step Parameter Controls

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Sprint title:** Sprint 21 — Pack-defined Step Parameter Controls  
**Status:** **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 21-1 chartered.

**Portable handover:** **`GPT-BOOTSTRAP-PROMPT.md`** + **`HANDOVER.md`**.

**Predecessor:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## 1. Executive summary

**Sprint 20 (closed)** made parameterised workflows **legible** in the Factory: Settings discoverability, provenance, step relevance, action-led planning guidance — **135 tests green**.

**Sprint 21 (bootstrap)** closes the **operability gap**: Step Settings must become the **full workflow parameter editor** for pack-defined `stepParams`, rendered **generically** from pack metadata.

**One-sentence thesis:**  
*Packs declare parameters and how they appear; runtime renders, persists, propagates, and explains them — without bespoke UI per parameter.*

**Framing:** Sprint 21 completes the **parameterised workflow front-end model**. It is **not** a new synthesis architecture.

---

## 2. Why Sprint 21 follows Sprint 20

| Sprint 20 outcome | Sprint 21 use |
|-------------------|---------------|
| Settings discoverable | Users arrive at Settings — need **complete controls** there |
| Provenance explains `stepParams` keys | Controls must match what provenance shows |
| Summaries show priority params | Summaries should reflect **editable** values |
| `mappingRules` unchanged | Expose **all relevant** mapped targets in UI |
| No full Settings editor | **Primary Sprint 21 deliverable** |

**Do not reopen** Sprint 20 explainability architecture except integration points when Settings values change.

---

## 3. Core insight from Sprint 20

The runtime **already** supports:

| Mechanism | Status |
|-----------|--------|
| Resolved factors | Live |
| `mappingRules` → `stepParams` | Live |
| Provenance + step relevance | Live (20-2) |
| Settings discoverability | Live (20-1) |
| Parameter propagation | Partial — depends on Prompt Factory / patches |

**Missing:** pack-declared **metadata** + **generic Settings controls** for the full mapped parameter surface.

---

## 4. Sprint 21 core thesis — division of responsibility

### Packs should define

| Metadata | Purpose |
|----------|---------|
| **Parameter identity** | Stable keys under `stepParams.*` |
| **Labels / descriptions** | Human-readable Settings copy |
| **Defaults** | Authoritative initial values |
| **Options** | Enums, ranges, allowed values |
| **Visibility** | Show / hide / advanced-only |
| **Advanced / basic grouping** | Progressive disclosure |
| **Elicitation priority** | Elicited vs Settings-only tier |
| **Settings rendering** | Control type (select, number, boolean, text, …) |

### Runtime should

| Behaviour | Purpose |
|-----------|---------|
| **Render generic controls** | From pack metadata — one code path per control type |
| **Persist values** | On step / workflow records |
| **Propagate to execution** | Existing `stepParams` consumption paths |
| **Expose provenance generically** | Align with Sprint 20 provenance when values change |

**Goal:** Settings = **full workflow parameter editor**.

---

## 5. Two-tier parameter model

```text
┌─────────────────────────────────────────────────────────────┐
│  Elicited (brief / essentials) — high-impact, small set      │
│  assessment type, item count, learner level, scope, stakes   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ synthesis
┌─────────────────────────────────────────────────────────────┐
│  Concrete workflow + mapped stepParams                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ post-generation
┌─────────────────────────────────────────────────────────────┐
│  Settings-only — rich pedagogical tuning                     │
│  sequencing, difficulty, distractors, feedback, visibility,  │
│  retry/remediation, explanation depth, scaffolding, …        │
└─────────────────────────────────────────────────────────────┘
```

**Principle:** Do not force arcane configuration during synthesis. **Generate quickly**, then expose rich tuning afterward.

### Elicited parameters (examples)

- Assessment type  
- Item count  
- Learner level  
- Topic / scope  
- Formative vs summative intent  

### Settings-only parameters (examples)

- Sequencing strategy  
- Difficulty progression  
- Distractor style  
- Feedback granularity  
- Answer visibility  
- Retry / remediation policy  
- Explanation depth  
- Scaffolding intensity  

Pack metadata marks tier so runtime and charters **do not** expand the brief wizard.

---

## 6. Architectural continuity (must preserve)

| Constraint | Status |
|------------|--------|
| Lightweight elicitation | **Preserve** |
| Essentials gating (blocking when unsafe) | **Preserve** |
| Advisory adequacy only | **Preserve** — no new blocking predicates |
| Provenance model | **Preserve + integrate** Settings edits |
| Pack-driven architecture | **Strengthen** — more semantics in packs |
| Generic runtime | **Strengthen** — fewer domain branches |
| No wizard regression | **Preserve** — no required post-gen queues |

**Rule (unchanged):** Runtime interprets policy; domain packs declare policy.

---

## 7. Consolidated PRISM interaction model (target)

```text
1. Lightweight brief          (elicited tier only)
2. Essentials gate            (blocking when unsafe / incomplete)
3. Workflow synthesis         (concrete step graph)
4. Planning adequacy          (advisory)
5. Provenance                 (assumptions + sources)
6. Step relevance             (factor → step mappings)
7. Settings                   (full pack-defined parameter editor)  ← Sprint 21
```

---

## 8. Candidate goals and slice sequence

| Goal | Description | Proposed slice |
|------|-------------|----------------|
| **A. Pack parameter metadata** | Schema / conventions in domain packs | **21-1** |
| **B. Generic Settings renderer** | Typed controls from metadata | **21-1** |
| **C. Persistence + propagation** | Values → `stepParams` → execution | **21-1 / 21-2** |
| **D. Advanced / basic + visibility** | Progressive disclosure | **21-2** |
| **E. Provenance alignment** | Edits visible in explainability | **21-3** |
| **F. LD pack pilot** | Representative step coverage | **21-3** |

### Recommended slice sequence

| Slice | Title | Intent |
|-------|-------|--------|
| **21-1** | **Parameter metadata + generic Settings renderer** | Minimal metadata schema; MVP controls; persist/propagate |
| **21-2** | **Grouping, visibility, control polish** | Advanced/basic; hide internal params; control edge cases |
| **21-3** | **LD pilot + provenance integration** | Declarative LD `stepParams`; tests; provenance sync |

---

## 9. Recommended first slice — Slice 21-1

### Sprint 21 Slice 21-1 — Parameter metadata + generic Settings renderer

**Purpose:** Establish pack metadata conventions and render **first-class editable controls** for a bounded set of mapped `stepParams` on LD pilot steps.

**Possible scope (charter to narrow):**

| Idea | Description |
|------|-------------|
| **Metadata schema v1** | `controlType`, `label`, `description`, `default`, `options`, `tier` (basic/advanced), `elicitation` (elicited/settings-only), `visible` |
| **Generic renderer** | Map control types → DOM; single code path per type |
| **Read current values** | From step record / `[PRISM_STEP_PARAMS]` / mapped state |
| **Write + persist** | Update step params; trigger existing propagation hooks |
| **Pilot params** | e.g. `assessment_type`, `assessment_total_items`, `page_profile`, `tone_style`, `depth_level` — charter selects exact set |
| **Tests** | Renderer unit tests via `__PRISM_TEST_API` where applicable |

**Non-goals (21-1):**

- Full LD pack coverage  
- Research pack changes  
- Schema overhaul  
- AI-generated labels  
- Workflow diff/history  
- Renderer programme (Utilities HTML)  

**Success signals:**

- User edits a mapped param in Settings and sees change in step summary / execution path.  
- No new blocking brief questions.  
- **135+** tests green.

---

## 10. Slice 21-2 outline (deferred)

**Advanced / basic grouping + visibility**

- Collapse advanced section by default.  
- `visible: false` for internal/low-value params.  
- Pack-driven `group` or section headers.  
- Avoid Settings overwhelm (pair with Sprint 20 progressive disclosure patterns).

---

## 11. Slice 21-3 outline (deferred)

**LD pack pilot + provenance integration**

- Expand declarative metadata on LD assessment/page/activity steps.  
- Provenance reflects **explicit** vs **default** after Settings edit.  
- Cross-check summaries (20-1) with control values.  
- Manual Factory validation checklist.

---

## 12. In scope (programme)

- Pack-defined parameter metadata  
- Generic Settings control rendering  
- Typed controls  
- Advanced/basic parameter grouping  
- Parameter visibility rules  
- Pack-driven Settings UX  
- Preserving provenance integration  

---

## 13. Out of scope initially

| Item | Note |
|------|------|
| Utilities / page HTML renderer rewrite | Separate programme |
| Prompt Studio merge | Product boundary |
| Schema overhaul | Incremental pack metadata |
| Pack validation framework | Future |
| AI-generated parameter semantics | Pack-authored only |
| Workflow diff / history | Deferred from 20-2 |
| Collaborative editing | Not in scope |
| Runtime execution redesign | Propagation hooks only |
| Pack audit (which params should exist) | **Future** — informs pack curation; see reflection §5 |

---

## 14. Expected future benefits

Once parameter controls are pack-defined:

| Benefit | Mechanism |
|---------|-----------|
| **Declarative new settings** | Add metadata + mapping — not Factory branches |
| **Richer pedagogical tuning** | Domains add Settings-only params freely |
| **Independent domain evolution** | LD / Research packs extend without runtime forks |
| **Lower runtime complexity** | Generic renderer replaces bespoke UI |
| **Configuration contracts** | Packs own factors, mappings, and Settings metadata |

---

## 15. Potential future audit themes (post Sprint 21)

Not Sprint 21 implementation — informs pack maintenance:

| Theme | Question |
|-------|----------|
| Right parameters exposed? | Pedagogical salience vs noise |
| Low-value params hidden? | Internal flags, duplicates |
| Elicited vs Settings-only? | Per-parameter tier review |
| Missing controls? | Domain gaps in LD / Research |
| Advanced collapse default? | UX noise reduction |

See [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md).

---

## 16. Risks

| Risk | Mitigation |
|------|------------|
| Incomplete metadata on legacy steps | LD pilot; fallback to existing `userOptions` |
| Settings panel overload | 21-2 visibility + advanced collapse |
| Provenance out of sync | 21-3 integration tests |
| Research regression | Freeze S1–S13 |
| Elicitation creep | Enforce two-tier in pack metadata reviews |

---

## 17. Success criteria (programme)

| Criterion | Target |
|-----------|--------|
| Relevant pack params editable in Settings | Yes — generic controls |
| Pack-authored labels/options | Yes |
| Two-tier model respected | Brief small; rich Settings post-gen |
| Provenance integrated | Yes — after 21-3 |
| Sprint 18–20 architecture | Preserved |
| Test floor | **135+** green |

---

## 18. Verification

```bash
node --test tests/*.test.js
```

**Bootstrap:** **135 passed**, 0 failed expected.

---

## 19. References

| Document | Role |
|----------|------|
| [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) | Predecessor; §11 Sprint 21 candidate |
| [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) | Parameterisation thesis |
| [`contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) | Guidance layers |
| Sprint 20 pack | [`../2026-05-15-sprint-20-workflow-explainability-settings-ux/`](../2026-05-15-sprint-20-workflow-explainability-settings-ux/) |
