# Sprint 101 — Architectural risks and deferred work

**Sprint status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS** · [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md)

| ID | Note | State |
| -- | ---- | ----- |
| S101-AD-001 | Practice must not thin shared Interactive scaffolds globally; differences must be Practice-owned or product-gated — **not** Interactive LJ-context branches | **Addressed in 101D** — Practice-owned contracts |
| S101-AD-002 | Existing LJ `product_id: "interactive"` commissions must remain valid; Practice must be additive | **Held** — additive Practice only |
| S101-AD-003 | Renderer default `pageKind: "interactive"` may mis-handle Practice unless pageKind/validators are explicit | **Addressed in 101D** — explicit `pageKind: "practice"` |
| S101-AD-004 | LJ Design Page fallback that maps unknown acceptances to Interactive is a footgun when adding Practice | **Addressed in 101D** — fail-closed unknown products |
| S101-AD-005 | Episode Plan beat grammar may over-constrain a lean Practice if reused unmodified | **Mitigated** — Practice EP contracts lean; residual design risk |
| S101-AD-006 | GLC → MK → DLO retained this sprint; pipeline efficiency programme deferred | **Deferred** — 101G investigated commission-native Option C; not implemented |
| S101-AD-007 | Practice is **LJ-commissioned only in v1**; Create-standalone Practice deferred | **Held** |
| S101-AD-008 | Assessment Pack `acceptsProductOutputFrom` does not yet include Practice | **Deferred** |
| S101-AD-009 | Workload feasibility mapping for Practice | **Addressed** — adapter + 101F proportionate gates |
| S101-AD-010 | Automatic migration of existing Interactive LJ commissions to Practice is out of scope | **Deferred permanently for this sprint** |
| S101-AD-011 | v1 proposes no new commission JSON fields; revisit if prose-only commissioning proves insufficient | **Open for later** — next sprint (LJ-owned outcomes) may revisit |
| S101-AD-012 | Practice must use own `promptRoute` / contracts — sharing Interactive promptRoute inherits mandatory KS/editorial/bridges | **Addressed in 101D** |
| S101-AD-013 | Renderer defaults unknown pages to `pageKind: "interactive"`; Practice must emit explicit `pageKind: "practice"` | **Addressed in 101D** |
| S101-AD-014 | 101E cannot retrofit Lagrange; requires a new Learning Journey after Practice exists | **Satisfied** — C-series Practice stops used for validation; Lagrange baseline untouched as product retrofit |
| S101-AD-015 | Journal producer / AP `acceptsProductOutputFrom` for Practice deferred unless authorised | **Deferred** |
| S101-AD-016 | C4 A3 — three linked judgements should render as three independent, clearly labelled radio questions | **Non-blocking follow-up** |
| S101-AD-017 | C4 A3 — written justification should be shorter/more focused; remove redundant closure text | **Non-blocking follow-up** |
| S101-AD-018 | Image precision extraction still emits some duplicated/malformed fragments (exact equations preserved) | **Non-blocking follow-up** |
| S101-AD-019 | C4 corrected image render not independently verified (prompt carries all three authorised equations) | **Non-blocking follow-up** |
| S101-AD-020 | Learning Journey–owned outcomes and transmission through commissioning | **Next sprint theme** — not Sprint 101 |
| S101-AD-021 | Journey-level QA | **Subsequent concern** — not Sprint 101 |
