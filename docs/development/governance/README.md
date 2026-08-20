# PRISM Governance

This folder contains PRISM's **programme-level Governance layer**.

Governance sits above individual sprints. Its purpose is to preserve the small amount of curated project knowledge needed to keep development aligned with the product vision, current milestone, accumulated evidence and architectural history without repeatedly re-reading the full sprint record.

Governance is **not an agent** and is not a continuous approval process. It is a lightweight project workflow supported by maintained artefacts and explicit reviews at appropriate points in development.

---

# Governance responsibilities

Governance helps answer:

1. **Where are we trying to get to?**
2. **Why is PRISM architected and designed the way it is?**
3. **What evidence and unresolved debt should constrain current decisions?**
4. **Does current sprint work move the programme toward its milestone without accidentally undoing earlier learning?**

Its purpose is project-level cognitive-load reduction.

---

# Operational authorities

## `MILESTONES.md`

The milestone authority.

Use it for:

- current milestone;
- milestone intent;
- required properties;
- exit evidence;
- blockers and accepted limitations;
- explicit exclusions;
- provisional later milestones.

The current milestone is **Alpha v1.0**.

---

## `EVIDENCE-AND-DECISIONS.md`

The durable evidence/decision register.

Use it for programme knowledge that should survive individual sprint contexts.

Status vocabulary:

- `PROVEN`
- `DECISION`
- `SUPPORTED`
- `HYPOTHESIS`
- `SUPERSEDED`

Historical intent must not be presented as proof of current runtime behaviour.

---

## `ARCHITECTURAL-DEBT.md`

The programme-significant debt and unresolved-question register.

Use it for:

- unresolved architectural questions;
- temporary mechanisms;
- accepted compromises;
- conditional/deferred architectural work;
- retired/disproven directions worth preserving as negative knowledge.

This is **not the product backlog** and should not accumulate ordinary sprint tasks.

---

## `PROJECT-TRAJECTORY.md`

The compact architectural/programme narrative.

Use it to understand:

- how the current architecture emerged;
- why major boundaries exist;
- the significant phases in PRISM's development;
- the programme's current direction.

Update only when the programme trajectory materially changes.

---

# Curated provenance

## `PRISM-PROGRAMME-SYNTHESIS-S28-78.md`

This is the curated historical synthesis from which the initial operational Governance layer was derived.

Consult it when:

- the rationale behind a Governance entry is unclear;
- current work appears to conflict with historical architectural intent;
- deeper programme context is required before returning to individual sprint history.

It is not routine sprint context.

Underlying sprint-curation reviews and canonical sprint records remain deeper provenance.

---

# Evidence authority

For claims about **current behaviour**, prefer current evidence.

A useful working order is:

```text
current code + fresh behavioural evidence
        ↓
current sprint evidence
        ↓
current canonical architecture/contract documents
        ↓
operational Governance
        ↓
programme synthesis / curated reviews
        ↓
older sprint/archive evidence
```

This is not a simple hierarchy for every question.

Governance can be authoritative for a **decision or milestone**, while current runtime evidence is authoritative for **what the product presently does**.

Where evidence and historical intent conflict, do not silently reconcile them. Determine whether:

- later evidence deliberately supersedes the earlier decision;
- the current implementation has regressed;
- the historical mechanism was replaced by an equivalent one;
- the question remains unresolved.

---

# Governance workflow

## Sprint opening

At sprint opening:

1. identify the current milestone;
2. state which milestone condition or explicit investigation the sprint advances;
3. review relevant durable evidence/decisions;
4. review relevant architectural debt;
5. identify retired directions the work could accidentally reintroduce;
6. state the evidence expected at sprint closure.

Governance may challenge work that is interesting but not milestone-relevant or otherwise justified.

It should not prevent legitimate bounded exploration.

---

## During a sprint

Governance is not a continuous approval layer.

Run a mid-sprint Governance review when a material trigger occurs, for example:

- evidence falsifies a major assumption;
- a proposed fix implies architectural change;
- scope expands materially;
- a blocker threatens the milestone;
- new evidence changes what "good enough" means;
- a retired direction is being reconsidered;
- an investigation produces a programme-significant finding.

Ordinary implementation decisions remain sprint-owned.

---

## Sprint closure

Ask:

> **What changed at programme level?**

Promote information only when it changes one of these categories.

### Trajectory

Did the sprint materially change how PRISM works or how the programme understands its architecture?

### Evidence / decision

Did it prove, disprove or establish something future sprints need to know?

### Debt

Did it create, resolve, retire or reclassify a programme-significant architectural issue?

### Milestone

Did milestone evidence, blockers, accepted limitations or exit conditions change?

### Retired direction

Was an approach disproved strongly enough that future work should be warned against repeating it?

Most sprint content should **not** enter Governance.

---

# Milestone / release review

Perform a broader Governance review when:

- entering a new project phase;
- approaching a milestone decision;
- preparing a major release/revision;
- redefining the product target.

At these points, curate programme-significant changes since the previous milestone rather than importing whole sprint histories.

---

# Relationship to other project records

## Sprint folders

`docs/development/sprints/` contains the canonical detailed history of bounded development work.

Sprints own implementation plans, investigations, evidence, sprint decisions and closure records.

Governance owns only what must survive above that level.

---

## Backlog

The backlog contains candidate future work.

A backlog item is not a milestone requirement merely because it exists.

Governance determines whether an item matters to the current milestone and preserves constraints that should shape its eventual implementation.

---

## QA

QA evaluates instructional quality and provides evidence.

A QA score does not by itself prove:

- structural completeness;
- correct semantic lineage;
- correct binding;
- absence of silent omission.

Governance may use QA evidence when judging milestone readiness.

---

## Generation Forensics

Generation Forensics is a context-driven diagnostic method.

It uses produced artefacts to identify likely first-loss boundaries and narrow repository verification.

Forensics produces evidence.

Governance decides whether a finding is durable enough to become programme knowledge.

---

# Maintenance rules

Keep Governance **small and curated**.

Do:

- record durable reasons rather than every event;
- distinguish evidence from hypothesis;
- preserve important negative knowledge;
- update status when evidence changes;
- connect programme decisions to milestone consequences;
- keep deeper provenance in sprint/history records.

Do not:

- duplicate sprint logs;
- turn architectural debt into another backlog;
- accumulate every QA observation;
- promote speculative diagnoses to facts;
- preserve obsolete mechanisms merely because they once existed;
- rewrite historical evidence to fit current assumptions;
- allow these files to become another rolling `current-state.md`.

If routine Governance starts requiring substantial archaeology, curate again.

---

# Initial provenance

The initial Governance layer was created during Sprint 78 following retrospective curation of Sprints 28–78.

That review identified a consistent programme trajectory:

> **PRISM progressively moves educational intent out of fragile prose and implicit model behaviour into explicit, owned, traceable, testable and increasingly deterministic contracts.**

The initial operational artefacts were derived from the reviewed programme synthesis.

From this point, Governance should be maintained incrementally.

---

# Context-loading guidance

For routine sprint Governance, start with:

1. `MILESTONES.md`;
2. relevant entries in `EVIDENCE-AND-DECISIONS.md`;
3. relevant entries in `ARCHITECTURAL-DEBT.md`.

Load `PROJECT-TRAJECTORY.md` when broader architectural context is useful.

Load `PRISM-PROGRAMME-SYNTHESIS-S28-78.md` only when deeper historical rationale is needed.

Return to canonical sprint/archive evidence only for verification or deeper provenance.

**Governance exists to reduce context load, not create another mandatory context pack.**
