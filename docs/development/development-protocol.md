# PRISM Development Protocol

## Purpose

PRISM is currently in **pre-Alpha hardening**.

This protocol defines a lightweight, evidence-led way of working that preserves architectural continuity, reduces conceptual drift, and keeps development aligned with the current programme milestone.

The operating model is:

```text
bounded sprint work
+ canonical sprint records
+ programme-level Governance
+ repository / behavioural evidence
```

The older global continuity model based on `current-state.md`, session handovers, chat bootstraps and context packs is retired.

---

## Core principles

- milestone alignment before feature accumulation;
- architectural clarity over speculative expansion;
- explicit workflow and semantic ownership;
- artefact-centric architecture;
- deterministic work in deterministic code;
- inspectability over hidden recovery;
- evidence before architectural change;
- bounded implementation and reversible commits;
- preserve current intended behaviour, not obsolete pre-release states;
- promote only programme-significant learning into Governance.

---

## Development cycle

A typical sprint cycle is:

1. **orient** — establish the milestone, relevant Governance constraints and bounded problem;
2. **investigate** — gather current evidence and identify the owning layer;
3. **plan** — define the smallest coherent implementation or diagnostic slice;
4. **implement narrowly**;
5. **verify behaviour** with explicit provenance;
6. **document sprint evidence and decisions**;
7. **curate Governance deltas** where programme-level knowledge changed;
8. **commit a coherent slice**;
9. **close or continue the sprint** based on evidence.

Do not turn routine implementation into programme Governance.

---

# Sprint folders

## Canonical location

Each sprint has a canonical folder under:

`docs/development/sprints/`

The sprint folder is the authoritative bounded development record for that sprint.

It may contain, as appropriate:

- sprint definition / start-here document;
- goals and non-goals;
- investigation notes;
- implementation plans;
- decisions;
- evidence and generated diagnostic artefacts;
- QA or forensic reports;
- closure / check-in notes;
- bounded prompts used to continue or verify the work.

There is no requirement for every sprint to contain an identical fixed set of files.

The folder should contain what is necessary to understand, verify and continue the sprint without recreating a global rolling state document.

---

## Sprint opening

At sprint opening:

1. identify the current milestone in `governance/MILESTONES.md`;
2. state which milestone condition or explicit investigation the sprint advances;
3. review relevant entries in:
   - `governance/EVIDENCE-AND-DECISIONS.md`;
   - `governance/ARCHITECTURAL-DEBT.md`;
4. load broader trajectory/history only if needed;
5. define bounded goals, non-goals and expected evidence;
6. identify the likely owning architectural layer before proposing changes.

A sprint may legitimately be exploratory, but the reason for exploration should be explicit.

---

## During a sprint

Keep work bounded and evidence-led.

When a failure is observed:

1. preserve the produced artefacts;
2. distinguish current evidence from historical intent;
3. identify the earliest proven point of degradation;
4. establish the owning layer;
5. change the definitive owner rather than patching downstream symptoms.

A mid-sprint Governance review is warranted when:

- evidence falsifies a major sprint assumption;
- the proposed fix implies architectural change;
- scope expands materially;
- a blocker threatens the current milestone;
- a retired direction is being reconsidered;
- new evidence changes what counts as sufficient milestone quality.

Ordinary implementation choices do not require Governance review.

---

## Sprint closure

At closure:

1. record what was actually changed;
2. record verification evidence and provenance;
3. distinguish implemented behaviour from unverified intent;
4. record unresolved sprint-local issues;
5. prepare a coherent commit/checkpoint;
6. ask:

> **What changed at programme level?**

Only update Governance when the sprint changes:

- programme trajectory;
- durable evidence or decisions;
- programme-significant architectural debt;
- milestone evidence/blockers;
- a retired/disproven direction.

Most sprint detail remains in the sprint folder.

---

# Governance

Programme-level Governance lives in:

`docs/development/governance/`

Its operational authorities are:

- `MILESTONES.md` — current target and exit evidence;
- `EVIDENCE-AND-DECISIONS.md` — durable programme knowledge;
- `ARCHITECTURAL-DEBT.md` — programme-significant unresolved/retired architecture;
- `PROJECT-TRAJECTORY.md` — compressed architectural journey.

`PRISM-PROGRAMME-SYNTHESIS-S28-78.md` is curated historical provenance, not routine sprint context.

See `governance/README.md` for the Governance workflow and authority model.

---

# Evidence and implementation disciplines

Architectural consolidation and removal work follows `ENGINEERING-DISCIPLINES.md`.

In particular:

- prove evidence provenance;
- establish ownership before change;
- baseline and inventory before removal;
- prefer small reversible commits;
- perform residue sweeps;
- treat the production browser path as authoritative where relevant;
- do not use historical artefacts as proof of current behaviour.

---

# Collaboration model

PRISM development may use different tools for different roles.

## Project/design authority

Owns:

- product vision;
- milestone judgement;
- architectural and educational decisions;
- acceptance of evidence;
- scope and priority.

## ChatGPT

Best suited to:

- architecture and synthesis;
- pedagogical/product reasoning;
- programme curation and Governance;
- diagnostic framing;
- comparison of artefacts;
- bounded prompts/investigation plans.

## Copilot / model-visible diagnostic review

Useful for:

- inspecting produced generation artefacts;
- identifying likely first-loss boundaries;
- testing hypotheses about model-visible contracts;
- narrowing questions before repository inspection.

Diagnostic prompting must avoid contaminating the generation run being investigated.

## Cursor

Best suited to:

- bounded repository verification;
- implementation and refactoring;
- code/path tracing;
- runtime verification;
- focused tests and residue sweeps.

Prefer using repository inspection to **verify bounded hypotheses** rather than repeatedly performing broad audits where artefact-level diagnosis can narrow the search first.

---

# Fresh-chat / context loading

There is no mandatory chat-bootstrap package.

For a new development context:

1. identify the active sprint folder;
2. load only the sprint files relevant to the current bounded task;
3. load `governance/MILESTONES.md`;
4. load relevant Governance evidence/debt entries when they constrain the task;
5. load implementation files only as needed.

Broader historical context should be loaded progressively:

```text
current sprint
→ operational Governance
→ programme trajectory
→ programme synthesis
→ older sprint/archive evidence
```

Do not load large historical packs by default.

---

# Documentation ownership

Use the narrowest appropriate authority:

- **current sprint folder** — bounded work, evidence, decisions and closure;
- **Governance** — durable programme-level knowledge and milestone alignment;
- **development protocol** — how development work is conducted;
- **engineering disciplines** — how evidence-led architectural consolidation is performed;
- **shared vocabulary** — stable shorthand and semantic terminology;
- **canonical architecture/schema documents** — specific current technical contracts;
- **archive/Git history** — superseded process artefacts and historical implementation.

Avoid creating another rolling `current-state.md`.

---

# Archive and deletion

Archive historical documentation when it remains useful provenance but no longer describes current practice.

Delete administrative artefacts when they have no continuing evidential or architectural value.

Do not preserve obsolete active mechanisms solely for history; Git history remains the implementation archive.

---

# Lightweight rule

Process exists to reduce cognitive load and protect architectural learning.

If a process artefact starts accumulating routine history, duplicates another authority, or requires substantial archaeology to use, curate or retire it rather than allowing it to become another source of truth.
