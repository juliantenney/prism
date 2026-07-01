# Sprint 57 — Context for New Chat

**Use this file** to onboard a new ChatGPT conversation, Cursor session, or developer without Sprint 56 history.  
**Target:** 2–4 pages · dense · factual  
**Updated:** 2026-07-01

---

## Product summary

**Prism** is a learning-design workflow tool. Authors run multi-step workflows (episode plan → learning activities → materials → page) and export **learner-facing educational pages** (HTML/JSON).

The product goal is not just valid JSON — it is **high-quality independent study experiences**: clear journey, readable materials, visible reasoning scaffolds, and trustworthy instructional progression.

Generation uses **external LLMs** (Copy path) with PRISM **prompt augmentation**, **capture**, **repair**, and **validation** layers.

---

## Current architecture (high level)

Three stages own distinct verbs:

| Stage | Step | Verb |
| ----- | ---- | ---- |
| **DLA** | Design Learning Activities | **Specifies** obligations, scaffold fields, expected outputs |
| **GAM** | Generate Activity Materials | **Realises** material bodies, tables, depth |
| **Design Page** | Design Page | **Assembles** page JSON; preserves upstream verbatim |

Post-emit **repair** overlays upstream content when models thin outputs. **Validation** blocks corrupt pages (`page_generation_failure` preferred over silent loss).

**Orchestration status: GREEN** — authority placement verified; no High-severity cross-stage leaks.

---

## Sprint 56 summary (what just finished)

Sprint 56 was **Prompt Rationalisation & Contract Consolidation**. It became a full **architecture review programme**:

| Workstream | Outcome |
| ---------- | ------- |
| **DLA** | Single scaffold SSOT (`LD-GUIDED-LEARNING-SCAFFOLD`); PRE-EMIT gate; prompt −36% (49,949 → ~31,932 chars); rhetoric removed from DLA |
| **GAM** | Audit + remediation; GAM-PRES owns depth; SP shape-only; facilitator-ban consolidated |
| **Design Page** | Audit + remediation; compose SSOT; materials/table embedded; compose-only scaffold preservation |
| **Cross-prompt** | Authority matrix; orchestration verified |
| **Final cleanup** | Pack doc sync; GAM L4 call-site hygiene |

**Programme closed.** Further prompt architecture = evidence-triggered only.

Key docs: `docs/development/sprints/2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-CLOSURE-REPORT.md` and `docs/development/audits/`.

---

## Current confidence level

| Trust | Level |
| ----- | ----- |
| DLA → GAM → Design Page separation | **High** |
| Scaffold SSOT + PRE-EMIT (DLA) | **High** |
| Design Page read-only compose | **High** |
| GAM depth (GAM-PRES-08/09) | **High** |
| Capture/repair pipeline | **High** |
| External model scaffold consistency | **Medium** — variance documented; repair compensates |
| Learner HTML product polish | **Low–Medium** — Sprint 57 focus |

---

## Active concerns (worth investigating, not panic)

1. **Learner-visible presentation** — hierarchy, tables, flow, duplication (Sprint 55/57 territory)  
2. **DLA emit variance** — borderline word counts on external runs; rely on capture repair for floors  
3. **Low-priority prompt residue** — Design Page wrapper overlap (journey + rhetoric + EQF); optional ~1k dedupe  
4. **Navigation / progress** — Sprint 55 P1 items not fully productised  

**Not active concerns:** wrong prompt stage ownership, Design Page generating scaffolds, missing materials/table injection on compose.

---

## Sprint 57 mission

**Learner Experience & Product Quality**

Improve exported pages for real learners: readability, cognitive load, navigation, consistency, confidence — on top of the beat-first structure Sprint 55 built.

**Not in scope:** prompt rationalisation programmes, workflow redesign, new governance layers without supersession.

Work from **fresh exports** and **learner heuristics**, not prompt archaeology.

---

## Code map (minimal)

| Concern | Path |
| ------- | ---- |
| Augmentation chain | `app.js` → `applyWorkflowStepRuntimePromptAugmentations` |
| DLA scaffold SSOT | `lib/ld-guided-learning-scaffold.js` |
| Design Page compose | `lib/ld-design-page-compose-contract.js` |
| GAM patterns | `lib/instructional-pattern-prompt.js` |
| Materials preserve | `lib/page-gam-materials-preserve.js` |
| Domain pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Deprecations | `docs/development/prompt-contracts/DEPRECATION-REGISTER.md` |

---

## Baseline numbers (Sprint 57 open)

| Step | Augmented prompt (RNA/HCV self-directed) |
| ---- | ---------------------------------------: |
| DLA | ~31,932 |
| GAM | 41,538 |
| Design Page | 32,685 |

Probes: `scripts/probe-gam-s57-audit-metrics.js`, `scripts/probe-design-page-s57-audit-metrics.js`

---

## Reading order

| # | Document | Why |
| - | -------- | --- |
| 1 | [SPRINT-57-START-HERE.md](SPRINT-57-START-HERE.md) | Single-page orientation |
| 2 | [SPRINT-57-ARCHITECTURE-STATE.md](SPRINT-57-ARCHITECTURE-STATE.md) | Who owns what |
| 3 | [SPRINT-57-LEARNER-PIPELINE-REFERENCE.md](SPRINT-57-LEARNER-PIPELINE-REFERENCE.md) | End-to-end pipeline detail |
| 4 | [SPRINT-57-CHARTER.md](SPRINT-57-CHARTER.md) | Sprint 57 scope |
| 5 | [SPRINT-57-BACKLOG.md](SPRINT-57-BACKLOG.md) | What to discover next |
| 6 | [SPRINT-55-DESIGN-PRINCIPLES.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DESIGN-PRINCIPLES.md) | UX non-negotiables |

**Architecture deep dive (only if needed):**  
[SPRINT-56-CLOSURE-REPORT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-CLOSURE-REPORT.md) → [CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md](../../audits/CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md)

---

## Rules for AI assistants in Sprint 57

1. **Do not** propose DLA/GAM/Design Page rationalisation unless user provides learner-defect evidence.  
2. **Do not** add prompt layers without supersession and deprecation register entry.  
3. **Prefer** product-layer fixes (HTML, CSS, export) when issue is presentation.  
4. **Preserve** capture/repair — do not weaken validators for aesthetics.  
5. **Cite** pipeline reference when discussing which step owns a concern.

---

*End of context pack — sufficient to begin Sprint 57 discovery work.*
