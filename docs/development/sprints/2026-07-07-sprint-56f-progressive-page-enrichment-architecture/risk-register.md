# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
| -- | ---- | ---------- | ------ | ---------- |
| R1 | Episode Plan scope creep into content authoring | Medium | High | Strict shell-only contract; ownership matrix |
| R2 | GAM still emits markdown during migration | Medium | High | JSON-only validation gate; remove text parser dependency |
| R3 | `finalise_page` becomes hidden Design Page merge | Medium | High | Bounded responsibility doc; no material authority |
| R4 | ID drift between DLA and GAM | Medium | High | Immutable IDs; fail on mismatch, no reconciliation |
| R5 | Renderer depends on legacy page shape | Medium | Medium | Renderer audit against new schema early |
| R6 | Workflow bindings hardcoded to separate artefacts | High | Medium | Phased binding updates per migration phase |
| R7 | Token limits on large page JSON | Low | Medium | Enrichment in place avoids re-emitting full page each step |
| R8 | Team reverts to prompt patching under pressure | Medium | High | Architecture decision record; 56E lessons |
| R9 | External audit not performed | Medium | High | Test strategy + validation report template |
| R10 | Scaffold fields ownership ambiguous | Medium | Low | Resolve in schema freeze (open questions) |

## Critical path risks

**R2 + R4** are the highest priority — they caused 56D/56E failures.

## Assumptions reducing risk

- No production users → hard cutover acceptable
- PRISM does not need post-run validation → structure must be correct at enrich boundaries
