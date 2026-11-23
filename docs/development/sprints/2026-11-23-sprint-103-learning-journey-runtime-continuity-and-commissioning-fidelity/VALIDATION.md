# Sprint 103 — Validation ledger

**Status:** **CLOSED** — principal objectives evidenced; see [SPRINT-103-CLOSURE.md](SPRINT-103-CLOSURE.md)  
**Classification key:** see [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Manual pack:** [MANUAL-JOURNEY-BRIEF-AND-CHECKLIST.md](MANUAL-JOURNEY-BRIEF-AND-CHECKLIST.md)  
**Manual journey:** *Judging Evidence in Clinical Decisions* (do **not** regenerate for closure)

---

## Evidence distinctions (hard rule)

| Class | Meaning |
| ----- | ------- |
| **Automated test** | Node focused suites; contract/wiring/parser/estimator behaviour only |
| **Manual browser** | Human run in PRISM authoring / learner shell / reload / Clear run |
| **Static exported-package QA** | Inspection of exported Learning Journey package / republished artefacts without a timed learner study |
| **Unverified / deferred** | Explicitly not claimed; backlog or later sprint |

Do **not** claim formal accessibility testing of the complete journey.  
Do **not** claim measured learner-time validation (stopwatch / cohort timings).  
Do **not** equate planned component minutes summing to 180 with verified workload fidelity.

---

## Carry-in from Sprint 102 (reuse; do not over-claim)

| Evidence | Class |
| -------- | ----- |
| LJ Test 1 Expository + Interactive — PASS | **S102 demonstrated** |
| LJ Test 2 Expository + Practice — PASS | **S102 demonstrated** |
| LJ Test 3 unconstrained Design Page — PASS | **S102 demonstrated** (design only) |
| Commission-native bind + browser load fix | **S102 demonstrated** |
| Interactive / Practice journal handoff fixes | **S102 demonstrated** |

---

## Confirmed Sprint 103 manual browser verification

| Probe | Result | Class |
| ----- | ------ | ----- |
| Learning Journey design + commissioning (clinical brief) | **Pass** — five commissions; Practice, Expository, Situated Task, Assessment Pack | Manual browser |
| Four first-class product types exercised | **Pass** | Manual browser |
| Learner-response continuity across resources | **Pass** — earlier responses visible later | Manual browser |
| Learning Journal (four principal contributions) | **Pass** | Manual browser |
| Response persistence + reload | **Pass** | Manual browser |
| Clear run data | **Pass** — no further work | Manual browser |
| Multi-question selection grouping | **Pass** — also confirmed on re-exported journey | Manual browser + static exported-package QA |
| New-LJ Interactive exclusion | **Pass** for this journey | Manual browser |

---

## Additional fixes (automated + targeted manual)

| Change | Automated | Manual / static |
| ------ | --------- | --------------- |
| Artefact consumer allowlist (four products + Interactive legacy) | **Pass** (`s103-artefact-consumer-four-product`) | Exercised by clinical journey consumers |
| S103-D01 commissioning Interactive exclusion | **Pass** (contract tests) | Confirmed on clinical Design Page |
| Assessment Pack JSON fencing | **Pass** (`s103-assessment-pack-json-fencing`) | Observed during AP authoring |
| Clear run learner-runtime isolation | **Pass** (`s103-clear-run-learner-runtime-isolation`) | **Manually verified** |
| Multi-question selection expand | **Pass** (`s103-multi-question-selection-radio-groups`) | **Manually verified** (+ re-export) |
| PB-FA-025 duration guidance refinement | **Pass** (`s103-duration-fidelity-guidance` + s100a/b1/b2/c) | Indicative AP/QA warnings only — **not** timed learner study |
| Practice capital-P list label | **Pass** (s96 / s101 presentation) | Cosmetic |
| Figure-caption spacing | CSS/package polish | Observed during manual QA |

---

## Focused automated regression (closure prep)

Executed together after duration-fidelity implementation:

| Suite | Result |
| ----- | ------ |
| `tests/s103-duration-fidelity-guidance.test.js` | **PASS** |
| `tests/s103-artefact-consumer-four-product.test.js` | **PASS** |
| `tests/s103-assessment-pack-json-fencing.test.js` | **PASS** |
| `tests/s103-clear-run-learner-runtime-isolation.test.js` | **PASS** |
| `tests/s103-multi-question-selection-radio-groups.test.js` | **PASS** |
| `tests/s100a-workload-feasibility-estimator.test.js` | **PASS** |
| `tests/s100b1-interactive-workload-feasibility.test.js` | **PASS** |
| `tests/s100b2-assessment-pack-workload-feasibility.test.js` | **PASS** |
| `tests/s100c-learning-journey-workload-feasibility.test.js` | **PASS** |
| `tests/s94-learning-journey-wp1-continuity-guidance.test.js` | **PASS** |
| `tests/s101-practice-product-identity-and-intake.test.js` | **PASS** |
| `tests/s102e-practice-journal-handoff.test.js` | **PASS** |
| `tests/s97-m3-t2-journal-only-producers.test.js` | **PASS** |
| **Batch total** | **107 pass / 0 fail / 0 skipped** |

Automated checks prove wiring, isolation, fencing, selection expand, and duration-guidance behaviour. They do **not** replace the manual clinical journey.

---

## Unverified / deferred (do not silently close)

| Item | Disposition |
| ---- | ----------- |
| Measured learner completion times / timed cohort study | **Deferred** — remains under [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting) |
| Formal accessibility audit of the complete journey | **Deferred** — not in Sprint 103 scope |
| Regenerating the clinical Learning Journey | **Out of scope** for closure — do not regenerate |
| Clear run data further work | **None** — manually verified |
| Authoritative 180-minute journey / 40-minute final AP allocations | **Preserved** — not altered by duration-guidance work |

---

## Hard rules for entries

- Name the layer proven: authoring / rendering / runtime persistence / journal visibility / response-aware behaviour.  
- Response-aware adaptive activity remains **unsupported** (intentional boundary).  
- Do not treat planned duration arithmetic as measured workload fidelity.
