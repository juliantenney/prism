# Sprint 79 — Plan

**Status:** OPEN  
**Opening decision:** [S79-D01](decisions.md#s79-d01-open-sprint-79--gam-architecture-and-maintainability)  
**Dashboard:** [STATUS.md](STATUS.md)

Task IDs: `S79-T-###`. Decision IDs: `S79-D##`.

---

## Method (binding)

```text
inventory
  → canonical ownership
  → equivalence baseline/ledger
  → off-path canonical assembly
  → explicit OLD vs TARGET equivalence acceptance
  → live-path switch
  → deterministic integration gates
  → fresh behavioural benchmark
  → explicit legacy/rollback retirement
  → final regression/closure gate
```

**Lesson from DLA Phase D:** temporary rollback left as deferred cleanup became standing dual-path debt. Sprint 79 must **not** leave GAM legacy/rollback cleanup as optional future Phase D.

Distinguish:

| Class | Treatment |
| --- | --- |
| **TEMPORARY ROLLBACK PATH** | Must be retired in-sprint after behavioural gate |
| **GENUINE COMPATIBILITY PATH** | May remain if product-required (e.g. pack-text) |

**DLA Phase D itself** is **not** retired inside Sprint 79 — separate deferred/backlog work. Apply its lesson to GAM only.

---

## Programme sequence

```text
S79-T-001 Sprint open + diagnostic + target design + implementation plan ✅ COMPLETE
  -> S79-D01 Open Sprint 79 ✅ Accepted
  -> S79-T-002 Canonical GAM section inventory + byte-equivalence baseline ✅ COMPLETE
       (switch recommendation: ATOMIC; topology detail deferred to T-003)
  -> S79-T-003 Introduce canonical section-builder module (off-path) ✅ COMPLETE
  -> S79-T-004 OLD vs TARGET equivalence acceptance gate ✅ COMPLETE — **ACCEPTED**
  -> S79-T-005 Live-path switch to canonical (Run/Copy + Studio) ✅ COMPLETE
  -> S79-T-006 Deterministic integration + genuine compatibility isolation + pre-emit ownership ✅ COMPLETE
  -> S79-T-007 Fresh behavioural benchmark ✅ ACCEPTED (A — no material regression)
  -> S79-T-008 Post-benchmark temporary rollback/legacy retirement ✅ COMPLETE
  -> S79-T-009 Final regression + closure gate ✅ COMPLETE — Sprint 79 CLOSED
```

---

## Task definitions

### S79-T-001 — Sprint open diagnostic/target design/implementation plan

- Status: COMPLETE
- Record: [S79-T-001](S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md)
- Mode: documentation + architecture diagnostics only

### S79-T-002 — Canonical GAM section inventory and equivalence baseline

- Status: **COMPLETE** — [S79-T-002](S79-T-002-canonical-gam-section-inventory-and-equivalence-baseline.md)
- Mode: design + tests only (no production behavior switch)
- Delivered: section ledger; Run/Copy + Studio anatomies; golden baselines under `tests/fixtures/s79-t-002/`; equivalence classification; ordering ledger; **ATOMIC** switch recommendation
- Acceptance: MET

### S79-T-003 — Off-path canonical section-builder module

- Status: **COMPLETE** — [S79-T-003](S79-T-003-off-path-canonical-gam-section-builder.md)
- Mode: implementation off live path
- Delivered: `lib/gam-canonical-assembler.js`; Copy/Studio profiles; policy-ingress seam; OLD vs TARGET whole-prompt byte identity on T-002 baselines; atomic T-005 topology
- Acceptance: MET

### S79-T-004 — OLD vs TARGET equivalence acceptance gate

- Status: **COMPLETE — ACCEPTED** — [S79-T-004](S79-T-004-old-vs-target-equivalence-acceptance-gate.md)
- Mode: gate (no production switch)
- Delivered: formal ledger; same-path whole-prompt byte identity; ordering; Studio scaffolds clarification; decision **ACCEPTED**
- Acceptance: MET — T-005 authorized, not performed

### S79-T-005 — Live-path switch to canonical assembly

- Status: **COMPLETE** — [S79-T-005](S79-T-005-atomic-live-path-switch-to-canonical-gam-assembly.md)
- Mode: production switch (atomic)
- Delivered: Run/Copy + Studio on `lib/gam-canonical-assembler.js`; live == T-002 goldens; Studio full scaffolds preserved; TEMPORARY fallbacks recorded for T-008
- Acceptance: MET

### S79-T-006 — Deterministic integration + genuine compatibility isolation + pre-emit ownership

- Status: **COMPLETE** — [S79-T-006](S79-T-006-deterministic-integration-compatibility-isolation-pre-emit.md)
- Mode: integration hardening (no semantic retune; no T-008 retirement)
- Delivered: live topology proof; `PRISM_GAM_CANONICAL_ASSEMBLER` classification; singular pre-emit ownership; compatibility isolation; T-008 inventory; T-006 tests
- Acceptance: MET

### S79-T-007 — Fresh behavioural benchmark

- Status: **COMPLETE — ACCEPTED** — [S79-T-007](S79-T-007-fresh-behavioural-benchmark.md)
- Result: Lagrangian **91/100** vs continuity **94/100**; Excellent; 0 Crit/Major; **A — NO MATERIAL REGRESSION**
- Image fidelity: deferred (not GAM regression)
- Authorizes T-008

### S79-T-008 — Post-benchmark temporary rollback / legacy retirement

- Status: **COMPLETE** — [S79-T-008](S79-T-008-mandatory-temporary-rollback-legacy-retirement.md)
- Delivered: Copy/Studio fail-closed; OLD normative owners removed/thin-wrapped; compat + wrappers retained; 203/203 tests
- Acceptance: MET

### S79-T-009 — Final regression + closure gate

- Status: **COMPLETE** — [S79-T-009](S79-T-009-final-regression-and-sprint-closure-gate.md)
- Final suite: **203/203 pass**
- Formal decision: **A — SPRINT 79 CLOSED** (2026-08-26)
- Closeout: [sprint-79-closeout.md](../../../sprints/sprint-79-closeout.md)

---

## Scope guard

Do not:
- implement settings behavior;
- implement workspace-surface redesign;
- alter schemas/validators/DLA/Design Page ownership;
- remove OPS verifier;
- retire DLA Phase D code inside this sprint;
- leave GAM temporary rollback as deferred cleanup;
- generate new benchmark artefacts during early internal refactor slices unless gate-triggered.
