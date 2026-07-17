# Sprint 67 — Risks

| ID | Risk | Likelihood | Impact | Mitigation |
| -- | ---- | ---------- | ------ | ---------- |
| S67-R01 | Archetype rule coverage incomplete for non-fixture lessons | Medium | High | Exact-match variants; hard errors on unknown shapes; expand rules only with fixtures |
| S67-R02 | Label strategy debates reopen model freeze | Medium | Medium | Document open question; change via decision log; keep role≠function separation |
| S67-R03 | Feature flag accidentally defaults to vNext | Low | High | Explicit default legacy; regression test for default |
| S67-R04 | Parity expectation = pixel-identical legacy HTML | Medium | Medium | Define parity as structural invariants, not legacy bug-for-bug |
| S67-R05 | Renderers re-read source JSON | Medium | High | Architecture test / code review; render APIs accept model only |
| S67-R06 | Markdown / checklist rendering regresses utility styles | Medium | Medium | Reuse existing util classes; golden HTML snapshots of key markers |
| S67-R07 | Scope creep into legacy deletion | Medium | Medium | Sprint 68 planning note only; DoD excludes retirement |
| S67-R08 | Compound learner-task steps feel wrong without splitting | Low | Medium | Preserve authored steps (settled); document in open questions |

Escalate any proposed return to heuristic scoring as a **charter breach**.
