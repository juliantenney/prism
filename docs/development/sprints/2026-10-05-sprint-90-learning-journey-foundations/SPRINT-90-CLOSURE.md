# Sprint 90 — Closure Record

**Sprint:** 90 — Learning Journey Foundations  
**Opened:** 2026-10-05  
**Closed:** 2026-10-05  
**Status:** **COMPLETE / CLOSED**  
**Type:** Foundations / discovery / experimental prototyping — **not** implementation  
**Opening:** [S90-D01](decisions.md#s90-d01--open-sprint-90--learning-journey-foundations)  
**Close:** [S90-D02](decisions.md#s90-d02--close-sprint-90--learning-journey-foundations-complete)  
**Authoritative foundation:** [LEARNING-JOURNEY-FOUNDATIONS.md](LEARNING-JOURNEY-FOUNDATIONS.md)  
**Predecessor:** [Sprint 89 — COMPLETE / CLOSED](../2026-10-02-sprint-89-architectural-consolidation/SPRINT-89-CLOSURE.md)

## Closure statement

Sprint 90 closed after documenting the Learning Journey foundation and experimentally testing a multi-stage reasoning pipeline across two materially different scales and contexts (undergraduate political philosophy; assessment-and-feedback CPD). The sprint established a provisional product-specification / commissioning contract, identified **Independent Task** as a strong new first-class product candidate, clarified Assessment Pack future capability work, preserved Expository and Interactive without speculative redesign, identified persistence as a cross-product requirement, and recorded the intended final assembly / output responsibility clearly enough for a bounded subsequent implementation decision.

**Closing Sprint 90 does not mean** any of the following have been done:

- Learning Journey implemented as a production product;
- Independent Task implemented;
- Assessment Pack extended;
- Expository changed;
- Interactive changed;
- final Learning Journey JSON / schema fixed;
- delivery / VLE persistence implemented.

Those remain subsequent implementation / product-development concerns. No successor sprint is opened by this closure.

## Exit-criteria assessment

| Criterion | Assessment |
| --------- | ---------- |
| Documented Learning Journey foundation | **Met** — [LEARNING-JOURNEY-FOUNDATIONS.md](LEARNING-JOURNEY-FOUNDATIONS.md) |
| Experimentally tested candidate reasoning pipeline | **Met** — JourneyRequirements → JourneyProgression → JourneyElements → JourneyCommissioning |
| Tested across materially different scales / contexts | **Met** — Experiment A (30h / 10w) and Experiment B (9h / 3w) |
| Provisional learning-element / product-specification contract | **Met** (provisional; schema deferred to implementation) |
| Strong Independent Task product candidate identified | **Met** |
| Assessment Pack future capability clarified | **Met** |
| Expository / Interactive preserved without speculative redesign | **Met** |
| Persistence identified as cross-product requirement | **Met** |
| Final assembly / output responsibility established | **Met** (deterministic design-page / assembly stage; schema deferred) |
| Remaining questions explicit enough for bounded follow-on | **Met** — foundation §15 open questions |

**No unresolved question prevents closure.** Remaining questions are implementation / next-product decisions, not foundation blockers.

## Experimental pipeline (final record)

1. JourneyRequirements → `learning_requirements`
2. JourneyProgression → `learning_progression`
3. JourneyElements → `learning_elements`
4. JourneyCommissioning → `learning_commissions`

Human-readable authoritative artefacts. Production later adds a deterministic design-page / assembly stage. JSON/schema deferred.

## Worked experiments (summary)

| Experiment | Envelope | Constituent journeys | Elements | Commissioning note |
| ---------- | -------- | -------------------- | -------- | ------------------ |
| A — Political philosophy | 30h / 10w | 4 (developmental; one 11h) | 24 | 19.25h current products; 10.75h unsupported (purposeful learner-controlled activity) |
| B — Assessment & feedback CPD | 9h / 3w | 3 (3h / 2.5h / 3.5h) | 12 | Full envelope accounted; Interactive stretched for contextual work → Independent Task evidence |

**Cross-experiment:** independent academic study and situated professional application appear as variants of the same product-level educational job.

## Provisional product family (hypothesis)

Expository · Interactive · **Independent Task** (candidate) · Assessment Pack

Not a permanently closed taxonomy. Test through subsequent real Learning Journey use.

## Production code

Sprint 90 made **no** production code, prompt, workflow JSON, or test changes as part of this closure.
