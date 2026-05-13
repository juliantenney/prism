# Sprint 13 — consolidation index

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-index.md`

**Purpose:** Navigable map of **Sprint 13 first-pass** consolidation artefacts and **decision-gated** follow-on documentation. This file **does not** approve future work, **does not** add roadmap commitments, and **does not** recommend implementations.

**No implementation:** Index creation is **documentation only** — **no** production code, pack, prompt, persistence, or orchestration changes.

---

## 1. Sprint 13 scope summary (as represented in consolidation)

Sprint 13 material under `docs/consolidation/sprint-13-*.md` supports **domain-pack portability and manifest clarity for v1**, bounded to what the **first pass** actually delivered, plus **read-only** audits and **decision** notes for items that remain **gated**.

**Delivered in first pass (per closure):** **S13-07** (v1 descriptive documentation) and **S13-01** (narrow, strict-parity **`#wfDesignDomainSelect`** tidy in **`app.js`** only).

**Not delivered as implementation:** **S13-02** (default domain semantics / policy) and **S13-03** (hint neutralisation) — **documentation and gates only** in-repo.

---

## 2. Delivered first-pass work

| ID | Description | Consolidation artefact |
|----|-------------|-------------------------|
| **S13-07** | v1 reference: **General**, **`alwaysOnDomains`**, **`normalizeSelectedDomains`**, first structured domain for **`getWorkflowBriefConfig`**, Factory domain list context, manifest vs embedded fallback. | [`sprint-13-general-alwayson-first-structured-domain-behaviour.md`](sprint-13-general-alwayson-first-structured-domain-behaviour.md) |
| **S13-01** | Narrow implementation: parity-preserving de-duplication for Factory **`#wfDesignDomainSelect`** (helpers + **`renderWorkflowDomainSelector`** / **`initWorkflowDomainSelector`** only — see closure). | Recorded in [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md); evidence in §4–§6 below |

---

## 3. Audit-only artefacts (decision-gated follow-on)

| Topic | Artefact |
|-------|----------|
| **S13-03** — display-only hint audit | [`sprint-13-s13-03-display-only-hint-neutralisation-audit.md`](sprint-13-s13-03-display-only-hint-neutralisation-audit.md) |
| **S13-03** — decision gate | [`sprint-13-s13-03-decision-gate-note.md`](sprint-13-s13-03-decision-gate-note.md) |
| **S13-02** — default-domain framing audit | [`sprint-13-s13-02-decision-framing-audit.md`](sprint-13-s13-02-decision-framing-audit.md) |
| **S13-02** — decision options (bounded models, no policy pick) | [`sprint-13-s13-02-decision-options-note.md`](sprint-13-s13-02-decision-options-note.md) |

---

## 4. Runtime and parity evidence artefacts (S13-01)

| Artefact | Role |
|----------|------|
| [`sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`](sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md) | Code-derived parity matrix (rows A–D, **`selectedExtra`** rules). |
| [`sprint-13-s13-01-runtime-parity-baseline.md`](sprint-13-s13-01-runtime-parity-baseline.md) | Runtime-observed baseline (Scenario A; B/C/D notes). |
| [`sprint-13-s13-01-factory-domain-select-runtime-baseline.md`](sprint-13-s13-01-factory-domain-select-runtime-baseline.md) | Canonical runtime baseline note (aligned Scenario A capture). |

---

## 5. Implementation review packet (S13-01)

| Artefact | Role |
|----------|------|
| [`sprint-13-s13-01-implementation-review-packet.md`](sprint-13-s13-01-implementation-review-packet.md) | Bounded pre-implementation review checklist, scope, stop conditions, and parity definition for **`#wfDesignDomainSelect`**. |

---

## 6. Closure note

| Artefact | Role |
|----------|------|
| [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md) | First-pass closure: delivered items, verification summary, full **`sprint-13-*.md`** artefact table, explicit deferred list, Sprint 12 / S13-02 / S13-03 boundaries, **no** full portability claim. |

---

## 7. Explicit deferred areas (summary)

Details and rationale: **`sprint-13-first-pass-closure.md`** § “Explicit deferred” and **`sprint-13-s13-01-implementation-review-packet.md`** / gate notes where applicable.

**Headline deferred items (not exhausted here):**

- **S13-02** — default domain rule / semantics (implementation **not** done; framing + options docs only).
- **S13-03** — hint neutralisation (implementation **not** done; audit + gate only).
- Semantic prompt migration; **`briefLines`** / extraction; multi-domain brief merge; **`getGeneralFallbackBriefConfig`** relocation; starting-artefact / title-injection refactors; broad **`app.js`** refactor; persistence/import/export migration; cache / manifest promise work; domain-pack schema redesign — unless **separately** chartered.

---

## 8. Relationship to Sprint 12 closure

**Sprint 12** first-pass structural observability (**A–E**) is **closed** and was **not** reopened for Sprint 13 first-pass work.

**Closure record (external to this index):** `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`

Sprint 13 consolidation docs **reference** that boundary; they **do not** extend Sprint 12 obligations.

---

## 9. Partial portability posture (explicit)

Sprint 13 consolidation describes **incremental** documentation and a **single-control** code tidy toward clearer manifest/domain behaviour for **v1**. It is **partial** portability and documentation work **only**.

**Full drop-in domain-pack portability** is **not** claimed as complete or scheduled in these artefacts.

---

## Consolidation file list (`docs/consolidation/sprint-13-*.md`)

| File |
|------|
| `sprint-13-index.md` (this index) |
| `sprint-13-first-pass-closure.md` |
| `sprint-13-general-alwayson-first-structured-domain-behaviour.md` |
| `sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md` |
| `sprint-13-s13-01-runtime-parity-baseline.md` |
| `sprint-13-s13-01-factory-domain-select-runtime-baseline.md` |
| `sprint-13-s13-01-implementation-review-packet.md` |
| `sprint-13-s13-02-decision-framing-audit.md` |
| `sprint-13-s13-02-decision-options-note.md` |
| `sprint-13-s13-03-display-only-hint-neutralisation-audit.md` |
| `sprint-13-s13-03-decision-gate-note.md` |

---

## Review log

- **2026-05-13** — Sprint 13 consolidation index added (`sprint-13-index.md`).
