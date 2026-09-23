# Sprint 87 — Architectural debt ledger

Debt / observations relevant to Sprint 87 scope. **Implementation + validation.**

**Sprint 87 is IN PROGRESS (2026-09-23).** T-001…T-006 complete (QA · EQ1 · chapter form · AD-010 · T-010 · engineering gate). WP5 IN PROGRESS — next: T-007 live validation. Design authority: [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 83–85 | **CLOSED** — Expository architecture + functional delivery |
| Sprint 86 | **COMPLETE / CLOSED** — editorial quality model + first-slice design |
| First-class gate | **339/339** |
| Interactive prompt family | **Protected** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Production Expository | **S85 + EQ1 + chapter form + AD-010 + T-010 Expository presentation** (engineering-gated) |

## Binding (not debt)

| Source | Constraint |
| ------ | ---------- |
| S87-D01 | First slice only; QA v0.2 before coding |
| S86 T-011 | Accepted first-slice design — do not reopen prioritisation casually |
| S86 T-012 | Closed investigation conclusions |
| S83-D04 | Sibling family; do not edit Interactive prompts for Expository |

## Inherited first-slice work items (from S86 AD ledger)

| ID | Finding | S87 disposition |
| -- | ------- | --------------- |
| **S86-AD-010** | Unsupported structured-material learner fallback (23× / 5 exports) | **RESOLVED in T-004** ([S87-D05](decisions.md#s87-d05--ad-010-structured-material-semantic-rendering)) — live re-export confirm at T-007 |
| S86-AD-014 / EQ1 | Purpose / epistemic-form ownership | **DONE in T-002** |
| **S87-AD-001** | Pre-EQ1 EJP captures lack `commissioned_purpose` / `epistemic_form` | Re-validation / re-assemble fails until regenerated — expected |
| **S87-AD-002** | Shared VA evidence-anchor vocabulary still lists `page_synthesis.closing_paragraph` etc. | Low risk — tidy later if desired |
| S86-AD-017 | Prospectus furniture + dual close | **DONE in T-003** |
| S86-AD-019 | DP `sections` patch risk | **DONE in T-003** |
| S86-AD-021 | UI-adjacent presentation | **DONE in T-005** ([S87-D06](decisions.md#s87-d06--expository-scoped-t-010-presentation)) — Expository-scoped only; engineering-gated in T-006 |
| S86-AD-016 / AD-020 | Option B / material≠figure / soft EQ5 binding | **Out of scope** (follow-on) |
| S86-AD-008 | Research Synthesis | **Out of scope** (PB-FA-011) |
| S86-AD-009 | Expository → Interactive | **Out of scope** |

## New observations from T-004 / T-005

| ID | Finding | Notes |
| -- | ------- | ---- |
| **S87-AD-003** | C01–C05 export zips retain rendered HTML only — original XM object bodies not archived | Reconstruction fixtures used for T-004; live T-007 should confirm against fresh exports |
| **S87-AD-004** | Exact `elements[]`+`relationships[]` still caption-only beside VAs | By design (materials ≠ figures); full commission↔visual binding remains Option B / later |
| **S87-AD-005** | Dedicated reading face / serif exploration deferred | T-010 SHOULD; not implemented (no webfont programme) |
| **S87-AD-006** | Semantic H3 still absent unless upstream emits subsections | Correct — renderer must not invent H3 |

## Explicitly out of sprint

- Full T-009 Option B  
- Semantic H3 generation · font programme · callout kits  
- New AI stage / post-XM rewrite  
- Mandatory material↔figure 1:1 · changing 70ch for its own sake  
- Design-system programme · CAS / table maths  
- Interactive prompt generalisation  

New S87 observations may be added during execution; do not invent findings at pack creation.
