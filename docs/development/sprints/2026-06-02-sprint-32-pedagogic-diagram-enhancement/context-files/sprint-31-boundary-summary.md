# Sprint 31 boundary summary (frozen for Sprint 32)

**Purpose:** Sprint 32 must **preserve** Sprint 31 renderer outcomes when embedding figures.  
**Authority:** [Sprint 31 CLOSED](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/SPRINT-31-RETROSPECTIVE.md) (R31-999).

**Do not reopen Sprint 31** except documented R-layer regression fixes.

---

## What Sprint 31 delivered (R-layer only)

| Area | Outcome |
|------|---------|
| **Metadata** | `About this page` fold; learner audience line suppressed in body |
| **Activity hierarchy** | `.util-activity-framing`, `.util-activity-task--primary` |
| **Knowledge** | `.util-knowledge-summary`, `.util-definition-list`, concept wrappers |
| **Materials** | `.util-materials-stack`, `.util-material-table`, template/prompt tiers |
| **Dedupe** | Activity-local **exact-match** suppression only; task never suppressed |
| **Assessment** | `.util-assessment-prompt`, `.util-assessment-choices`, formative item styling |

CSS tranches: `getUtilityPagePresentationCssV31_2` … `V31_6`.

Architecture reference: [`../../2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/sprint-31-renderer-architecture-summary.md`](../../2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/sprint-31-renderer-architecture-summary.md).

---

## Sprint 32 implications

| Rule | Rationale |
|------|-----------|
| **Figures attach without breaking scan order** | Purpose → framing → task → materials → assessment |
| **No renderer rhetoric rework** | Sprint 32 is workflow + export, not V31_7 CSS |
| **No semantic rewriting** | Placement and captions may **describe** content; must not rewrite LD |
| **No generation-layer pedagogy changes** | PECs, cognition fields, assessment semantics frozen |

---

## Typical DOM anchors for placement (read-only reference)

Sprint 32 placement logic should target **existing** structure, e.g.:

- `.util-activity-materials` / `.util-materials-stack` — process diagrams near worked examples  
- `.util-knowledge-summary` — concept relationship figures  
- `.util-activity-task` — sparingly; avoid competing with primary task  
- `.util-assessment-section` — only when figure is essential to item stem (rare)

Avoid inserting figures **above** primary task without tier **Essential** justification.

---

## Test floor

Sprint 31 closed at **502** pass / **0 fail**. Sprint 32 work must not silently regress utility render tests.
