# Sprint 68 — Risks

| ID | Risk | Impact | Mitigation |
| -- | ---- | ------ | ---------- |
| R1 | Schema gap assumed too early | Unnecessary pipeline work | Enforce renderer-first rule; complete INV-001 before schema proposals |
| R2 | Coherence fix breaks Sprint 67 layout | Regression in shell/nav | Keep changes in activity/beat render layers; run full vNext test suite |
| R3 | Bridge data exists only once in fixture | Over-fitting heteroscedasticity | Compare multiple fixtures before generalising |
| R4 | Preamble and bridge roles conflated | Wrong placement fix | Document semantic intent per field in investigation log |
| R5 | Scope creep into renderer rewrite | Sprint delay | Charter out-of-scope list; review against HANDOVER constraints |
| R6 | Invented transition copy | Non-authoritative content | Never generate bridges; only render existing fields |
| R7 | Coherence gap misattributed to renderer | Wrong fix or wasted effort | Classify each issue: renderer · render model · schema · pipeline |
