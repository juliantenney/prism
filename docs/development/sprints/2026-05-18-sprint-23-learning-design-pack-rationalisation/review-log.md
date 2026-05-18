# Sprint 23 review log — Learning Design pack rationalisation

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Date:** 2026-05-18  
**Status:** **Proposed / ready for charter** — bootstrap only

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/review-log.md`](../2026-05-15-sprint-22-unified-workflow-settings/review-log.md)

---

## 2026-05-18 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-001 | Sprint 23 follows **Sprint 22** (unified Settings + LD metadata expansion) | Operational tuning exists; semantics coherence is next gap |
| R23-002 | Sprint 23 is **pack semantics / elicitation / metadata** — not runtime rewrite | Preserve Sprint 22 architecture |
| R23-003 | **Elicitation → initialisation** of structured state | Thesis: not sole authority over workflow semantics |
| R23-004 | **Domain pack as declarative pedagogy** | Pack declares; runtime interprets generically |
| R23-005 | **Design Assessment** is priority review area | Bespoke inheritance + assessment vocabulary spread |
| R23-006 | **PF bespoke-control audit** required | Converge `userOptions` + `app.js` branches with `*ParameterControls` |
| R23-007 | **Workflow vs step ownership** review required | Especially assessment params |
| R23-008 | **No mappingRule auto-controls** | Sprint 22 precedent preserved |
| R23-009 | Research pack **frozen** unless chartered | Continuity S1–S13 |
| R23-010 | No implementation in bootstrap | Documentation only |

### Artefacts created

| Artefact | Path |
|----------|------|
| Sprint 23 portable pack | `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/` |
| Fresh-chat bootstrap | [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) |
| Bootstrap alias | [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) |
| Sprint context | [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) |
| Context snapshots placeholder | [`context-files/README.md`](context-files/README.md) |
| Bootstrap thesis | [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md) |
| Index | [`sprint-23-index.md`](sprint-23-index.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| Handover | [`HANDOVER.md`](HANDOVER.md) |
| Slice 23-1 placeholder | [`slice-23-1-charter.md`](slice-23-1-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **185+** passed, 0 failed expected (docs-only bootstrap; Sprint 22 floor **185**).

### Open questions (for Slice 23-1 charter)

1. Standard **`elicitation`** vocabulary across pack controls — reuse existing flags or extend?  
2. Minimum **runtime delta** to retire Design Assessment title/canonical branches?  
3. Should **`assessment_type`** migrate to workflow-level, step-level, or dual with precedence?  
4. Which PF **`userOptions`** blocks are redundant post–Sprint 22 metadata expansion?  
5. **`step_generate_learning_content`** — declare controls or document intentional exclusion?  
6. Cross-step **inheritance** — pack-declared vs runtime helper (`mapDesignAssessment*` functions)?  
7. Elicitation questions deferrable to **Settings-only** without blocking essentials?  

---

## Status

**Bootstrap complete.** **No slices chartered.** Next: **Slice 23-1** — LD pack inventory + semantics matrix.
