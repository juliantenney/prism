# Sprint 23 bootstrap — Learning Design pack rationalisation

**Date:** 2026-05-18  
**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Sprint title:** Sprint 23 — Learning Design pack rationalisation  
**Status:** **Proposed / ready for charter** — bootstrap pack only; **no implementation** until explicitly chartered.

**Portable handover:** **`GPT-bootstrap-sprint-23.md`** + **`HANDOVER.md`**.

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/`](../2026-05-15-sprint-22-unified-workflow-settings/) (Sprint 22 pack + [`CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md))

---

## 1. Executive summary

**Sprint 22 (feature-complete for chartered slices)** delivered unified workflow **Settings** (`[Run] [Settings] [Edit]`), workflow + included-step parameter aggregation, brief-config recovery, and **LD metadata expansion** (4 workflow + 25 step `*ParameterControls`). **185 tests** documented at Sprint 22 closeout; run the suite for the current floor.

**Sprint 23 (bootstrap)** proposes a **domain-pack semantics and metadata rationalisation** programme for the **Learning Design** pack — aligning elicitation with **workflow-as-structured-state**, auditing bespoke Prompt Factory controls, clarifying workflow vs step parameter ownership, and reviewing **Design Assessment** semantics — **without** rewriting runtime, provenance, workflow graphs, or synthesis architecture.

**One-sentence thesis:**  
*Elicitation increasingly functions as **initialisation of persistent pedagogical state** rather than the sole authority over workflow semantics; the LD domain pack should declare that state declaratively, and runtime should continue to interpret policy generically as in Sprint 18–22.*

**Framing:** Sprint 23 is primarily a **domain-pack semantics**, **elicitation alignment**, and **metadata rationalisation** sprint — **not** a runtime rewrite.

---

## 2. Why Sprint 23 follows Sprint 22

| Sprint 22 outcome | Sprint 23 use |
|-------------------|---------------|
| Unified Settings surface operational | **Exercise** pack metadata under real tuning flows |
| `workflowParameterControls` + `stepParameterControls` | **Rationalise** ownership, labels, `elicitation` flags |
| LD metadata expansion (29 control rows) | **Audit** coverage vs `mappingRules`, PF `userOptions`, legacy bespoke UI |
| Pack-agnostic runtime aggregation | **Preserve** — pack changes only unless a charter proves a minimal runtime fix |
| `[PRISM_STEP_PARAMS]` persistence | **Unchanged** pathways |
| Sprint 21 generic renderer | **Reuse** — no new control types without charter |

**Do not reopen** Sprint 22 unified Settings architecture except to fix defects chartered with explicit runtime scope.

---

## 3. Conceptual model — domain pack as declarative pedagogy

After workflow synthesis, operational authority lives in **structured parameters**, **step prompt drafts**, and **pack-declared metadata** — not in conversational elicitation alone.

| Layer | Role |
|-------|------|
| **Elicitation** | Seeds / initialises pedagogical state; may be reduced where Settings + synthesis already materialise assumptions |
| **Workflow parameters** | Workflow-level assumptions (`workflowParameterControls`) |
| **Step parameters** | Per-step tuning (`stepParameterControls`) for included steps |
| **mappingRules** | Declarative bridges from brief factors → constraints / stepParams — **not** auto-synthesised into Settings controls |
| **Prompt Factory `userOptions`** | Legacy / step-local option surfaces — candidates for convergence with pack metadata |
| **Prose brief** | Historical / provenance context — not sole semantic authority |

**Domain pack as declarative pedagogy:** The LD pack is the **structured reasoning system** for learning-design workflows — epistemology and pedagogy expressed as patterns, factors, mappings, and control metadata, interpreted by a **generic runtime**.

---

## 4. Sprint 23 focus areas

### 4.1 Learning Design domain pack review

- Inventory `requiredFactors`, `optionalFactors`, `mappingRules`, step patterns, and `*ParameterControls`.
- Resolve duplicate or divergent semantics (brief factor vs control key vs `stepParams` path).
- Align `canonicalStepId` values with WGC / Factory identity (Sprint 22 lesson: metadata must match slugified pattern titles).

### 4.2 Elicitation vs workflow-as-structured-state

- Classify each control / factor by **`elicitation`** posture: `elicited`, `settings-only`, `inferred`, `post-synthesis` (pack vocabulary — refine in slice charters).
- Identify where elicitation **re-asks** what Settings or synthesis already committed.
- Target **reduction of elicitation burden** where structured state is authoritative.

### 4.3 Prompt Factory bespoke-control audit

- Catalogue **runtime branches** keyed on step title / `canonical_step_id` (e.g. Design Assessment inheritance in `app.js`).
- Catalogue **pack-local** PF `userOptions` not yet represented in `stepParameterControls`.
- Propose convergence: pack metadata + generic renderer; **remove or charter** bespoke UI only when parity is proven.

### 4.4 Workflow vs step parameter ownership

- Which assumptions belong in `workflowParameterControls` vs `stepParameterControls`?
- Review assessment-related params split across workflow brief, `step_design_assessment`, and `step_generate_assessment_items`.
- Avoid dual authority (brief factor + step param + PF option) without documented precedence.

### 4.5 Design Assessment — priority review area

- **Design Assessment** (`step_design_assessment`) carries assessment blueprint semantics and downstream inheritance (e.g. generate-items steps).
- Review pack controls (`activity_type`, `total_items`, `coverage_scope`, `cognitive_demand`, etc.) vs runtime mapping helpers and legacy PF behaviour.
- Clarify assessment **cadence**, **coverage**, and **difficulty** vocabulary across pack, brief, and Settings.

### 4.6 Preserve Sprint 22 runtime architecture

- No unified Settings redesign.
- No new aggregation model.
- Pack edits and documentation first; runtime deltas only via explicit slice charter with tests.

---

## 5. Division of responsibility (unchanged principle)

| Owner | Responsibility |
|-------|----------------|
| **Pack** | Declare pedagogy: patterns, factors, mappings, control metadata, elicitation policy |
| **Runtime** | Interpret policy generically: aggregate, render, persist, apply mappings — **no per-parameter bespoke UI** unless legacy audit charters an exception |

**Rule:** Sprint 23 **changes what the pack means**; it does not **change how the runtime thinks** unless a defect is proven.

---

## 6. Likely programme approach (architecture only — not committed)

### 6.1 Audit → classify → rationalise

1. **Inventory** LD pack surfaces (factors, mappings, controls, PF sections).
2. **Classify** elicitation vs settings-only vs inherited vs post-synthesis.
3. **Rationalise** metadata (merge duplicates, fix keys, document precedence).
4. **Charter** minimal runtime cleanup only where pack cannot express required behaviour.

### 6.2 Design Assessment deep-dive (early investigation)

- Trace `step_design_assessment` from brief factors → `mappingRules` → `stepParameterControls` → Settings → PF / bespoke inheritance.
- Produce a **semantics matrix** (term → storage → UI surface → downstream consumer).

### 6.3 Bespoke-control retirement criteria

| Criterion | Action |
|-----------|--------|
| Parity in `stepParameterControls` + generic renderer | Remove bespoke PF branch in chartered runtime slice |
| Semantics require cross-step inheritance | Document in pack; implement via mapping or shared workflow param — not ad hoc title matching |
| Still design-time only | Keep in elicitation; mark `settings-only` after synthesis |

### 6.4 Explicit non-features

| Excluded | Reason |
|----------|--------|
| Runtime rewrite | Pack semantics sprint |
| Provenance redesign | Sprint 20 layer preserved |
| Workflow graph redesign | Out of scope |
| New synthesis architecture | Preserve WGC / adequacy interpreters |
| Research pack expansion | Frozen unless chartered |
| `mappingRules` auto-promotion to controls | Sprint 22 rejected pattern — preserve |
| Modal / Settings mode redesign | Sprint 22 delivered |

---

## 7. Relationship to Sprint 18–22 surfaces

| Surface | Sprint 23 relationship |
|---------|------------------------|
| Unified Settings | **Primary consumer** of rationalised metadata — validate under real workflows |
| Per-step Prompt Factory | **Audit** bespoke options vs pack controls |
| Factory provenance | **Read-only** — may update link copy, not architecture |
| Planning adequacy | **Unchanged** interpreters — pack may clarify factor adequacy hints |
| Elicitation / essentials | **Align** questions with structured-state initialisation model |
| Research workflows | **Frozen** — LD pack only unless explicit charter |

---

## 8. Proposed slice sequence (for charter — not approved)

| Slice | Hypothesis | Notes |
|-------|------------|-------|
| **23-1** | LD pack inventory + semantics matrix | Factors, mappings, controls, PF surfaces; no pack edits required for close |
| **23-2** | Elicitation alignment + burden reduction plan | Classify `elicitation` flags; propose deferrals to Settings |
| **23-3** | Prompt Factory bespoke-control audit | `app.js` branches + pack `userOptions` gap list |
| **23-4** | Workflow vs step parameter ownership | Assessment + delivery params; precedence rules |
| **23-5** | Design Assessment semantics + controls | Priority review; inheritance model documented |
| **23-6** | Pack metadata rationalisation PR | Apply pack edits; tests for metadata contract only |

Slices are **placeholders** until investigation confirms boundaries. See [`slice-23-1-charter.md`](slice-23-1-charter.md) (proposed, not chartered).

---

## 9. Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Runtime rewrite | Pack-first programme |
| Unified Settings redesign | Sprint 22 delivered |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Navigation / topology frozen |
| New synthesis architecture | WGC / adequacy preserved |
| Research pack expansion | Frozen |
| `mappingRules` → auto-generated controls | Rejected in Sprint 22 |
| Parameter schema / `controlType` overhaul | Reuse Sprint 21 contract |
| AI refinement / new interpreters | No new AI logic |
| Implementation in bootstrap | Documentation only |

---

## 10. Strategic open questions

1. Can **`elicitation: settings-only`** become the default for params materialised at synthesis time?  
2. Should **`assessment_type`** (and related) live at workflow level, on `step_design_assessment`, or both with explicit precedence?  
3. How should **cross-step inheritance** (Design Assessment → generate items) be declared in pack vs runtime helpers?  
4. Which PF **`userOptions`** are redundant with `stepParameterControls` after Sprint 22 expansion?  
5. What is the minimum **runtime delta** to retire `step_design_assessment` title/canonical branches in `app.js`?  
6. Does **`step_generate_learning_content`** need controls, or remain intentionally unmatched?  
7. How do we document **`domain pack as declarative pedagogy`** for future epistemic (Research) separation?

---

## 11. Recommended first investigations

1. Read LD pack `workflowBriefConfig` — full `workflowParameterControls` + `stepParameterControls` block.  
2. Grep `app.js` for `step_design_assessment`, `design assessment`, and PF bespoke panels.  
3. Build Design Assessment **semantics matrix** (factor → mapping target → control key → persistence path).  
4. Compare `mappingRules` targets to declared controls — list gaps and duplicates.  
5. Run Factory smoke on a 6-step LD workflow: elicitation → synthesis → Settings → Edit.  
6. Run test floor: `node --test tests/*.test.js`.

---

## 12. Verification floor at bootstrap

```bash
node --test tests/*.test.js
```

**Expected:** **185+ passed**, 0 failed (no code delta in bootstrap; Sprint 22 documented **185** — run suite for current count).

---

## 13. References

| Document | Role |
|----------|------|
| [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md) | Predecessor outcome |
| [`../2026-05-15-sprint-22-unified-workflow-settings/review-log.md`](../2026-05-15-sprint-22-unified-workflow-settings/review-log.md) | Sprint 22 decisions |
| [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) | Parameter controls substrate |
| [`../../../consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) | Parameterisation thesis |
| [`../../../../domains/learning-design/domain-learning-design-step-patterns.md`](../../../../domains/learning-design/domain-learning-design-step-patterns.md) | LD pack (primary artefact) |
| [`../../../audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) | Prior LD audit |
| [`../../shared-vocabulary.md`](../../shared-vocabulary.md) | Operational phrases |
