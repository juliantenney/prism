# Sprint 23 — Learning Design pack rationalisation (context)

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Date:** 2026-05-18  
**Phase:** **Proposed / ready for charter** — bootstrap pack only

**Fresh-chat entry:** [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md)

---

## Problem statement

Sprint 22 closed the **workflow-scale tuning** gap: unified Settings surfaces pack-declared workflow and included-step parameters with a pack-agnostic runtime.

**Remaining gap:** The **Learning Design domain pack** still carries overlapping semantics across elicitation factors, `mappingRules`, Prompt Factory `userOptions`, legacy runtime branches, and `*ParameterControls`. Users may be asked the same pedagogical question in **elicitation**, **Settings**, and **step PF** with unclear precedence — especially for **assessment** and **Design Assessment**.

Without Sprint 23, structured state is **operable** but not **coherent** at the pack semantics layer.

---

## Sprint goal

Review and rationalise the **Learning Design domain pack** so that:

- **Elicitation** initialises persistent pedagogical state aligned with synthesis and Settings.  
- **Pack metadata** is the declarative authority for controls and mappings.  
- **Bespoke PF / runtime controls** are audited and converged or chartered for retirement.  
- **Workflow vs step parameter ownership** is explicit (assessment priority).  

**Outcome:** Domain-pack-as-declarative-pedagogy — **not** a runtime rewrite.

---

## Core thesis

| Responsibility | Owner |
|----------------|-------|
| Pedagogical semantics | **LD domain pack** (patterns, factors, mappings, controls) |
| Elicitation posture | **Pack policy** (`elicitation` flags, factor `mustAsk`, etc.) |
| Operational tuning | **Settings** (workflow + included steps) after synthesis |
| Implementation detail | **Edit** / step prompt drafts |
| Aggregate + render + persist | **Runtime** (generic; **preserve** Sprint 22) |

**Thesis sentence:** *Elicitation increasingly functions as initialisation of persistent pedagogical state rather than the sole authority over workflow semantics.*

**Not:** runtime rewrite, provenance redesign, workflow graph redesign, new synthesis architecture.

---

## What Sprint 23 is / is not

### Primarily

- A **domain-pack semantics** sprint  
- An **elicitation alignment** sprint  
- A **metadata rationalisation** sprint  

### Not

- A **runtime rewrite**  
- A **provenance redesign**  
- A **workflow graph redesign**  
- A **new synthesis architecture** sprint  

---

## Candidate programme goals

| ID | Goal | Description |
|----|------|-------------|
| **A** | **LD pack inventory** | Full map of factors, mappings, controls, PF |
| **B** | **Elicitation alignment** | Classify and reduce redundant elicitation |
| **C** | **PF bespoke audit** | Catalogue runtime + pack gaps |
| **D** | **Parameter ownership** | Workflow vs step precedence rules |
| **E** | **Design Assessment review** | Priority semantics matrix + control alignment |
| **F** | **Pack rationalisation** | Apply metadata edits with test floor held |

---

## Success criteria (programme — bootstrap targets)

| Criterion | Target |
|-----------|--------|
| LD semantics documented | Inventory + precedence rules |
| Elicitation burden reduced | Plan with explicit deferrals to Settings |
| Bespoke controls catalogued | Audit artefact with retirement criteria |
| Design Assessment coherent | Single vocabulary across brief/pack/Settings |
| Sprint 22 architecture preserved | No Settings redesign |
| Test floor | **185+** passed, 0 failed |
| Research regression | **Frozen** unless chartered |

---

## In scope (when chartered)

- LD pack review and metadata rationalisation  
- Elicitation vs structured-state alignment  
- Prompt Factory bespoke-control audit  
- Workflow vs step parameter ownership documentation  
- Design Assessment semantics and controls  
- Minimal runtime changes **only** when chartered with parity proof  

---

## Out of scope (bootstrap and default programme)

| Item | Reason |
|------|--------|
| Bootstrap implementation | Planning only |
| Unified Settings redesign | Sprint 22 delivered |
| Provenance redesign | Sprint 20 layer |
| Workflow graph redesign | Topology frozen |
| Synthesis / adequacy overhaul | Preserve interpreters |
| Research pack expansion | Frozen |
| `mappingRules` → auto controls | Sprint 22 rejected |
| Full `context-files/` snapshots | Add when chartering slices |

---

## Dependencies

| Dependency | Notes |
|------------|--------|
| Sprint 22 complete (chartered slices) | **185 tests**; unified Settings live |
| Sprint 21 metadata contract | `controlType`, grouping, persistence |
| LD step patterns pack | Primary edit surface |
| Prior LD audit | [`../../../audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) |
| Manual validation | `npm run dev` + LD workflow elicitation → Settings |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Scope creep into runtime rewrite | Pack-first charter; explicit runtime slice |
| Breaking Settings badge counts | Pack-only edits + contract tests |
| Assessment semantics regression | Design Assessment matrix before edits |
| Retiring bespoke UI too early | Parity checklist before runtime deletion |
| Research accidental touch | LD-only default scope |

---

## Strategic open questions

See [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md) §10.

---

## References

- [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md)  
- [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md)  
- [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)  
- [`../../../consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md)
