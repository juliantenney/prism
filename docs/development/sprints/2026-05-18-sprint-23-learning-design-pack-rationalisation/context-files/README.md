# Sprint 23 — context-files

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/context-files/`

Bounded reference snapshots for fresh-chat upload and Slice 23-1 investigation — **not** canonical replacements for live repo paths.

---

## Why Sprint 23 has more pack context than Sprint 22

| Sprint | Primary artefact | Typical `context-files/` content |
|--------|------------------|----------------------------------|
| **Sprint 22** | Runtime architecture (unified Settings in `app.js`) | Aggregation helper excerpts, Settings mode notes |
| **Sprint 23** | **Domain-pack semantics** (LD elicitation, mappings, controls) | **Pack JSON/markdown excerpts** + targeted `app.js` assessment branches |

Sprint 23 work happens **in the pack** first; runtime changes are exceptional. Pre-loading pack snapshots avoids re-reading a **3k+ line** step-patterns file in every session while keeping live paths authoritative.

---

## Snapshot index

| File | Contents |
|------|----------|
| [`ld-workflow-parameter-controls.md`](ld-workflow-parameter-controls.md) | All 4 `workflowParameterControls` |
| [`ld-step-parameter-controls.md`](ld-step-parameter-controls.md) | 25-control index + assessment/activity excerpts |
| [`ld-design-assessment-excerpts.md`](ld-design-assessment-excerpts.md) | Design Assessment + Generate Items PF/metadata |
| [`ld-elicitation-factors.md`](ld-elicitation-factors.md) | `requiredFactors`, `optionalFactors`, refinement excerpts |
| [`ld-mapping-rules-excerpts.md`](ld-mapping-rules-excerpts.md) | Assessment, workflow, sequencing, activity mappings |
| [`ld-bespoke-pf-controls.md`](ld-bespoke-pf-controls.md) | Runtime PF/WGC bespoke inventory + excerpts |
| [`appjs-assessment-ui-excerpts.md`](appjs-assessment-ui-excerpts.md) | Assessment inheritance UI and mappers |

---

## Canonical live paths (always authoritative)

| Path | Role |
|------|------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | LD pack — factors, mappings, controls, PF |
| `app.js` | Generic Settings + bespoke assessment PF/inheritance |
| `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/CURRENT-STATE.md` | Sprint phase + test floor |
| `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md` | Unified Settings baseline (preserve) |

---

## Rules

- Snapshots are **bounded** — update when pack lines shift materially; cite approximate line numbers as hints only.  
- **Do not** paste full `app.js` or the entire step-patterns file here.  
- Implementation slices may add **one** extra excerpt file; prefer editing these snapshots over duplicating.  
- Treat consolidation closeouts and sprint pack root (`sprint-23-bootstrap.md`, `GPT-bootstrap-sprint-23.md`) as programme authority; this folder is **working context**.

---

## Authoritative bootstrap

Use [`../GPT-bootstrap-sprint-23.md`](../GPT-bootstrap-sprint-23.md) to restore Sprint 23 in a new chat.

**Suggested read order with snapshots:**  
`CURRENT-STATE.md` → `ld-elicitation-factors.md` → `ld-mapping-rules-excerpts.md` → `ld-step-parameter-controls.md` → `ld-design-assessment-excerpts.md` → `ld-bespoke-pf-controls.md` → `appjs-assessment-ui-excerpts.md`
