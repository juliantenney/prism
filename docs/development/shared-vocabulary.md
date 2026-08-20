# PRISM Shared Operational Vocabulary

These phrases provide lightweight shorthand for PRISM development involving the project/design authority, ChatGPT, Copilot and Cursor.

They are conventions, not strict commands.

Their purpose is to reduce conversational overhead while keeping work bounded, evidence-led and aligned with the current sprint and programme milestone.

---

# Development shorthand

## "Close this sprint" / "Close this phase"

Meaning:

- record outcomes and verification evidence;
- record unresolved issues;
- prepare a coherent commit/checkpoint;
- identify the next bounded focus if known;
- run the sprint-closure Governance check;
- update Governance only for programme-significant deltas.

Do not create global handovers, chat bootstraps or rolling current-state updates.

---

## "Prepare the next sprint"

Meaning:

Create or update the canonical sprint folder with:

- bounded objective;
- relevant context;
- goals and non-goals;
- known constraints;
- expected evidence;
- relevant Governance references;
- initial investigation/implementation plan where appropriate.

There is no mandatory fixed sprint-file template.

---

## "Prepare the next chat" / "Bootstrap this task"

Meaning:

Prepare a **bounded context**, not a historical context pack.

Include only what the next context needs:

- current bounded task;
- relevant sprint files;
- relevant Governance constraints;
- necessary implementation/artefact files;
- a concise starting prompt when useful.

Load deeper history only if the task requires it.

---

## "Run Governance"

Meaning:

Review the work at programme level using `docs/development/governance/`.

At sprint opening, ask:

- what milestone condition does this advance?
- what evidence/decisions constrain it?
- what architectural debt is relevant?
- what evidence should exist at closure?

At sprint closure, ask:

> **What changed at programme level?**

Promote only durable trajectory, evidence/decision, debt, milestone or retired-direction changes.

Mid-sprint Governance requires a material trigger rather than routine approval.

---

## "Consolidation pass"

Meaning:

Focus on:

- cleanup;
- clarification;
- rationalisation;
- consistency;
- ownership;
- stability.

Avoid:

- speculative redesign;
- unrelated feature expansion;
- large conceptual rewrites without evidence.

Use `ENGINEERING-DISCIPLINES.md` for consolidation/removal work.

---

## "Architectural review"

Meaning:

Prioritise:

- conceptual clarity;
- semantics;
- responsibility/ownership;
- system boundaries;
- contracts and schemas;
- current behavioural evidence.

Implementation proposals follow from the architectural finding rather than leading it.

---

## "Generation Forensics"

Meaning:

Investigate a generation defect from produced artefacts before launching a broad repository audit.

Typical approach:

1. preserve the run artefacts;
2. compare expected and observed state;
3. identify the likely first-loss boundary;
4. use diagnostic model review where useful;
5. formulate bounded repository questions;
6. use Cursor/code inspection to verify or falsify those findings.

Do not contaminate the run under investigation by priming the generating model with the hypothesis being tested.

---

## "First loss"

Meaning:

The earliest stage/boundary at which intended instructional or semantic state can be shown to have degraded.

The point where a defect becomes visible is not automatically its cause.

---

## "Bounded Cursor check"

Meaning:

Use repository inspection to answer a specific evidence-led question rather than auditing a broad subsystem without a hypothesis.

Typical output:

```text
CURRENT
RELOCATED
SUPERSEDED
REMOVED DELIBERATELY
REGRESSED
UNKNOWN
```

plus supporting code/runtime evidence.

---

## "Smoke-check"

Meaning:

Perform lightweight runtime/path/UI verification without broad testing or refactoring.

---

## "Bounded task"

Meaning:

A tightly scoped architectural, diagnostic or implementation objective suitable for one coherent development slice.

A sprint may contain several bounded tasks, but each should have clear ownership and evidence.

---

## "Prepare check-in"

Meaning:

Generate:

- concise coherent commit/check-in message;
- summary of architectural/product significance;
- summary of major changes;
- verification/evidence reminder where needed.

Check-ins represent coherent progress, not arbitrary file edits.

---

# Evidence vocabulary

## "Current evidence"

Evidence from the current implementation/run with explicit provenance.

Examples:

- current code revision;
- browser observation;
- current generated artefact;
- focused test;
- runtime trace.

Historical artefacts are context, not current proof.

---

## "Historical intent"

What earlier designs, sprint records or architecture documents show Prism was intended to do.

Historical intent is valuable for detecting possible regression but does not prove current implementation.

---

## "First-pass suitable"

Generated output is operationally usable without relying on a downstream repair mechanism to make the learner task viable.

Diagnostic/verifier tooling may still inspect it.

---

## "Fail closed"

Reject or preserve malformed authoritative output rather than silently converting it into plausible state.

---

# Workflow validation lifecycle

Use this sequence when describing workflow-definition checks:

1. **Normalize** — where owned (for example load/import via `normalizeWorkflowForV1`), reconcile stored shapes and legacy aliases into the current compatible representation. Normalization may record compatibility warnings; it is not validation.
2. **Validate** — `validateWorkflow(wf)` evaluates a **snapshot** of the workflow definition and returns **warnings only**. It does **not** mutate the workflow object.
3. **Surface warnings** — callers decide how warnings appear. Warning surfacing is caller-owned.

Stable phrases:

- **Warning-only** — validation does not itself block save/import/merge.
- **Non-mutating** — `validateWorkflow` does not alter the definition.
- **Caller-owned warning surfacing** — the same result may be presented differently according to context.

Avoid implying:

- blocking validation where none exists;
- an enforcement pipeline;
- schema migration/redesign when documenting compatibility behaviour.

---

# Prompt attachment modes

Stable stored semantics:

- **`library_prompt`** — step uses a Prompt Library asset via `promptId`; an optional trimmed `override_prompt_body` may coexist under compatibility rules.
- **`local_override`** — step uses inline `override_prompt_body`.
- **None / empty** — no runnable library link and no effective local body in the resolved shape; may be a deliberate compatibility state.

Compatibility fields:

- **`prompt_source`** and **`prompt_source_type`** — dual fields retained for compatibility across older data/import paths unless an explicit future sprint changes that contract.

Do not describe these as redundant cleanup targets without current evidence and explicit scope.

---

# Import/export bundles

When documenting workflow export/import:

- describe current behaviour as compatibility-preserving where that remains the implementation;
- bundle-shape descriptions are documentation of current behaviour, not redesign specifications;
- merge/import semantics remain unchanged unless explicitly scoped;
- avoid language implying contract migration or replacement formats without an approved change.

---

# Workflow step identity

- **`step.id`** — persisted workflow-step identity within a workflow's `steps` array; stable handle for bindings/storage.
- **`canonical_step_id`** — semantic/catalog lineage reference; not the primary persisted step identity.
- **Editor DOM rows / run UI** — derived/transient projections, not independent sources of truth alongside `state.workflows`.

---

# Continuity vocabulary

## "Sprint record"

The canonical bounded development record under `docs/development/sprints/`.

It owns sprint-specific plans, investigations, evidence, decisions and closure material.

## "Governance"

The curated programme-level layer under `docs/development/governance/`.

It owns milestone alignment, durable evidence/decisions, programme-significant architectural debt and project trajectory.

## "Archive"

Historical documentation retained for provenance but no longer describing active development practice.

## Retired terminology

The following terms describe superseded process mechanisms and should not be used for new work:

- `context pack`;
- global `current-state.md`;
- global session handover;
- chat bootstrap folder/template as a mandatory continuity mechanism.

When encountered in historical documents, interpret them in their historical context rather than recreating the old workflow.
