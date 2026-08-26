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
  -> S79-T-003 Introduce canonical section-builder module (off-path)
  -> S79-T-004 OLD vs TARGET equivalence acceptance gate
  -> S79-T-005 Live-path switch to canonical (Run/Copy + Studio)
  -> S79-T-006 Deterministic integration + genuine compatibility isolation + pre-emit ownership
  -> S79-T-007 Fresh behavioural benchmark
  -> S79-T-008 Post-benchmark temporary rollback/legacy retirement  ← mandatory
  -> S79-T-009 Final regression + closure gate
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

- Mode: implementation off live path
- Purpose: build canonical GAM assembler without switching production; consume T-002 ledger/goldens
- Acceptance: unit/equivalence tests; live path still old; finalize shared-builder topology for atomic T-005

### S79-T-004 — OLD vs TARGET equivalence acceptance gate

- Mode: gate (no production switch yet)
- **Required before first production switch:**
  - OLD vs TARGET section/invariant ledger;
  - byte/text equivalence where strict preservation is expected;
  - explicit ordering equivalence for high-salience sections;
  - operator acceptance that protected GAM invariants are preserved
- Acceptance: gate recorded as ACCEPTED before T-005

### S79-T-005 — Live-path switch to canonical assembly

- Mode: production switch
- Scope: Run/Copy and Studio consume canonical GAM assembly (atomic or sequential per recorded decision)
- Preconditions: T-004 ACCEPTED
- Acceptance: both live paths on canonical assembly; temporary dual-path state (if any) bounded and time-limited — not indefinite

### S79-T-006 — Deterministic integration + genuine compatibility isolation + pre-emit ownership

- Mode: implementation / hardening
- Purpose: deterministic regressions; isolate product-required compatibility adapters; consolidate final pre-emit ownership
- Acceptance: Sprint 78 GAM regressions + prompt/contract suites pass; compatibility adapters clearly separated from temporary rollback

### S79-T-007 — Fresh behavioural benchmark

- Mode: benchmark evidence
- Purpose: show no material learner-resource regression after live switch
- Acceptance: selected benchmark evidence recorded (Lagrangian primary; HR corroborative as needed)

### S79-T-008 — Post-benchmark temporary rollback / legacy retirement

- Mode: mandatory cleanup (not optional Phase D)
- Preconditions: T-005 complete; T-006 deterministic gates pass; T-007 benchmark shows no material regression
- Must:
  - remove or hard-disable temporary old GAM assembly / rollback path;
  - remove duplicated normative owners made obsolete by the canonical path;
  - retire or rewrite tests whose only purpose is rollback retention;
  - preserve genuinely required compatibility adapters;
  - run the relevant deterministic regression suite
- Acceptance: no standing temporary dual GAM assembly path remains

### S79-T-009 — Final regression + closure gate

- Mode: sprint closure gate
- Purpose: final deterministic suite + closure readiness after retirement
- Acceptance: criteria in [S79-T-001](S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md) §19 met

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
