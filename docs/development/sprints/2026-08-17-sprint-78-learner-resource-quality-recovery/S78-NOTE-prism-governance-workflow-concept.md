# Sprint 78 --- Prism Governance Workflow Concept

**Status:** Concept record; discovered during Sprint 78; not
implemented\
**Purpose:** Capture a proposed project-governance workflow for
maintaining continuity of architectural intent, milestone progress,
evidence, and cognitive load across sprints.\
**Scope:** Development governance. Not a product-generation agent and
not an implementation authority.

------------------------------------------------------------------------

## 1. Core idea

Prism already benefits strongly from sprint-level information
compression:

-   START-HERE;
-   STATUS;
-   PLAN;
-   canonical diagnostics;
-   decisions;
-   explicit deferred work.

This means a working session does not need to reconstruct the whole
sprint every time.

The missing layer is the same mechanism **above the sprint**.

At present, the relationship between sprints, long-lived architectural
decisions, temporary mechanisms, milestone targets, and project
trajectory must still be reconstructed or remembered.

Governance should provide that meta-level compression.

> **Governance should reduce project-level cognitive load, not increase
> process overhead.**

------------------------------------------------------------------------

## 2. What Governance is

Governance is best understood as a **prompt/workflow**, analogous in
spirit to the QA workflow.

It is **not an autonomous agent**.

The governance role belongs to the Design Authority / project owners.
The LLM performs a structured review of curated evidence; humans retain
decision authority.

Governance does not implement solutions or investigate the repository by
default.

------------------------------------------------------------------------

## 3. Primary responsibility

> **Maintain continuity of architectural intent across development
> time.**

Governance asks:

-   Are we still building the thing we decided to build?
-   Does the current sprint advance the current milestone?
-   Is a proposed intervention justified by evidence?
-   Are we fixing a symptom at the wrong architectural layer?
-   Has scope drift occurred?
-   Has a temporary mechanism accidentally become permanent?
-   Has new evidence invalidated an earlier assumption or decision?
-   Are we moving the milestone goalposts?
-   Is the remaining uncertainty shrinking?
-   Are we converging?

------------------------------------------------------------------------

## 4. Governance hierarchy

A useful project hierarchy is:

``` text
Project vision
    ↓
Release / milestone
    ↓
Phase
    ↓
Sprint
    ↓
Task
```

Sprints are implementation units.

**Milestones / phases are governance units.**

Governance should not care whether Alpha v1.0 takes five more sprints or
fifteen. It should care whether each sprint advances the evidence
required to cross the Alpha v1.0 milestone.

------------------------------------------------------------------------

## 5. Three governance cycles

### 5.1 Sprint cycle

#### Opening Review --- routine

Question:

> Given project history, current milestone, accumulated evidence, debt,
> and backlog, is this the right sprint to run now?

Establish:

-   sprint objective;
-   milestone contribution;
-   success evidence;
-   architectural constraints;
-   known debt;
-   dependencies;
-   explicit non-goals;
-   stop conditions;
-   exception triggers.

#### Exception Review --- conditional only

Do not run simply because the sprint is halfway through.

Run only when a material event may invalidate the opening baseline.

Candidate triggers:

-   material new evidence challenges a sprint assumption;
-   proposed work crosses agreed scope;
-   a repair requires intervention in an unplanned architectural layer;
-   repeated local defects suggest a deeper shared cause;
-   the planned route becomes blocked;
-   a closed decision may need reopening;
-   QA, validation, forensics, or repository evidence materially
    conflict.

The Exception Review should be small:

-   trigger;
-   baseline affected;
-   evidence status;
-   impact level;
-   continue / pause / re-scope / escalate;
-   smallest next evidence request;
-   evidence owner.

#### Closure Review --- routine

Question:

> Did the sprint actually establish what it set out to establish?

Compare:

``` text
opening objective
    ↓
decisions
    ↓
implementation
    ↓
benchmark / validation / QA evidence
    ↓
remaining debt and uncertainty
```

Classify objectives as:

-   ACHIEVED;
-   PARTIALLY ACHIEVED;
-   SUPERSEDED;
-   DEFERRED;
-   UNPROVEN.

Closure should also propose updates to programme-level memory.

------------------------------------------------------------------------

### 5.2 Milestone / release cycle

Governance should define and maintain milestone exit conditions.

For the current pre-Alpha period, the milestone is **Alpha v1.0**.

The exact exit conditions still require deliberate definition, but the
working shape is:

-   reliable end-to-end generation;
-   structural contract preservation;
-   pedagogical intent preserved into learner-facing manifestation;
-   operationally suitable generated materials;
-   complete assembly of the intended package;
-   acceptable instructional-quality floor across representative
    benchmarks;
-   known failure classes detected and failed closed;
-   temporary development instrumentation identified and dispositioned;
-   remaining limitations understood and acceptable for Alpha.

A milestone remains open for an unknown number of sprints until its
evidence conditions are met.

Governance should maintain a **readiness picture**, not predict a sprint
number for release.

------------------------------------------------------------------------

### 5.3 Project cycle

Across milestones, Governance maintains the longer project trajectory:

-   what Prism is ultimately trying to become;
-   major architectural eras/transitions;
-   durable principles;
-   established capabilities;
-   recurring failure classes;
-   accepted and retired debt;
-   milestone history;
-   future directional intent.

This prevents each release from becoming an isolated local optimisation.

------------------------------------------------------------------------

## 6. Programme-level curated evidence

Governance should not ingest the whole repository or every historical
sprint by default.

It needs **curated programme memory**.

Candidate artefacts:

### PROJECT-TRAJECTORY.md

Answers:

> What is Prism trying to become, and what major architectural stages
> have we passed through?

This should compress history into meaningful architectural eras, not
reproduce a chronological sprint diary.

### EVIDENCE-AND-DECISION-REGISTER.md

Answers:

> What important things have we established, decided, supported, or left
> unresolved?

Suggested evidence vocabulary:

-   **PROVEN** --- deterministic / repository evidence establishes the
    claim;
-   **SUPPORTED** --- multiple observations strongly support it;
-   **HYPOTHESIS** --- plausible, awaiting verification;
-   **DECISION** --- architectural/design choice rather than empirical
    claim;
-   **SUPERSEDED** --- replaced by later evidence or decision.

### ARCHITECTURAL-DEBT-REGISTER.md

Answers:

> What is deliberately temporary, incomplete, deferred, or accepted, and
> why?

This is especially important for temporary verification/instrumentation.

### MILESTONE-REGISTER.md

For each milestone:

-   intent;
-   exit conditions;
-   evidence requirements;
-   current readiness;
-   accepted limitations;
-   blockers;
-   relevant backlog;
-   closure evidence.

### Existing backlog

Answers:

> What candidate work remains?

Backlog items can be related to the current milestone without all
becoming release requirements.

Useful distinctions:

-   milestone blocker;
-   milestone candidate;
-   post-milestone;
-   exploratory.

------------------------------------------------------------------------

## 7. Progressive disclosure

Programme memory should support:

``` text
programme summary
    ↓
sprint summary
    ↓
canonical diagnostic / decision
    ↓
repository evidence
```

Do not begin at the bottom unless the decision requires it.

This is both a governance principle and a token-economy principle.

------------------------------------------------------------------------

## 8. Governance as evidence traffic control

Governance should identify **what kind of evidence is missing** rather
than investigate everything itself.

Possible owners:

  Evidence need                      Owner
  ---------------------------------- -----------------------------------
  Desired behaviour / architecture   Design Authority
  Structural fact                    Deterministic validator
  Learner-resource quality           QA
  Semantic generation lineage        Generation Forensics
  Implementation / history           Cursor / Repository Investigation

A key output field should be:

> **Smallest next evidence request**

This prevents "audit the repository" from becoming the default response
to uncertainty.

------------------------------------------------------------------------

## 9. Relationship to Alpha v1.0

Governance should help distinguish:

### Genuine Alpha blocker

A newly discovered defect invalidates an Alpha exit condition.

### Desirable later improvement

A useful capability or refinement that does not prevent the Alpha claim.

This distinction protects the milestone from endless expansion while
still allowing genuinely important discoveries to change the route.

Governance should be allowed to say:

> **This sprint should not happen yet.**

It should also be allowed to say:

> **This issue does not justify delaying Alpha; record it for a later
> milestone.**

------------------------------------------------------------------------

## 10. Suggested governance output

A governance review should be concise.

``` text
Governance Review

Current milestone:
Target:
Current objective:

PROVEN:
SUPPORTED:
UNRESOLVED:
DEFERRED:

Alignment:
ON TRACK | AT RISK | OFF TRACK

Scope:
- in scope
- explicitly out of scope

Decision gates:
- authorised
- not yet authorised
- evidence required

Smallest next evidence request:

Evidence owner:
Design Authority | Validator | QA | Generation Forensics | Repository Investigation

Temporary mechanisms / debt:

Recommended next action:
ONE bounded action
```

Long narrative reports are a failure mode. Governance exists to compress
state.

------------------------------------------------------------------------

## 11. Maintenance model

Programme-level records should not become another manual documentation
burden.

At Sprint Closure, Governance should propose programme-memory deltas:

-   trajectory changes;
-   evidence-register additions/promotions/demotions;
-   debt created/retired;
-   milestone-readiness changes;
-   backlog additions/removals/reprioritisation;
-   compressed sprint-history entry.

Humans approve those updates.

This makes curated project memory an output of governance rather than an
independent chore.

------------------------------------------------------------------------

## 12. Relationship to current Sprint 78 practice

Sprint 78 already demonstrates informal governance discipline through
repeated constraints such as:

-   do not reopen Sprint 77;
-   do not execute T-019 prematurely;
-   do not sanitise E2 malformed output;
-   do not weaken QA to hit the target;
-   do not treat temporary T-017/T-018 instrumentation as permanent
    architecture;
-   diagnose before assigning ownership;
-   do not close learner-facing defects on unit tests alone.

The proposed Governance workflow formalises this kind of discipline
across sprints and milestones.

------------------------------------------------------------------------

## 13. Current status

Do not implement immediately.

First:

1.  preserve the concept;
2.  use the model manually at meaningful boundaries;
3.  define Alpha v1.0 exit conditions;
4.  determine the minimum programme-level curated artefacts;
5.  refine the workflow from actual use;
6.  only then consider making Governance a first-class Prism workflow.

The objective is not more process.

The objective is **trustworthy project memory, lower cognitive load,
clearer milestone progress, and better decisions with less repeated
reconstruction**.
