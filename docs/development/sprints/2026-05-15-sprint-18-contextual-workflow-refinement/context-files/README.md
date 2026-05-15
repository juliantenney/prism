# Sprint 18 — context-files

Portable snapshots for **fresh-chat bootstrap**. When the repo is mounted, **canonical sources win** over these copies if they have diverged.

**Refresh policy:** Re-copy from `docs/consolidation/`, `docs/exploration/`, and `docs/audits/` after material doc edits.

---

## Snapshots in this folder

| Snapshot | Canonical source |
|----------|------------------|
| `sprint-17-implementation-summary.md` | `docs/consolidation/sprint-17-implementation-summary.md` |
| `sprint-17-index.md` | `docs/consolidation/sprint-17-index.md` |
| `sprint-17-topic-sufficiency-gap.md` | Sprint 17 summary §12 / pack extract |
| `sprint-17-research-elicitation-sparse-brief-prep.md` | `docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md` |
| `contextual-refinement-architecture-note.md` | `docs/consolidation/contextual-refinement-architecture-note.md` |
| `workflow-aware-refinement-concepts.md` | `docs/exploration/workflow-aware-refinement-concepts.md` |
| `sprint-18-research-questions.md` | `docs/exploration/sprint-18-research-questions.md` |
| `existing-refinement-infrastructure-audit.md` | `docs/audits/existing-refinement-infrastructure-audit.md` |
| `prompt-studio-workflow-factory-lessons.md` | Pack-authored (see consolidation architecture §5) |

---

## Live-only (not snapshotted — mount repo)

| Path | Why |
|------|-----|
| `domains/research/domain-research-step-patterns.md` | Large; changes during implementation |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S6.json` | Golden fixtures |
| `tests/workflow-research-sparse-briefs.test.js` | Regression tests |
| `app.js` | Runtime interpreters |

---

## Read order (from pack)

See `../sprint-18-bootstrap.md` §16 or `../GPT-BOOTSTRAP-PROMPT.md` §3.
