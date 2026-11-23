# Sprint 103 — Architectural risks and carry-in

**Sprint status:** **CLOSED — COMPLETE — ACCEPTED WITH DOCUMENTED QUALIFICATIONS**

| ID | Note | State |
| -- | ---- | ----- |
| S103-AD-001 | AP commission-native runtime + journal | **Closed for S103** — manually verified on clinical journey |
| S103-AD-002 | Situated Task commission-native runtime + journal | **Closed for S103** — manually verified on clinical journey |
| S103-AD-003 | Cross-component actual learner-response access | **Closed for S103** — manually verified (earlier responses in later resources + Journal) |
| S103-AD-004 | S103-D01 Interactive exclusion for **new** LJs | **Closed for S103** — prompts + clinical Design Page confirmed |
| S103-AD-005 | Minor prompt / LO authority inconsistencies (S102) | **Watch** — not blocking closure |
| S103-AD-006 | Risk of conflating journal visibility with response-aware activity | **Process** — response-aware = unsupported (intentional) |
| S103-AD-007 | Clear run data omitted learner draft / journal-ack purge | **Closed** — fixed + automated tests + **manual verification**; no further work |
| S103-AD-008 | Adaptive/branching architecture temptation if continuity missing | **Guardrail** — boundary holds; do not expand |
| S103-AD-009 | Four-product + Interactive artefact consumers | **Closed** — allowlist extended; focused tests + manual journey |
| S103-AD-010 | Multi-question selection flatten / radio grouping | **Closed** — shared expand + tests + manual re-export verify |
| S103-AD-011 | Assessment Pack JSON fencing | **Closed** — prompts + focused tests |
| S103-AD-012 | Duration fidelity / measured learner workload ([PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)) | **Open (backlog)** — S103 refined advisory guidance only; measured validation deferred |

Excluded backlog items (do not pull in): PB-FA-030, PB-FA-031, PB-FA-020, PB-FA-026, PB-S-005, PB-FA-010 wholesale migration. Do **not** expand Sprint 103 into measured-time studies under PB-FA-025.
