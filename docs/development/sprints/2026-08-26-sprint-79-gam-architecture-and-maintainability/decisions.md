# Sprint 79 — Decision Log

**Sprint status:** OPEN  
**Format:** ID · Decision · Status · Rationale · Consequences

---

## S79-D01 Open Sprint 79 — GAM Architecture and Maintainability

- **Decision:** Open Sprint 79 as a **structural/maintainability GAM architecture reorganisation sprint** with default **behavior preservation**. This sprint is explicitly **not** a learner-quality recovery sprint and does not reopen Sprint 78.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Current GAM behavior is strong and benchmarked, but assembly ownership and dual-path construction are harder to reason about than DLA architecture. Structural clarification can reduce maintenance risk without changing outputs.

- **Consequences:** Opening package [S79-T-001](S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md) is authoritative for architecture map, invariants, target design, refactor slices, and regression/benchmark strategy. Next task is **S79-T-002**.

---

## Guardrails carried by S79-D01

- Sprint 78 remains CLOSED.
- No production refactor was executed in opening task.
- No schema or validator behavior change is authorized by sprint opening.
- Settings implementation remains out of scope; only a neutral policy ingress seam is allowed as architecture intent.

---

## S79-D02 OLD vs TARGET equivalence gate (S79-T-004)

- **Decision:** Accept the off-path canonical GAM assembler (`lib/gam-canonical-assembler.js`) as behaviour-equivalent to current live OLD assembly for committed T-002 same-path baselines, and **authorize** the atomic T-005 live switch. Do **not** perform the switch in T-004.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** OLD COPY == TARGET COPY and OLD STUDIO == TARGET STUDIO byte-for-byte against committed goldens; shared contract/shape/gate byte-identical; high-salience ordering preserved; production still OLD; Studio scaffolds caveat resolved as T-005 wiring (adapter / keep live scaffolds + TARGET graft), not a TARGET normative defect on accepted baselines.

- **Consequences:** Next task is **S79-T-005** atomic routing switch under binding constraints in [S79-T-004](S79-T-004-old-vs-target-equivalence-acceptance-gate.md) (§7 Studio scaffolds; Copy archetype post). Temporary dual-path, if any, must be retired in **S79-T-008**.

---

## S79-D03 Atomic live switch to canonical GAM assembly (S79-T-005)

- **Decision:** Route live Run/Copy and Studio GAM assembly through `lib/gam-canonical-assembler.js` atomically, preserving path-specific composition and T-002 golden byte identity. Keep TEMPORARY assembler-miss fallbacks only until **S79-T-008**.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** T-004 ACCEPTED equivalence; live switch proved LIVE Copy/Studio == committed goldens; Studio full pre-graft chain retained.

- **Consequences:** Next task **S79-T-006**. T-008 must remove TEMPORARY FALLBACK and obsolete normative owners.

---

## S79-D04 Deterministic integration + pre-emit ownership (S79-T-006)

- **Decision:** Treat live canonical GAM integration as hardened: singular pre-emit insertion via assembler (`buildSectionPreEmitGate` → contract SSOT); `LIVE_PRODUCTION` as status marker only; pack-text/materials-preserve as genuine compatibility outside assembler; TEMPORARY FALLBACK inventory binding for T-008.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** T-006 tests prove normal live route is canonical; goldens still match; S78 regressions green; no semantic change.

- **Consequences:** Next task **S79-T-007** behavioural benchmark. Do not start T-008 until T-007.

---

## S79-D05 Behavioural benchmark acceptance + T-008 authorization (S79-T-007)

- **Decision:** Accept fresh post-refactor Lagrangian **91/100** (Excellent; 0 Crit/Major; all activities Strong) as **A — NO MATERIAL REGRESSION** vs pre-S79 **94/100**. Authorize mandatory **S79-T-008**. Treat the initial image mathematical-fidelity defect as **downstream visual**, not GAM semantic regression.

- **Status:** **Accepted** (2026-08-26)

- **Consequences:** T-008 retirement mandatory and not deferrable. Image-gen fidelity remains separate follow-up.

---

## S79-D06 GAM temporary rollback / legacy retirement complete (S79-T-008)

- **Decision:** Treat GAM live architecture as single canonical normative assembly with fail-closed missing-assembler behaviour. Temporary OLD fallbacks and obsolete inline V2 owners are retired. Genuine compatibility and path wrappers retained. DLA dual-path remains untouched.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** T-008 tests + 203/203 regression; live Copy/Studio still byte-match T-002 goldens.

- **Consequences:** Next task **S79-T-009** final regression + closure.

---

## S79-D07 Close Sprint 79

- **Decision:** Close Sprint 79. All S79-T-001 §19 criteria PASS. Formal result **A — SPRINT 79 CLOSED**.

- **Status:** **Accepted** (2026-08-26)

- **Rationale:** Canonical live topology verified; temporary GAM rollback retired; 203/203 deterministic suite; T-007 behavioural acceptance (91 vs 94, no material GAM regression); scope boundaries respected; deferred issues recorded without absorbing them.

- **Consequences:** Sprint 79 CLOSED. Do not reopen for polish. Next programme item is Settings architecture design (PB-FA-005) — **not opened by this decision**. Follow-ups: image-generation precision fidelity; final-render timing-badge regression; guided-review drift; DLA Phase D.
