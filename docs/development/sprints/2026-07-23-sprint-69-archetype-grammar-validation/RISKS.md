# Sprint 69 Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Grammar too permissive | hidden pedagogic drift | strict constraints + fail-closed tests |
| Grammar too strict | false negatives on valid lessons | phased dual validation + fixture evidence |
| Producer/renderer drift | inconsistent behaviour | shared module + contract tests |
| Diagnostic regressions | harder triage | preserve code taxonomy and ownership metadata |
| Certification regressions | release delay | checkpoint runs each phase |
| Scope creep into redesigns | sprint slip | enforce phase boundaries and non-goals |

## Explicit non-risk assumptions

- We are not introducing fuzzy matching.
- We are not removing deterministic validation.
